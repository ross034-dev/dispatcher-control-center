(()=>{
"use strict";
if(window.__dccTrainerProLoaded)return;
window.__dccTrainerProLoaded=true;
const lib=window.DCC_DISPATCH_TRAINER_LIBRARY;
const page=document.getElementById("flashcards");
if(!page||!lib)return;
const {tasks,quiz}=lib;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const normalize=v=>String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"dj");
const key="dcc_trainer_pro_v1";
const defaults={mode:"writing",category:"All",level:"All",query:"",index:0,qindex:0,answered:0,correct:0,done:[],mistakes:[],shuffle:false,seed:1};
let state={...defaults};try{const v=JSON.parse(localStorage.getItem(key));if(v&&typeof v==="object")state={...state,...v}}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{}}
const old=page.querySelectorAll(":scope > div");old.forEach(x=>x.style.display="none");
const nav=document.querySelector('[data-page="flashcards"]');if(nav){nav.innerHTML='<span class="dot"></span>English Trainer';}
const root=document.createElement("div");root.id="trainerPro";page.prepend(root);
const labels={writing:"Write a reply",quiz:"Knowledge quiz"};
const grammar=[
{re:/\bhe don't\b/ig,s:"he doesn't",tip:"He/she/it + doesn't."},
{re:/\bhe have\b/ig,s:"he has",tip:"Treće lice jednine: he has."},
{re:/\bdriver have\b/ig,s:"the driver has",tip:"The driver has."},
{re:/\bi am agree\b/ig,s:"I agree",tip:"Kaže se I agree, bez am."},
{re:/\bwe was\b/ig,s:"we were",tip:"We were, ne we was."},
{re:/\bcan you to\b/ig,s:"can you",tip:"Modal can + osnovni glagol."},
{re:/\bcan you sent\b/ig,s:"can you send",tip:"Can you send, ne sent."},
{re:/\bi will to\b/ig,s:"I will",tip:"Posle will ide osnovni oblik."},
{re:/\bi can to\b/ig,s:"I can",tip:"Posle can ide osnovni oblik."},
{re:/\bhow much miles\b/ig,s:"how many miles",tip:"Many miles je brojivo."},
{re:/\bmore better\b/ig,s:"better",tip:"Better je već komparativ."},
{re:/\binformations\b/ig,s:"information",tip:"Information je nebrojiva imenica."},
{re:/\badvices\b/ig,s:"advice",tip:"Advice je nebrojiva imenica."},
{re:/\bwe is\b/ig,s:"we are",tip:"We are."},
{re:/\bi am calling about regarding\b/ig,s:"I'm calling about",tip:"Nemoj spajati about i regarding."},
{re:/\bwhere you are based\b/ig,s:"where are you based",tip:"Direktno pitanje: Where are you based?"},
{re:/\bwhat you mean\?/ig,s:"what do you mean?",tip:"What do you mean?"},
{re:/\ba update\b/ig,s:"an update",tip:"An update."},
{re:/\bdriver is in the way\b/ig,s:"the driver is on the way",tip:"On the way."}
];
function syntaxReview(v){let corrected=v;const tips=[];for(const p of grammar){p.re.lastIndex=0;if(p.re.test(corrected)){p.re.lastIndex=0;corrected=corrected.replace(p.re,p.s);tips.push(p.tip)}}return {corrected,tips}}
const categories=(arr)=>["All",...new Set(arr.map(x=>x.category))];
function relevant(){const all=state.mode==="writing"?tasks:quiz;const filtered=all.filter(x=>(state.category==="All"||x.category===state.category)&& (state.mode==="quiz"||state.level==="All"||x.level===state.level)&&(!state.query||normalize((x.title||x.question)+" "+(x.scenario||"")+" "+x.category+" "+(x.route||"")).includes(normalize(state.query))));return filtered}
function sorted(arr){if(!state.shuffle)return arr;const seed=state.seed||1;return [...arr].sort((a,b)=>hash(JSON.stringify(a),seed)-hash(JSON.stringify(b),seed))}
function hash(str,seed){let h=2166136261^seed;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return h>>>0}
function choose(){const items=sorted(relevant());let n=state.mode==="writing"?state.index:state.qindex;if(n>=items.length)n=0;return {items,item:items[n],index:n}}
function draw(){let {items,item,index}=choose();root.innerHTML='<div class="tp-title"><div><span class="tp-eyebrow">LEARNING / DISPATCH ENGLISH</span><h1>Dispatch Training Center</h1><p>Velika baza stvarnih situacija, engleskih poruka i trucking znanja — bez dodatnih API troškova.</p></div><div class="tp-count"><b>'+tasks.length.toLocaleString("en-US")+'</b><span>Writing exercises</span><b>'+quiz.length.toLocaleString("en-US")+'</b><span>Quiz questions</span></div></div><div class="tp-tabs"><button data-mode="writing" class="'+(state.mode==="writing"?"active":"")+'">✍ Write a reply</button><button data-mode="quiz" class="'+(state.mode==="quiz"?"active":"")+'">✓ Knowledge quiz</button></div><div class="tp-toolbar"><label>Category<select id="tpCategory">'+categories(state.mode==="writing"?tasks:quiz).map(x=>'<option value="'+esc(x)+'"'+(x===state.category?" selected":"")+'>'+esc(x)+'</option>').join("")+'</select></label>'+(state.mode==="writing"?'<label>Level<select id="tpLevel">'+["All","Beginner","Intermediate","Advanced"].map(x=>'<option'+(x===state.level?" selected":"")+'>'+x+'</option>').join("")+'</select></label>':"")+'<label class="tp-search">Search<input id="tpSearch" placeholder="Search situations or terms..." value="'+esc(state.query)+'"></label><button id="tpRandom" class="tp-random">↝ Random</button></div><div class="tp-summary"><span>'+items.length+' matching exercises</span><span>Completed: '+state.answered+' · Quiz correct: '+state.correct+'</span></div><div class="tp-card" id="tpCard">'+(item?renderTask(item,index,items.length):'<div class="tp-empty">Nema rezultata za izabrane filtere. Probaj drugu kategoriju ili očisti pretragu.</div>')+'</div><div id="tpFeedback" aria-live="polite"></div><div class="tp-navigation"><button id="tpPrevious">← Previous</button><button id="tpNext" class="tp-primary">Next exercise →</button></div><p class="tp-note">Provera pisanog engleskog je pravilo + poređenje sa primerom, ne generativni AI. Ne može pouzdano otkriti sve greške niti je model-odgovor jedino ispravno rešenje.</p>';
root.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;state.category="All";state.query="";state.index=0;state.qindex=0;save();draw()});
const cat=root.querySelector("#tpCategory");cat.onchange=()=>{state.category=cat.value;state.index=0;state.qindex=0;save();draw()};
const lvl=root.querySelector("#tpLevel");if(lvl)lvl.onchange=()=>{state.level=lvl.value;state.index=0;save();draw()};
root.querySelector("#tpSearch").oninput=e=>{const p=e.target.selectionStart;const v=e.target.value;state.query=v;state.index=0;state.qindex=0;save();draw();const input=root.querySelector("#tpSearch");input.focus();input.setSelectionRange(p,p)};
root.querySelector("#tpRandom").onclick=()=>{state.shuffle=true;state.seed=(state.seed||1)+1;state.index=0;state.qindex=0;save();draw()};
root.querySelector("#tpNext").onclick=()=>navigate(1);
root.querySelector("#tpPrevious").onclick=()=>navigate(-1);
if(item&&state.mode==="writing"){root.querySelector("#tpCheck").onclick=()=>evaluate(item,false);root.querySelector("#tpExample").onclick=()=>evaluate(item,true)}
else if(item){root.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>answer(item,Number(b.dataset.answer)))}
}
function navigate(dx){const len=relevant().length;if(!len)return;let prop=state.mode==="writing"?"index":"qindex";state[prop]=(state[prop]+dx+len)%len;save();draw()}
function renderTask(item,index,n){return '<div class="tp-cardtop"><span>'+esc(state.mode==="writing"?item.category:item.category)+'</span><span>Exercise '+(index+1)+' / '+n+'</span></div>'+(state.mode==="writing"?'<span class="tp-level">'+esc(item.level)+'</span><h2>'+esc(item.title)+'</h2><p class="tp-context">'+esc(item.scenario)+'</p><label for="tpAnswer">Your answer in English</label><textarea id="tpAnswer" rows="5" placeholder="Write your response like you’re talking to the broker or driver..." spellcheck="true"></textarea><div class="tp-actions"><button id="tpCheck" class="tp-primary">Check my answer</button><button id="tpExample">Show natural example</button></div>':'<h2>'+esc(item.question)+'</h2><div class="tp-options">'+item.options.map((x,i)=>'<button data-answer="'+i+'"><span>'+String.fromCharCode(65+i)+'</span>'+esc(x)+'</button>').join("")+'</div>')}
function addFeedback(html){root.querySelector("#tpFeedback").innerHTML='<section class="tp-feedback">'+html+'</section>';root.querySelector("#tpFeedback").scrollIntoView({block:"nearest",behavior:"smooth"})}
function evaluate(item,exampleOnly){let input=root.querySelector("#tpAnswer");let value=input.value.trim();if(!value&&!exampleOnly){input.focus();return}let {corrected,tips}=syntaxReview(value);state.answered+=!exampleOnly?1:0;state.done.push(item.title);state.done=state.done.slice(-1500);save();
let html='<div class="tp-fb-head"><h3>'+(exampleOnly?"Model response":"Review your reply")+'</h3><span>English practice</span></div>';
if(!exampleOnly){html+='<div class="tp-user-text"><b>Your response</b><p>'+esc(value)+'</p></div>';if(tips.length){html+='<div class="tp-tip"><b>Possible corrections</b><p>'+esc(corrected)+'</p><ul>'+tips.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></div>'}else html+='<div class="tp-tip">Nisam otkrio poznatu gramatičku grešku. To <b>nije potvrda</b> da je tvoj odgovor potpuno tačan.</div>'}
html+='<div class="tp-model"><b>Natural dispatcher example</b><p>'+esc(item.sample)+'</p><button id="tpCopy">Copy example</button></div><p class="tp-note">Proveri da tvoj odgovor pokriva uslove iz zadatka, da je razumljiv i da ne izmišlja podatke.</p>';
addFeedback(html);root.querySelector("#tpCopy").onclick=()=>navigator.clipboard?.writeText(item.sample).then(()=>root.querySelector("#tpCopy").textContent="Copied ✓").catch(()=>{})}
function answer(item,n){const buttons=[...root.querySelectorAll("[data-answer]")];if(buttons[0]?.disabled)return;state.answered++;if(n===item.correct)state.correct++;else state.mistakes.push(item.question);state.mistakes=state.mistakes.slice(-500);save();buttons.forEach((b,i)=>{b.disabled=true;b.classList.add(i===item.correct?"correct":i===n?"wrong":"muted")});addFeedback('<div class="tp-fb-head"><h3>'+(n===item.correct?"Correct!":"Not quite.")+'</h3></div><p>'+esc(item.explanation)+'</p><div class="tp-model"><b>Correct answer</b><p>'+esc(item.options[item.correct])+'</p></div>')}
draw();
})();