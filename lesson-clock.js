/* Independent W3 lesson clock; media and slide changes never stop elapsed time. */
(()=>{
const KEY='tdk-w3-przekaz-clock-v1',deck=window.DECK;
let state;try{state=JSON.parse(localStorage.getItem(KEY))}catch{}
if(!state||!state.blocks)state={blocks:{}};
let active;
const elapsed=b=>(b.ms||0)+(b.since?Date.now()-b.since:0);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const fmt=ms=>{const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
function stage(){const counter=document.querySelector('#counter');if(!counter)return;const n=parseInt(counter.textContent)-1;const minute=document.querySelector('.lesson-minute');if(!minute)return;const m=Number(minute.dataset.minute),lesson=Number(minute.dataset.lesson);return {n,m,lesson};}
function draw(){const s=stage();if(!s)return;active=s;let b=state.blocks[s.lesson]||(state.blocks[s.lesson]={ms:0,since:null});let box=document.querySelector('#lessonClock');if(!box){box=document.createElement('div');box.id='lessonClock';box.innerHTML='<button id="clockQuickStart" title="Rozpocznij lekcję" aria-label="Rozpocznij lekcję">▶</button><span id="clockFace"></span><button id="clockReset" title="Rozpocznij tę lekcję od nowa" aria-label="Rozpocznij tę lekcję od nowa">↻</button>';document.querySelector('.controls').insertBefore(box,document.querySelector('#nextButton'));
box.querySelector('#clockQuickStart').onclick=()=>{const x=state.blocks[active.lesson];if(!x.since){x.since=Date.now();save();draw();}};
box.querySelector('#clockReset').onclick=()=>{state.blocks[active.lesson]={ms:0,since:Date.now()};save();draw();};}
const mins=elapsed(b)/60000;
const delta=mins-s.m;
let pace='ready',label='gotowy';if(b.since||b.ms){pace=delta < -3?'ahead':delta > 3?'late':'on';label=pace==='ahead'?'zapas czasu':pace==='late'?'opóźnienie':'w granicach 3 minut od planu';}
box.dataset.pace=pace;box.querySelector('#clockQuickStart').hidden=Boolean(b.since);
const face=box.querySelector('#clockFace'),text=`${s.m.toString().replace('.',',')}′ · ${fmt(elapsed(b))}`;
if(face.textContent!==text)face.textContent=text;
face.title=`Lekcja ${s.lesson}: plan ${s.m} min; ${label}.`;
face.setAttribute('aria-label',face.title);

}
window.addEventListener('w3stagechange',draw);setInterval(draw,1000);window.addEventListener('pagehide',save);draw();
})();
