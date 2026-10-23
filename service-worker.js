const CACHE='dispatcher-cc-v27';
const ASSETS=['./manifest.webmanifest','./icon.svg'];

const EXTRA_CSS=`

.learning-back{margin:0 0 18px;display:flex;align-items:center}
.learning-back-btn{border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:11px;min-height:42px;padding:9px 15px;font-size:12px;font-weight:750;cursor:pointer;display:flex;align-items:center;gap:9px}
.learning-back-btn:hover{border-color:var(--accent);color:var(--accent)}
@media(max-width:650px){.learning-back{margin-bottom:14px}.learning-back-btn{min-height:44px}}

.mobile-bottom-nav{display:none}
.learn-nav-btn{align-items:flex-start!important;padding:10px 11px!important;gap:10px!important;margin:3px 0}
.learn-nav-btn .learn-nav-icon{width:31px;height:31px;border-radius:9px;background:#142238;display:grid;place-items:center;flex:0 0 31px;font-size:15px;color:#dce8f7}
.learn-nav-btn .learn-nav-copy{min-width:0;display:block;line-height:1.18}
.learn-nav-btn .learn-nav-title{display:block;color:inherit;font-size:13px;font-weight:700}
.learn-nav-btn .learn-nav-sub{display:block;color:#71839e;font-size:9px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}
.nav-btn.active .learn-nav-icon{background:rgba(45,212,191,.15);color:#5eead4}
.learn-center-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px}
.learn-center-head h1{margin-bottom:4px}
.learn-stats{display:flex;gap:7px;flex-wrap:wrap}.learn-stat{padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:11px;color:var(--muted)}
.learn-module-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.learn-module{position:relative;overflow:hidden;min-height:190px;cursor:pointer;transition:.18s ease;padding:18px;border:1px solid var(--line);border-radius:18px;background:var(--surface);box-shadow:var(--shadow)}
.learn-module:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--accent) 35%,var(--line))}.learn-module:active{transform:scale(.985)}
.learn-module-icon{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;font-size:20px;background:color-mix(in srgb,var(--accent) 10%,var(--surface2));color:var(--accent);margin-bottom:14px}
.learn-module h3{font-size:17px;margin-bottom:6px}.learn-module p{font-size:12px;color:var(--muted);margin:0 0 12px}.learn-module .learn-meta{font-size:10px;color:var(--muted);display:flex;gap:5px;flex-wrap:wrap}.learn-meta span{border:1px solid var(--line);border-radius:999px;padding:4px 7px;background:var(--surface2)}
.learn-arrow{position:absolute;right:16px;top:18px;color:var(--muted);font-size:17px}
.learn-section-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:24px 0 10px}.learn-section-title h2{margin:0}.learn-section-title small{color:var(--muted)}
.delay-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.delay-card{border:1px solid var(--line);border-radius:15px;padding:14px;background:var(--surface)}
.delay-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.delay-title{font-weight:800;font-size:13px}.delay-tag{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--surface2));padding:4px 7px;border-radius:999px}
.delay-line{font-size:13px;font-weight:650;line-height:1.45;margin:8px 0}.delay-sr{font-size:11px;color:var(--muted);line-height:1.4}.copy-mini{border:1px solid var(--line);background:var(--surface2);color:var(--muted);border-radius:8px;padding:5px 8px;font-size:10px;cursor:pointer}.copy-mini:active{transform:scale(.96)}
.call-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.flow-step{border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:12px}.flow-num{width:25px;height:25px;border-radius:8px;background:var(--nav);color:#fff;display:grid;place-items:center;font-size:10px;font-weight:800;margin-bottom:8px}.flow-step b{display:block;font-size:12px;margin-bottom:4px}.flow-step span{font-size:10px;color:var(--muted)}
.quick-tools{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.quick-tool{border:1px solid var(--line);border-radius:14px;padding:13px;background:var(--surface2)}.quick-tool b{display:block;font-size:12px;margin-bottom:4px}.quick-tool p{font-size:10px;color:var(--muted);margin:0}
.safe-note{border:1px solid color-mix(in srgb,var(--accent) 30%,var(--line));background:color-mix(in srgb,var(--accent) 6%,var(--surface));border-radius:14px;padding:12px 14px;font-size:11px;color:var(--muted);margin-top:12px}.safe-note b{color:var(--text)}
@media(max-width:1100px){.learn-module-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:620px){
 body{padding-bottom:calc(78px + env(safe-area-inset-bottom))}.topbar{top:0;padding:calc(8px + env(safe-area-inset-top)) 12px 9px;gap:8px}.mobile-menu{display:none!important}.topbar .search{max-width:none;flex:1}.topbar .icon-btn{min-width:46px;min-height:46px;border-radius:14px;font-size:18px}.topbar .search input{min-height:46px;font-size:16px;border-radius:14px}.sidebar{padding-top:calc(24px + env(safe-area-inset-top));padding-bottom:calc(90px + env(safe-area-inset-bottom))}.content{padding-bottom:calc(108px + env(safe-area-inset-bottom))}
 .mobile-bottom-nav{position:fixed;left:10px;right:10px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:70;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:7px;background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);border:1px solid var(--line);border-radius:22px;box-shadow:0 12px 35px rgba(15,23,42,.18)}[data-theme="dark"] .mobile-bottom-nav{background:rgba(15,26,44,.94)}.mobile-nav-btn{appearance:none;border:0;background:transparent;color:var(--muted);min-height:56px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px;font-weight:700;padding:5px 2px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.mobile-nav-btn .micon{font-size:20px;line-height:1}.mobile-nav-btn.active{background:color-mix(in srgb,var(--accent) 12%,var(--surface));color:var(--accent)}.mobile-nav-btn:active{transform:scale(.96)}
 .learn-center-head{display:block}.learn-stats{margin-top:10px}.learn-module-grid,.delay-grid,.quick-tools,.call-flow{grid-template-columns:1fr}.learn-module{min-height:160px}.learn-module-grid{gap:9px}.learn-section-title{align-items:flex-end}.delay-card{padding:13px}
}
/* V25: compact iPhone-native style navigation */
@media(max-width:760px){
 html{scroll-padding-bottom:100px}
 body{padding-bottom:calc(76px + env(safe-area-inset-bottom,0px))}
 .content{padding-bottom:calc(105px + env(safe-area-inset-bottom,0px))}
 .mobile-bottom-nav{
  position:fixed!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;
  left:max(12px,env(safe-area-inset-left,0px))!important;right:max(12px,env(safe-area-inset-right,0px))!important;
  bottom:calc(8px + env(safe-area-inset-bottom,0px))!important;
  z-index:900!important;gap:3px!important;padding:6px!important;
  background:rgba(255,255,255,.94)!important;border:1px solid rgba(148,163,184,.24)!important;
  box-shadow:0 7px 28px rgba(15,23,42,.12)!important;
  border-radius:21px!important;-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);
 }
 [data-theme="dark"] .mobile-bottom-nav{background:rgba(15,23,42,.95)!important;border-color:rgba(148,163,184,.19)!important}
 .mobile-bottom-nav .mobile-nav-btn{
  min-width:0!important;min-height:54px!important;max-height:56px!important;
  border-radius:15px!important;display:flex!important;flex-direction:column!important;
  align-items:center!important;justify-content:center!important;gap:3px!important;
  padding:6px 1px!important;color:var(--muted)!important;background:transparent!important;
  font-size:10px!important;font-weight:650!important;line-height:1.1!important;letter-spacing:0!important;
  white-space:nowrap!important;-webkit-tap-highlight-color:transparent;
 }
 .mobile-bottom-nav .mobile-nav-btn svg{display:block!important;width:21px!important;height:21px!important;flex:0 0 21px}
 .mobile-bottom-nav .mobile-nav-btn span{font-size:10px!important;line-height:12px!important}
 .mobile-bottom-nav .mobile-nav-btn.active{color:var(--accent)!important;background:color-mix(in srgb,var(--accent) 10%,var(--surface))!important}
 .mobile-bottom-nav .mobile-nav-btn:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
 .sidebar{z-index:920!important}
 .topbar{z-index:60}
 #dnStickyDock{bottom:calc(85px + env(safe-area-inset-bottom,0px))!important;z-index:850!important}
 .dn-sticky-card{max-height:calc(100dvh - 160px)!important}
 .dcc-notes-heading{gap:12px}
 .dcc-notes-heading h1{font-size:25px}
 .dcc-notes-buttons{width:100%}
 .dcc-notes-buttons .btn{flex:1;justify-content:center}
 .dcc-notes-list,.dcc-notes-editor{max-width:100%;min-width:0}
 .dcc-notes-editor #dnText{min-height:240px;font-size:16px}
 .dcc-notes-bottom .btn{min-height:44px}
}
@media(max-width:365px){
 .mobile-bottom-nav{left:7px!important;right:7px!important;padding:4px!important}
 .mobile-bottom-nav .mobile-nav-btn span{font-size:9px!important}
}
`;

