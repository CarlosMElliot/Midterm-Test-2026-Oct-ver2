import fs from 'node:fs/promises';
import {API_URL,PUBLIC_API_KEY} from '../site/backend-config.js';
const response=await fetch(API_URL+'?action=results',{headers:{apikey:PUBLIC_API_KEY},signal:AbortSignal.timeout(60000)});
let previous=[];try{previous=JSON.parse(await fs.readFile('site/results.json','utf8')).results||[];}catch{}
if(!response.ok)throw Error(`Source results unavailable (${response.status}); existing results retained.`);
const source=await response.json();if(!Array.isArray(source.results))throw Error('Invalid public result feed');
const results=source.results.map(r=>{if(typeof r.name!=='string'||!Number.isFinite(r.score)||r.score<0||r.score>100)throw Error('Invalid result row');return {name:r.name,score:r.score,maxScore:100,completionCredit:r.completionCredit??0,gradingStatus:r.gradingStatus,pendingQuestions:r.pendingQuestions,submittedAt:r.submittedAt,updatedAt:r.updatedAt,attemptId:r.attemptId,sections:r.sections??previous.find(p=>p.attemptId===r.attemptId)?.sections};});
// Preserve older repository records while adding the Supabase records.
const present=new Set(results.map(r=>r.attemptId));for(const old of previous){if(!present.has(old.attemptId))results.push(old);}
results.sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt));
const cell=s=>String(s??'').replace(/[\r\n]/g,' ').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\|/g,'&#124;').replace(/([\\`*_\[\]])/g,'\\$1');
await fs.writeFile('site/results.json',JSON.stringify({results},null,2)+'\n');
await fs.writeFile('RESULTS.md',['# Student results','','[Open public teacher response view](https://carlosmelliot.github.io/Midterm-Test-2026-Oct-ver2/responses.html) — no password required.','','Automatically synced from backend-scored submissions. Completion credit remains provisional until teacher review. Times are UTC.','','| Name | Score / 100 | Completion credit included | Status | Submitted (UTC) | Updated (UTC) |','| --- | --- | --- | --- | --- | --- |',...results.map(r=>`| ${[r.name,r.score,r.completionCredit,r.gradingStatus,r.submittedAt,r.updatedAt].map(cell).join(' | ')} |`),'',...(!results.length?['No GitHub Pages submissions received yet.','']:[])].join('\n'));
console.log(`Synced ${results.length} public score summaries.`);
