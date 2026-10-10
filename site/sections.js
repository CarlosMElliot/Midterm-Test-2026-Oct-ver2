// Presentation groups preserve the original question IDs and scoring weights.
export const SECTION_GROUPS=[
 {title:'Study habits and learning vocabulary',ids:['1','2','3']},
 {title:'Modal verbs and key word transformations',ids:['4','5','7','8','9']},
 {title:'Effort, success and motivation',ids:['6','10','11']},
 {title:'Reading: Memorisation and technology',ids:['12']},
 {title:'Body language, emotions and expression',ids:['13','14','15']},
 {title:'Listening: Laughter, sounds and ASMR',ids:['16','19']},
 {title:'Reporting verbs and patterns',ids:['17','18']},
 {title:'Film and fashion',ids:['20','21']},
 {title:'Relative clauses',ids:['22']},
 {title:'Listening: Conversations about art',ids:['23']},
 {title:'Writing: A letter to the editor',ids:['24']}
];
export const LAYOUT_VERSION=6;
export function groupedSections(exam){return SECTION_GROUPS.map((g,index)=>{const exercises=g.ids.map(id=>exam.sections.find(s=>s.id===id)).filter(Boolean);return {...g,index,exercises,weight:exercises.reduce((n,s)=>n+s.weight,0),questions:exercises.flatMap(s=>s.questions)};}).filter(g=>g.exercises.length);}
export function groupedScores(sections){if(sections.length!==24)return sections;return SECTION_GROUPS.map(g=>{const parts=g.ids.map(id=>sections[Number(id)-1]);return {title:g.title,weight:parts.reduce((n,s)=>n+s.weight,0),earned:parts.reduce((n,s)=>n+s.earned,0),questions:parts.flatMap(s=>s.questions.map(q=>({...q,exercise:s.title})))};});}
export function testPages(exam,version=LAYOUT_VERSION){const pages=[];const exercisePages=(s,group)=>{const size=version>=4&&exam.version.startsWith('2026-10-mc5')&&['5','7','8','14','22'].includes(s.id)?Math.ceil(s.questions.length/2):version>=3&&s.onePerPage?4:s.onePerPage?1:s.questions.length;for(let i=0;i<s.questions.length;i+=size)pages.push({s,group,questions:s.questions.slice(i,i+size),offset:i});};if(version<2){exam.sections.forEach(s=>{pages.push({s,intro:true});exercisePages(s,null);});return pages;}groupedSections(exam).forEach(group=>{if(version===2)pages.push({s:{title:group.title,weight:group.weight,questions:group.questions},group,intro:true});const start=pages.length;if(version>=6&&group.ids.includes('4')){pages.push({s:{id:'modals',title:group.title,weight:group.weight,questions:group.questions},group,exercises:group.exercises,questions:group.questions,offset:0});}else{group.exercises.forEach(s=>exercisePages(s,group));}if(version>=3)pages[start].sectionStart=true;});return pages;}
