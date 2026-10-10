import {score,report} from './grading.js';
const KEY='high-note-midterm-static-v2';
let examPromise;
export function getExam(){return examPromise??=fetch(new URL('exam.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Could not load the test. Check your connection and try again.');return r.json();});}
export function readStore(){const raw=localStorage.getItem(KEY);if(!raw)return {active:null,attempts:[]};try{const data=JSON.parse(raw);if(!Array.isArray(data.attempts))throw Error();return data;}catch{throw Error('Saved browser data could not be read. Use another browser or ask your teacher for help.');}}
function writeStore(store){try{localStorage.setItem(KEY,JSON.stringify(store));}catch{throw Error('Browser storage is unavailable or full. Your latest change was not saved. Download your work before closing.');}}
export function localAttempts(){return readStore().attempts;}
export async function api(path,data={}){
 if(path==='exam')return {exam:await getExam(),open:true,resetNotice:!!readStore().resetNotice};
 const store=readStore(),a=store.attempts.find(a=>a.id===store.active),now=new Date().toISOString();
 if(path==='attempt'){if(!a)throw Error('No active attempt');return structuredClone(a);}
 if(path==='new-response'){if(a?.status==='in_progress')throw Error('Finish your current attempt first.');store.active=null;store.resetNotice=false;writeStore(store);return {ok:true};}
 if(path==='start'){
  if(a?.status==='in_progress')throw Error('Resume your current attempt.');
  const name=String(data.name||'').trim();if(name.length<2||name.length>100)throw Error('Enter your name (2–100 characters).');
  const next={format:'high-note-static-response-v1',id:crypto.randomUUID(),name,exam:await getExam(),answers:{},grades:{},status:'in_progress',position:0,violations:0,events:[],startedAt:now,updatedAt:now};store.active=next.id;store.attempts.push(next);writeStore(store);return {ok:true};
 }
 if(!a)throw Error('No active attempt');
 if(path==='submit'&&a.status==='submitted')return {ok:true};
 if(a.status!=='in_progress')throw Error('This attempt is closed.');
 if(path==='save'){
  for(const [id,v] of Object.entries(data.answers||{})){const q=a.exam.sections.flatMap(s=>s.questions).find(q=>q.id===id);if(!q||(q.type==='choice'?(!Number.isInteger(v)||v<0||v>=q.options.length):typeof v!=='string'||v.length>20000))throw Error('Invalid answer.');a.answers[id]=v;}
  if(Number.isInteger(data.position)&&data.position>=0&&data.position<1000)a.position=data.position;
 }else if(path==='violation'){
  if(Date.now()-(a.lastViolation||0)>1500){a.lastViolation=Date.now();a.violations++;a.events.push({type:'focus_leave',at:now,reason:String(data.reason||'leave').slice(0,60)});}
  if(a.violations>=3){a.status='reset';store.active=null;store.resetNotice=true;}
 }else if(path==='submit'){a.status='submitted';a.submittedAt=now;a.events.push({type:'submitted',at:now});}else throw Error('Unknown action');
 a.updatedAt=now;writeStore(store);return {ok:true,restart:a.status==='reset',violations:a.violations};
}
export function downloadFile(name,content,type='application/json'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function downloadAttempt(a){downloadFile(`midterm-response-${a.id}.json`,JSON.stringify({...a,score:score(a)},null,2));}
export function downloadTextReport(a){downloadFile(`midterm-report-${a.id}.txt`,report(a),'text/plain');}
