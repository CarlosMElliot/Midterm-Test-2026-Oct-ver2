// Presentation groups preserve the original question IDs and scoring weights.
export const SECTION_GROUPS=[
 {title:'Study habits and learning vocabulary',ids:['1','2','3']},
 {title:'Modal verbs and transformations',ids:['4','5','7','8','9']},
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
export const LAYOUT_VERSION=2;
export function groupedSections(exam){return SECTION_GROUPS.map((g,index)=>{const exercises=g.ids.map(id=>exam.sections.find(s=>s.id===id)).filter(Boolean);return {...g,index,exercises,weight:exercises.reduce((n,s)=>n+s.weight,0),questions:exercises.flatMap(s=>s.questions)};}).filter(g=>g.exercises.length);}
export function groupedScores(sections){if(sections.length!==24)return sections;return SECTION_GROUPS.map(g=>{const parts=g.ids.map(id=>sections[Number(id)-1]);return {title:g.title,weight:parts.reduce((n,s)=>n+s.weight,0),earned:parts.reduce((n,s)=>n+s.earned,0),questions:parts.flatMap(s=>s.questions.map(q=>({...q,exercise:s.title})))};});}
