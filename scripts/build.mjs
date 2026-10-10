import fs from 'node:fs/promises';
const exam=JSON.parse(await fs.readFile('site/exam.json'));
if(exam.sections.length!==24||exam.sections.reduce((n,s)=>n+s.weight,0)!==100)throw Error('Expected 24 sections and 100 points');
for(const track of ['2.10','2.16','3.4','3.6','3.8','3.18','3.19'])await fs.access(`site/assets/audio/track-${track}.mp3`);
for(const s of exam.sections){if(!s.questions.length||s.blocker)throw Error('Incomplete section');if(s.passageImage)await fs.access(`site/${s.passageImage}`);}
await fs.access('site/assets/images/clothing-grid.png');
for(const file of ['app.js','style.css','index.html']){const body=await fs.readFile(`site/${file}`,'utf8');if(/(?:href|src)="\//.test(body)||body.includes("fetch('/api"))throw Error('Static site cannot use root/API paths');}
console.log('Validated static site: 24 sections, 100 points, seven recordings, all image assets.');
