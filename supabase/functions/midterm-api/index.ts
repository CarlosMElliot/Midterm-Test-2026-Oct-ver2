import exam from './exam.json' with {type:'json'};
import {score} from './grading.js';
const allowedOrigin='https://carlosmelliot.github.io';
const publicKey='sb_publishable_1aOxVnhGzxLskJqFBZHizA_pdteBEhZ';
const headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':allowedOrigin,'Access-Control-Allow-Headers':'apikey, content-type','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Vary':'Origin'};
const send=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
const secret=()=>{const keys=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');return keys.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;};
async function db(path:string,options:RequestInit={},table='midterm_submissions'){const key=secret();const h:Record<string,string>={'apikey':key,'Content-Type':'application/json',...(options.headers as Record<string,string>||{})};if(!key.startsWith('sb_secret_'))h.Authorization=`Bearer ${key}`;return fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/${table}${path}`,{...options,headers:h});}
export function details(a:any){const r=score(a);return {attemptId:a.id,name:a.name,source:'supabase',score:r.total,maxScore:100,completionCredit:r.completionCredit,gradingStatus:r.final?'Final':'Awaiting teacher review',pendingQuestions:r.pending,submittedAt:a.submitted_at,updatedAt:a.updated_at,sections:r.sections.map((s:any,i:number)=>({...s,questions:s.questions.map((q:any,j:number)=>{const original=a.exam.sections[i].questions[j];const blank=q.response===''||(typeof q.response==='string'&&!q.response.trim());return {...q,teacherGraded:a.grades[q.id]!==undefined,type:original.type,options:original.type==='choice'?original.options:[],status:blank?'Unanswered':q.reviewPending?'Pending teacher review':original.type==='choice'&&original.answer!==null?(q.response===original.answer?'Correct':'Incorrect'):'Teacher graded'};})}))};}
const digest=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
Deno.serve(async req=>{try{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 // Public application-key authentication; name-only student submissions are intentional.
 if(req.headers.get('apikey')!==publicKey)return send({error:'Application key required'},401);
 const action=new URL(req.url).searchParams.get('action');
 if(req.method==='GET'&&action==='results'){const rows=[];for(let offset=0;;offset+=500){const r=await db(`?select=*&order=submitted_at.desc,id.asc&limit=500&offset=${offset}`);if(!r.ok)throw Error('Could not load saved responses');const batch=await r.json();rows.push(...batch.map(details));if(batch.length<500)break;}return send({results:rows});}
 if(req.method!=='POST'||!['submit','grade'].includes(action||''))return send({error:'Unknown operation'},404);
 const origin=req.headers.get('origin');if(origin&&origin!==allowedOrigin)return send({error:'Origin not allowed'},403);
 const raw=await req.text();if(raw.length>250000)return send({error:'Response too large'},413);
 let b;try{b=JSON.parse(raw);}catch{return send({error:'Invalid JSON'},400);}
 if(action==='grade'){
  if(typeof b.editCode!=='string'||b.editCode.length>200)return send({error:'Teacher edit code required'},401);
  const access=await db('?id=eq.true&select=code_hash',{},'midterm_teacher_access');if(!access.ok)throw Error('Teacher access is unavailable');
  const configuration=(await access.json())[0];if(!configuration||await digest(b.editCode)!==configuration.code_hash)return send({error:'Incorrect teacher edit code'},401);
  if(!/^[a-f0-9-]{36}$/i.test(b.attemptId||''))return send({error:'Invalid attempt'},400);
  const existing=await db(`?id=eq.${b.attemptId}&select=*`);if(!existing.ok)throw Error('Could not load attempt');const a=(await existing.json())[0];if(!a)return send({error:'Attempt not found'},404);
  if(b.updatedAt!==a.updated_at)return send({error:'Grades changed since you opened this attempt. Refresh and review before saving.'},409);
  if(!b.grades||typeof b.grades!=='object'||Array.isArray(b.grades))return send({error:'Invalid grades'},400);
  const grades={...a.grades};for(const [id,v] of Object.entries(b.grades)){const q=a.exam.sections.flatMap((s:any)=>s.questions).find((q:any)=>q.id===id);if(!q||v!==null&&(typeof v!=='number'||!Number.isFinite(v)||v<0||v>q.max))return send({error:'Points must be between zero and the question maximum'},400);if(v===null)delete grades[id];else grades[id]=v;}
  const saved=await db(`?id=eq.${b.attemptId}&updated_at=eq.${encodeURIComponent(a.updated_at)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({grades})});if(!saved.ok)throw Error('Could not save grades');const updated=(await saved.json())[0];if(!updated)return send({error:'Another update was saved first. Refresh and retry.'},409);return send({ok:true,result:details(updated)});
 }
 if(b.examVersion!==exam.version)return send({error:'Test version changed. Download your answers and contact your teacher.'},409);
 if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(b.clientId||''))return send({error:'Invalid attempt ID'},400);
 const name=typeof b.name==='string'?b.name.trim():'';if(name.length<2||name.length>100)return send({error:'Enter a name (2–100 characters)'},400);
 if(!b.answers||typeof b.answers!=='object'||Array.isArray(b.answers))return send({error:'Answers required'},400);
 const questions=exam.sections.flatMap(s=>s.questions),answers:Record<string,unknown>={};
 for(const [id,v] of Object.entries(b.answers)){const q=questions.find(q=>q.id===id);if(!q||(q.type==='choice'?(!Number.isInteger(v)||Number(v)<0||Number(v)>=q.options!.length):(typeof v!=='string'||v.length>20000)))return send({error:'Invalid answer'},400);answers[id]=v;}
 const fingerprint=await digest(JSON.stringify({name,answers:Object.fromEntries(Object.entries(answers).sort()),version:exam.version}));
 const record={id:b.clientId.toLowerCase(),name,answers,exam,fingerprint,client_started_at:typeof b.startedAt==='string'?b.startedAt.slice(0,40):null,violations:Number.isInteger(b.violations)?Math.max(0,Math.min(3,b.violations)):0};
 const inserted=await db('',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(record)});
 let saved;if(inserted.ok)saved=(await inserted.json())[0];else if(inserted.status===409){const existing=await db(`?id=eq.${record.id}&select=*`);if(!existing.ok)throw Error('Unable to verify saved response');saved=(await existing.json())[0];if(!saved||saved.fingerprint!==fingerprint)return send({error:'This attempt was already submitted with different answers'},409);}else throw Error('Your response could not be saved. Please retry.');
 const r=details(saved);return send({ok:true,receipt:{id:saved.id,provider:'supabase',submittedAt:saved.submitted_at,score:r.score,maxScore:100,pendingQuestions:r.pendingQuestions,completionCredit:r.completionCredit,gradingStatus:r.gradingStatus,repositorySync:'pending'}});
 }catch(e){return send({error:e instanceof Error?e.message:'Submission failed'},500);}});