const MOBILE_NAV=`<nav class="mobile-bottom-nav" id="mobileBottomNav" aria-label="Main mobile navigation"><button type="button" class="mobile-nav-btn active" data-mobile-page="dashboard" aria-label="Home"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></svg><span>Home</span></button><button type="button" class="mobile-nav-btn" data-mobile-page="drivers" aria-label="Drivers"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7.5" r="3.5"/><path d="M4.8 20v-2.2c0-3.1 2.9-5.5 7.2-5.5s7.2 2.4 7.2 5.5V20"/></svg><span>Drivers</span></button><button type="button" class="mobile-nav-btn" data-mobile-page="loads" aria-label="Loads"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h7M7 17h4"/></svg><span>Loads</span></button><button type="button" class="mobile-nav-btn" data-mobile-page="learnhub" aria-label="Learning Center"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z"/><path d="M6.5 11.5v5c3.2 2.9 7.8 2.9 11 0v-5"/><path d="M21.5 9v7"/></svg><span>Learn</span></button><button type="button" class="mobile-nav-btn" id="mobileMoreBtn" aria-label="More navigation" aria-expanded="false"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg><span>More</span></button></nav>`;

const LEARN_HUB=`<section class="page" id="learnhub"><div class="learn-center-head"><div><div class="eyebrow">Learning center</div><h1>Dispatcher Learning Hub</h1><p class="sub">Everything for calls, negotiation, terminology and real-world situations — organized for fast use during a shift.</p></div><div class="learn-stats"><span class="learn-stat">Phrasebook</span><span class="learn-stat">Flashcards</span><span class="learn-stat">Scenarios</span><span class="learn-stat">Terminology</span></div></div>
<div class="learn-module-grid">
 <div class="learn-module" onclick="go('phrases')"><span class="learn-arrow">→</span><div class="learn-module-icon">💬</div><h3>Phrasebook</h3><p>Broker calls, driver calls, negotiation, check calls, paperwork, delays, booking and everyday English.</p><div class="learn-meta"><span>Broker</span><span>Driver</span><span>Negotiation</span></div></div>
 <div class="learn-module" onclick="go('flashcards')"><span class="learn-arrow">→</span><div class="learn-module-icon">🧠</div><h3>Flashcards</h3><p>Practice phrases actively instead of only reading them. Use random review and favorites.</p><div class="learn-meta"><span>Memory</span><span>Practice</span><span>Daily review</span></div></div>
 <div class="learn-module" onclick="go('situations')"><span class="learn-arrow">→</span><div class="learn-module-icon">⚡</div><h3>Situation Assistant</h3><p>What to say when a driver is late, detention starts, freight is rejected, a truck breaks down or tracking fails.</p><div class="learn-meta"><span>Problems</span><span>Scripts</span><span>Updates</span></div></div>
 <div class="learn-module" onclick="go('terminology')"><span class="learn-arrow">→</span><div class="learn-module-icon">📚</div><h3>Terminology</h3><p>Fast trucking dictionary for DAT, brokers, facilities, documents, equipment, HOS and accessorials.</p><div class="learn-meta"><span>Terms</span><span>Abbreviations</span><span>Reference</span></div></div>
</div>
<div class="learn-section-title"><div><div class="eyebrow">Broker updates</div><h2>Delay Update Library</h2></div><small>Tap Copy during a call or message</small></div>
<div class="delay-grid">
 ${delayCard('Reason not confirmed','Neutral','Driver is running a little behind. I’m confirming the reason now and I’ll send you an updated ETA shortly.','Vozač kasni malo. Proveravam razlog i uskoro šaljem novi ETA.')}
 ${delayCard('Need a few minutes','Quick','Let me check with the driver and I’ll get you a firm update in a few minutes.','Daj mi par minuta da proverim sa vozačem i vraćam se sa sigurnim update-om.')}
 ${delayCard('Traffic — only if true','Traffic','The driver is dealing with heavier traffic than expected. I’m watching the ETA and I’ll update you if it moves again.','Vozač je u većoj gužvi nego što je očekivano. Pratim ETA i javljam ako se promeni.')}
 ${delayCard('Facility delay — only if true','Facility','The previous stop took longer than expected, which pushed the schedule back. Current ETA is ____.','Prethodni stop je trajao duže nego što je planirano i pomerio raspored. Trenutni ETA je ____.')}
 ${delayCard('HOS / safety','HOS','The driver had to manage his available hours safely. The updated ETA is ____. I’ll keep you posted.','Vozač je morao bezbedno da isplanira raspoložive sate. Novi ETA je ____.')}
 ${delayCard('Weather — only if true','Weather','Weather conditions are slowing traffic in the driver’s area. Safety comes first; current ETA is ____.','Vremenski uslovi usporavaju saobraćaj. Bezbednost je prioritet; trenutni ETA je ____.')}
 ${delayCard('Mechanical — only if confirmed','Mechanical','The driver reported a mechanical issue and is getting it checked. I’ll send you the repair ETA as soon as I have it.','Vozač je prijavio mehanički problem i trenutno se proverava. Šaljem ETA popravke čim ga dobijem.')}
 ${delayCard('ETA changed again','ETA','Quick update: the ETA moved to ____. I wanted to let you know right away rather than wait until the last minute.','Brzi update: ETA se pomerio na ____. Javljam odmah umesto da čekam poslednji trenutak.')}
 ${delayCard('May miss appointment','Appointment','It looks like the driver may miss the original appointment. Can you check whether the facility can still receive him at approximately ____?','Izgleda da će vozač možda propustiti termin. Možete li proveriti da li ga facility može primiti oko ____?')}
 ${delayCard('Ask for reschedule','Reschedule','Can you please help us secure the next available appointment? The driver’s earliest realistic ETA is ____.','Možete li nam pomoći da dobijemo sledeći slobodan termin? Najraniji realan ETA je ____.')}
 ${delayCard('Broker is pushing','Professional','I understand the urgency. I don’t want to give you an inaccurate ETA, so I’m confirming it with the driver and I’ll update you as soon as I have a firm time.','Razumem hitnost. Ne želim da dam netačan ETA, zato ga potvrđujem sa vozačem i javljam čim imam sigurno vreme.')}
 ${delayCard('Good final update','Close','Driver is moving again and the current ETA is ____. I’ll let you know immediately if anything changes.','Vozač je ponovo u pokretu i trenutni ETA je ____. Javljam odmah ako se nešto promeni.')}
</div>
<div class="learn-section-title"><div><div class="eyebrow">Call structure</div><h2>4-step delay call</h2></div></div><div class="call-flow"><div class="flow-step"><div class="flow-num">1</div><b>Acknowledge</b><span>“Just giving you a quick update…”</span></div><div class="flow-step"><div class="flow-num">2</div><b>State the fact</b><span>Say only what you actually know.</span></div><div class="flow-step"><div class="flow-num">3</div><b>Give ETA</b><span>Use a realistic time, not a hopeful one.</span></div><div class="flow-step"><div class="flow-num">4</div><b>Set next update</b><span>Tell the broker when you’ll update again.</span></div></div>
<div class="learn-section-title"><div><div class="eyebrow">Fast tools</div><h2>Useful habits during a shift</h2></div></div><div class="quick-tools"><div class="quick-tool"><b>Confirm before promising</b><p>“Let me confirm with the driver before I give you a firm ETA.”</p></div><div class="quick-tool"><b>Use exact times</b><p>2:40 PM sounds more credible and useful than “soon.”</p></div><div class="quick-tool"><b>Document updates</b><p>Keep check-in, out-time, ETA changes and broker approvals in writing.</p></div><div class="quick-tool"><b>Separate facts from estimates</b><p>“Driver is 80 miles out” is a fact. “ETA 4:15 PM” is an estimate.</p></div><div class="quick-tool"><b>Update early</b><p>Bad news delivered early is easier to manage than a last-minute surprise.</p></div><div class="quick-tool"><b>Never over-explain</b><p>Short, clear and confident usually sounds more professional than a long story.</p></div></div>
<div class="safe-note"><b>Important:</b> use specific causes such as traffic, weather, mechanical problems or facility delays only when they are actually true. If you do not know the reason yet, use the neutral scripts above — they buy time without creating a story you later have to defend.</div></section>`;

