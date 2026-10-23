(()=>{
"use strict";
if(window.__dccNotesLoaded)return;window.__dccNotesLoaded=true;
const KEY="dcc_notes_v1",UIKEY="dcc_notes_ui_v1",MAX=80;
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const load=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??def}catch{return def}};
let notes=load(KEY,[]);if(!Array.isArray(notes))notes=[];
notes=notes.filter(n=>n&&typeof n.id==="string").slice(0,MAX);
let ui=load(UIKEY,{});
if(!ui||typeof ui!=="object")ui={};
if(!ui.pins||typeof ui.pins!=="object"||Array.isArray(ui.pins))ui.pins={};
if(ui.pinnedId&&notes.some(n=>n.id===ui.pinnedId)&&!ui.pins[ui.pinnedId]){
 ui.pins[ui.pinnedId]={visible:ui.visible!==false,minimized:!!ui.minimized};
}
delete ui.pinnedId;delete ui.visible;delete ui.minimized;
let current=notes[0]?.id||null;
let saveTimer;
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(notes));localStorage.setItem(UIKEY,JSON.stringify(ui))}catch{status("Storage is full. Export a backup to keep your notes.")}};
const time=t=>new Date(t||Date.now()).toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"});
const byId=id=>notes.find(n=>n.id===id);
const make=()=>({id:"note-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8),title:"Untitled note",text:"",color:"sand",created:Date.now(),updated:Date.now()});
const page=document.createElement("section");page.id="notes";page.className="page";page.innerHTML='<div class="dcc-notes-heading"><div><div class="eyebrow">WORKSPACE / QUICK NOTES</div><h1>Notes</h1><p class="sub">Keep load details, reminders and quick thoughts together. Pin any note so it follows you throughout the app.</p></div><div class="dcc-notes-buttons"><button class="btn primary" id="dnCreate">+ New note</button><button class="btn" id="dnExport">Export notes</button></div></div><div class="dcc-notes-layout"><aside class="dcc-notes-list"><div class="dcc-notes-listhead"><b>My notes</b><span id="dnCount"></span></div><input class="input" id="dnSearch" placeholder="Search your notes..."><div id="dnItems"></div></aside><div class="dcc-notes-editor"><div class="dcc-notes-editor-head"><span class="dcc-notes-eyebrow">NOTEPAD</span><span class="dcc-save-status" id="dnSave">Saved on this device</span></div><input id="dnTitle" class="dcc-notes-title" maxlength="120" placeholder="Note title" aria-label="Note title"><div class="dcc-notes-meta"><span id="dnUpdated"></span><span id="dnWords"></span></div><textarea id="dnText" spellcheck="true" maxlength="35000" placeholder="Type your notes here...&#10;&#10;Example:&#10;Truck 704 — pickup 4 PM&#10;Broker: follow up about detention&#10;Driver needs new appointment"></textarea><div class="dcc-notes-bottom"><button class="btn" id="dnPin">📌 Make sticky</button><button class="btn" id="dnDelete">Delete note</button></div><p class="dcc-notes-footnote">Autosaved locally on this device. Do not store sensitive passwords, CDL numbers or personal documents in quick notes. Sync between devices is not enabled yet.</p></div></div>';
document.querySelector("main.content")?.append(page);
const nav=document.createElement("button");nav.type="button";nav.className="nav-btn";nav.dataset.page="notes";nav.innerHTML='<span class="dot"></span>Notes';
const docsNav=document.querySelector('.sidebar .nav-btn[data-page="documents"]');
if(docsNav)docsNav.insertAdjacentElement("afterend",nav);else document.querySelector(".sidebar")?.append(nav);
nav.addEventListener("click",()=>{if(typeof go==="function")go("notes");});

const $=id=>document.getElementById(id);
const title=$("dnTitle"),text=$("dnText");
const dock=document.createElement("div");dock.id="dnStickyDock";dock.setAttribute("aria-label","Pinned notes");document.body.append(dock);
const widgets=document.createElement("div");widgets.id="dnStickyWidgets";document.body.append(widgets);
let topZ=10300;
function status(message){$("dnSave").textContent=message}
function saveNow(){clearTimeout(saveTimer);persist();status("Saved on this device")}
function scheduleSave(){status("Saving...");clearTimeout(saveTimer);saveTimer=setTimeout(saveNow,300)}
function pinned(id){return Object.prototype.hasOwnProperty.call(ui.pins,id)}
function pinCount(){return Object.keys(ui.pins).length}
function formatTitle(n){return n.title?.trim()||"Untitled note"}
function renderList(){
 const q=$("dnSearch").value.trim().toLowerCase();
 const list=notes.filter(n=>(n.title+" "+n.text).toLowerCase().includes(q)).sort((a,b)=>b.updated-a.updated);
 $("dnCount").textContent=notes.length+" / "+MAX;
 $("dnItems").innerHTML=list.length?list.map(n=>'<button type="button" class="dcc-note-row'+(n.id===current?" active":"")+'" data-note="'+safe(n.id)+'"><span class="dcc-note-row-top"><strong>'+safe(formatTitle(n))+'</strong>'+(pinned(n.id)?'<span title="Pinned note">📌</span>':"")+'</span><span class="dcc-note-snippet">'+safe((n.text||"").replace(/\s+/g," ").slice(0,95)||"Empty note")+'</span><span class="dcc-note-time">'+safe(time(n.updated))+'</span></button>').join(""):'<p class="dcc-notes-empty">No notes found.</p>';
 $("dnItems").querySelectorAll("[data-note]").forEach(b=>b.onclick=()=>{current=b.dataset.note;renderEditor();renderList()});
}
function renderEditor(){
 const n=byId(current),enabled=!!n;
 for(const field of [title,text,$("dnPin"),$("dnDelete")])field.disabled=!enabled;
 if(document.activeElement!==title)title.value=n?.title||"";
 if(document.activeElement!==text)text.value=n?.text||"";
 $("dnUpdated").textContent=n?"Updated "+time(n.updated):"Create a note to get started";
 $("dnWords").textContent=n?(n.text.trim()?n.text.trim().split(/\s+/).length:0)+" words":"";
 $("dnPin").textContent=n&&pinned(n.id)?"📌 Unpin sticky note":"📌 Make sticky";
 $("dnPin").setAttribute("aria-pressed",String(!!n&&pinned(n.id)));
 $("dnPin").disabled=!n;
}
function renderDock(){
 dock.replaceChildren();
 const hidden=notes.filter(n=>pinned(n.id)&&!ui.pins[n.id].visible);
 for(const n of hidden){
  const b=document.createElement("button");b.type="button";b.className="dn-dock-item";b.textContent="📌 "+formatTitle(n);b.title="Restore "+formatTitle(n);
  b.onclick=()=>{ui.pins[n.id].visible=true;ui.pins[n.id].minimized=false;renderStickies();saveNow()};dock.append(b);
 }
}
function position(el,id,index){
 const cfg=ui.pins[id];if(!cfg)return;
 if(Number.isFinite(cfg.left)&&Number.isFinite(cfg.top)){
   const w=el.offsetWidth||340,h=el.offsetHeight||320;
   el.style.left=Math.max(4,Math.min(window.innerWidth-w-4,cfg.left))+"px";
   el.style.top=Math.max(4,Math.min(window.innerHeight-h-(window.innerWidth<760?105:4),cfg.top))+"px";
   el.style.right="auto";el.style.bottom="auto";
 }else{
   const compact=window.innerWidth<760;
   const offset=index*22;
   const w=el.offsetWidth||340;
   const x=compact?Math.max(6,window.innerWidth-w-9):Math.max(6,window.innerWidth-w-24-offset);
   const h=el.getBoundingClientRect().height||355;
   const y=compact?Math.max(6,window.innerHeight-h-110-offset):Math.max(6,window.innerHeight-h-24-offset);
   el.style.left=x+"px";el.style.top=y+"px";el.style.right="auto";el.style.bottom="auto";
 }
}
function createSticky(n,index){
 const el=document.createElement("section");el.className="dn-sticky-card";
 el.dataset.stickyId=n.id;el.setAttribute("aria-label","Sticky note: "+formatTitle(n));
 el.innerHTML='<div class="dn-card-bar"><span class="dn-card-handle" aria-hidden="true">● STICKY NOTE</span><div class="dn-card-actions"><button type="button" data-act="min" title="Minimize" aria-label="Minimize">−</button><button type="button" data-act="close" title="Close; keep pinned" aria-label="Close">×</button></div></div><div class="dn-card-body"><input class="dn-card-title" maxlength="120" aria-label="Sticky note title"><textarea class="dn-card-text" maxlength="35000" spellcheck="true" aria-label="Sticky note text"></textarea><div class="dn-card-bottom"><span>Autosaved locally</span><div><button data-act="open" type="button">Open note ↗</button><button data-act="unpin" type="button" title="Remove sticky pin">Unpin</button></div></div></div>';
 const cfg=ui.pins[n.id];el.classList.toggle("dn-minimized",!!cfg.minimized);
 const input=el.querySelector(".dn-card-title"),area=el.querySelector(".dn-card-text");
 input.value=n.title;area.value=n.text;
 input.addEventListener("input",e=>update(n.id,"title",e.target.value));
 area.addEventListener("input",e=>update(n.id,"text",e.target.value));
 el.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{
  const action=b.dataset.act;
  if(action==="min"){cfg.minimized=!cfg.minimized;renderStickies()}
  if(action==="close"){cfg.visible=false;renderStickies()}
  if(action==="unpin"){delete ui.pins[n.id];renderStickies();renderList();renderEditor()}
  if(action==="open"){current=n.id;renderEditor();renderList();if(typeof go==="function")go("notes")}
  saveNow();
 });
 el.addEventListener("pointerdown",()=>{el.style.zIndex=String(++topZ)});
 widgets.append(el);position(el,n.id,index);
 let drag=null;const bar=el.querySelector(".dn-card-bar");
 bar.addEventListener("pointerdown",e=>{
  if(e.target.closest("button")||e.button!==0)return;
  const rect=el.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,l:rect.left,t:rect.top};
  el.style.zIndex=String(++topZ);bar.setPointerCapture(e.pointerId);e.preventDefault();
 });
 bar.addEventListener("pointermove",e=>{
  if(!drag)return;
  const width=el.getBoundingClientRect().width,height=el.getBoundingClientRect().height;
  cfg.left=Math.round(Math.max(4,Math.min(window.innerWidth-width-4,drag.l+e.clientX-drag.x)));
  cfg.top=Math.round(Math.max(4,Math.min(window.innerHeight-height-(window.innerWidth<760?105:4),drag.t+e.clientY-drag.y)));
  el.style.left=cfg.left+"px";el.style.top=cfg.top+"px";
 });
 const stop=()=>{if(drag){drag=null;saveNow()}};
 bar.addEventListener("pointerup",stop);bar.addEventListener("pointercancel",stop);
}
function renderStickies(){
 // Remove or migrate pins whose source note no longer exists.
 for(const id of Object.keys(ui.pins))if(!byId(id))delete ui.pins[id];
 widgets.replaceChildren();
 notes.filter(n=>pinned(n.id)&&ui.pins[n.id].visible).forEach((n,i)=>createSticky(n,i));
 renderDock();persist();
}
function update(id,field,value){
 const n=byId(id);if(!n)return;
 n[field]=value;n.updated=Date.now();
 if(current===id){
  if(field==="title"&&document.activeElement!==title)title.value=value;
  if(field==="text"&&document.activeElement!==text)text.value=value;
  $("dnUpdated").textContent="Updated just now";
  $("dnWords").textContent=(n.text.trim()?n.text.trim().split(/\s+/).length:0)+" words";
 }
 const card=[...widgets.querySelectorAll(".dn-sticky-card")].find(x=>x.dataset.stickyId===id);
 if(card){
  const el=card.querySelector(field==="title"?".dn-card-title":".dn-card-text");
  if(document.activeElement!==el)el.value=value;
  if(field==="title")card.setAttribute("aria-label","Sticky note: "+formatTitle(n));
 }
 renderList();scheduleSave();
}
function create(){
 if(notes.length>=MAX){status("Maximum "+MAX+" notes reached. Export or delete old notes.");return}
 const n=make();notes.push(n);current=n.id;renderList();renderEditor();saveNow();title.focus();
}
$("dnCreate").onclick=create;
$("dnExport").onclick=()=>{
 const file=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),notes},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(file),a=document.createElement("a");a.href=url;a.download="dispatcher-notes-"+new Date().toISOString().slice(0,10)+".json";a.click();
 setTimeout(()=>URL.revokeObjectURL(url),20000)
};
$("dnSearch").addEventListener("input",renderList);
title.addEventListener("input",e=>update(current,"title",e.target.value));
text.addEventListener("input",e=>update(current,"text",e.target.value));
$("dnPin").onclick=()=>{
 const n=byId(current);if(!n)return;
 if(pinned(n.id)){delete ui.pins[n.id]}else{
   ui.pins[n.id]={visible:true,minimized:false};
 }
 renderStickies();renderEditor();renderList();saveNow();
};
$("dnDelete").onclick=()=>{
 const n=byId(current);
 if(!n||!confirm("Delete '"+n.title+"'? This cannot be undone."))return;
 notes=notes.filter(x=>x.id!==n.id);delete ui.pins[n.id];
 current=notes[0]?.id||null;renderList();renderEditor();renderStickies();saveNow()
};
if(!notes.length)create();else{renderList();renderEditor();}
renderStickies();
window.addEventListener("resize",()=>{for(const n of [...widgets.children]){const cfg=ui.pins[n.dataset.stickyId];if(cfg)position(n,n.dataset.stickyId,0)}});
})();