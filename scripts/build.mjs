import fs from 'node:fs/promises';
const {groupedSections,testPages}=await import('../site/sections.js');
const exam=JSON.parse(await fs.readFile('site/exam.json'));
if(exam.sections.length!==24||exam.sections.reduce((n,s)=>n+s.weight,0)!==100)throw Error('Expected 24 sections and 100 points');
for(const track of ['2.10','2.16','3.4','3.6','3.8','3.18','3.19'])await fs.access(`site/assets/audio/track-${track}.mp3`);
for(const s of exam.sections){if(!s.questions.length||s.blocker)throw Error('Incomplete section');if(s.passageImage)await fs.access(`site/${s.passageImage}`);}
await fs.access('site/assets/images/clothing-grid.png');
for(const file of ['app.js','style.css','index.html']){const body=await fs.readFile(`site/${file}`,'utf8');if(/(?:href|src)="\//.test(body)||body.includes("fetch('/api"))throw Error('Static site cannot use root/API paths');}
if(testPages(exam).length!==27)throw Error('Expected 27 test steps');
if(groupedSections(exam).length!==11)throw Error('Expected 11 visible sections');
console.log('Validated static site: 11 sections, 100 points, seven recordings, all image assets.');
// Version every first-party script/style together so cached modules cannot mix releases.
const {createHash}=await import('node:crypto');
const names=(await fs.readdir('site')).filter(n=>/\.(js|css|html)$/.test(n)).sort();
const hash=createHash('sha256');for(const name of names)hash.update(await fs.readFile(`site/${name}`));
const version=hash.digest('hex').slice(0,12);
await fs.rm('_site',{recursive:true,force:true});await fs.cp('site','_site',{recursive:true});
for(const name of names){let text=await fs.readFile(`_site/${name}`,'utf8');
 if(name.endsWith('.js'))text=text.replace(/(from\s+['"]\.\/[^'"?]+\.js)(['"])/g,`$1?v=${version}$2`);
 if(name.endsWith('.html'))text=text.replace(/((?:src|href)="[^"/:?]+\.(?:js|css))(")/g,`$1?v=${version}$2`);
 await fs.writeFile(`_site/${name}`,text);
}
console.log(`Generated cache-versioned Pages build: ${version}`);