function delayCard(title,tag,en,sr){return `<div class="delay-card"><div class="delay-top"><span class="delay-title">${title}</span><span class="delay-tag">${tag}</span></div><div class="delay-line">${en}</div><div class="delay-sr">${sr}</div><div style="margin-top:9px"><button class="copy-mini" data-copy="${esc(en)}">Copy</button></div></div>`}
function esc(s){return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

const EXTRA_JS=`<script>(function(){
 const nav=document.getElementById('mobileBottomNav');
 if(nav){const learningIds=new Set(['learnhub','phrases','flashcards','situations','terminology']);
 function updateMobile(id){const selected=learningIds.has(id)?'learnhub':(['dashboard','drivers','loads'].includes(id)?id:'more');nav.querySelectorAll('.mobile-nav-btn').forEach(btn=>{const active=selected==='more'?btn.id==='mobileMoreBtn':btn.dataset.mobilePage===selected;btn.classList.toggle('active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')})}
 if(typeof go==='function'){const originalGo=go;go=function(id){originalGo(id);updateMobile(id);document.getElementById('mobileMoreBtn')?.setAttribute('aria-expanded','false')}}
 nav.querySelectorAll('[data-mobile-page]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.mobilePage;if(typeof go==='function')go(id);updateMobile(id);}));const more=document.getElementById('mobileMoreBtn');if(more)more.addEventListener('click',()=>{const side=document.getElementById('sidebar');if(!side)return;side.classList.toggle('open');more.setAttribute('aria-expanded',String(side.classList.contains('open')));});
 document.addEventListener('click',e=>{const side=document.getElementById('sidebar');if(!side?.classList.contains('open'))return;if(side.contains(e.target)||document.getElementById('mobileMoreBtn')?.contains(e.target))return;side.classList.remove('open');document.getElementById('mobileMoreBtn')?.setAttribute('aria-expanded','false');});}
 document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const t=btn.getAttribute('data-copy');try{await navigator.clipboard.writeText(t);btn.textContent='Copied ✓';setTimeout(()=>btn.textContent='Copy',1200)}catch(e){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();btn.textContent='Copied ✓';setTimeout(()=>btn.textContent='Copy',1200)}}));
 const labels={phrases:['💬','Phrasebook','Broker & driver phrases'],flashcards:['🧠','Flashcards','Practice & review'],situations:['⚡','Situation Assistant','Real-world problems'],terminology:['📚','Terminology','Terms & abbreviations']};
 Object.entries(labels).forEach(([id,v])=>{const b=document.querySelector('.nav-btn[data-page="'+id+'"]');if(b){b.classList.add('learn-nav-btn');b.innerHTML='<span class="learn-nav-icon">'+v[0]+'</span><span class="learn-nav-copy"><span class="learn-nav-title">'+v[1]+'</span><span class="learn-nav-sub">'+v[2]+'</span></span>';}});
 const learnSection=[...document.querySelectorAll('.nav-section')].find(x=>x.textContent.trim().toLowerCase()==='learn');if(learnSection&&!document.querySelector('[data-page="learnhub"]')){const b=document.createElement('button');b.className='nav-btn learn-nav-btn';b.dataset.page='learnhub';b.innerHTML='<span class="learn-nav-icon">✦</span><span class="learn-nav-copy"><span class="learn-nav-title">Learning Center</span><span class="learn-nav-sub">Start here</span></span>';learnSection.insertAdjacentElement('afterend',b);b.addEventListener('click',()=>{if(typeof go==='function')go('learnhub')});}

 // Keep the sidebar clean: the learning hub is the only learning entry.
 const learningPages=['phrases','flashcards','situations','terminology'];
 learningPages.forEach(id=>{
   document.querySelector('.sidebar .nav-btn[data-page="'+id+'"]')?.remove();
   const page=document.getElementById(id);
   if(!page||page.querySelector('.learning-back'))return;
   const bar=document.createElement('nav');
   bar.className='learning-back';bar.setAttribute('aria-label','Learning navigation');
   const back=document.createElement('button');
   back.type='button';back.className='learning-back-btn';
   back.innerHTML='<span aria-hidden="true">←</span> Back to Learning Center';
   back.addEventListener('click',()=>{if(typeof go==='function')go('learnhub')});
   bar.appendChild(back);page.prepend(bar);
 });
 const hub=document.getElementById('learnhub');
 if(hub){
   hub.querySelectorAll('.learn-stat').forEach(x=>{
     if(x.textContent.trim()==='Flashcards')x.textContent='English Trainer';
   });
   hub.querySelectorAll('.learn-module').forEach(x=>{
     if(x.getAttribute('onclick')?.includes("flashcards")){
       const title=x.querySelector('h3'),desc=x.querySelector('p');
       if(title)title.textContent='English Trainer';
       if(desc)desc.textContent='Writing exercises, quizzes, real broker and driver conversations.';
       const meta=x.querySelector('.learn-meta');if(meta)meta.innerHTML='<span>Writing</span><span>Quiz</span><span>Practice</span>';
     }
   });
 }
})();<\/script>`;

function enhance(html){
 if(!html.includes('learn-center-head')) html=html.replace('</style>',EXTRA_CSS+'\n</style>').replace('</main>',LEARN_HUB+'\n</main>').replace('</main>','</main>\n'+MOBILE_NAV).replace('</body>',EXTRA_JS+'\n</body>');
 return html;
}

self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(e.request.mode==='navigate'){e.respondWith((async()=>{try{const r=await fetch(e.request,{cache:'no-store'});return new Response(enhance(await r.text()),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}catch(err){const c=await caches.match('./index.html');if(c)return new Response(enhance(await c.text()),{headers:{'Content-Type':'text/html; charset=utf-8'}});throw err}})());return}e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request))) });