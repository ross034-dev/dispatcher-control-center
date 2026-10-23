(()=>{
"use strict";
if(window.__dccNotesLoaded)return;window.__dccNotesLoaded=true;
const KEY="dcc_notes_v1",UIKEY="dcc_notes_ui_v1",MAX=80;
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const load=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??def}catch{return def}};
let notes=load(KEY,[]);if(!Array.isArray(notes))notes=[];
notes=notes.filter(n=>n&&typeof n.id==="string").slice(0,MAX);
let ui={visible:false,minimized:false,pinnedId:null,...load(UIKEY,{})};
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
const sticky=document.createElement("div");sticky.id="dccSticky";sticky.setAttribute("aria-label","Sticky note");sticky.innerHTML='<div class="dcc-sticky-bar" id="dnDrag"><div class="dcc-sticky-label"><span>●</span> STICKY NOTE</div><div class="dcc-sticky-actions"><button type="button" id="dnMin" title="Minimize" aria-label="Minimize">−</button><button type="button" id="dnClose" title="Close sticky note" aria-label="Close">×</button></div></div><div id="dnStickyBody"><input id="dnStickyTitle" maxlength="120" aria-label="Sticky note title"><textarea id="dnStickyText" maxlength="35000" spellcheck="true" aria-label="Sticky note text"></textarea><div class="dcc-sticky-foot"><span id="dnStickySave">Autosaved</span><button id="dnOpenNotes">Open in Notes ↗</button></div></div>';
document.body.append(sticky);
const bubble=document.createElement("button");bubble.id="dnRestore";bubble.type="button";bubble.innerHTML='📌 <span>Notes</span>';bubble.title="Open sticky note";document.body.append(bubble);
const $=id=>document.getElementById(id);
const title=$("dnTitle"),text=$("dnText"),stickyTitle=$("dnStickyTitle"),stickyText=$("dnStickyText");
function status(message){$("dnSave").textContent=message;$("dnStickySave").textContent=message}
function saveNow(){clearTimeout(saveTimer);persist();status("Saved on this device")}
function scheduleSave(){status("Saving...");clearTimeout(saveTimer);saveTimer=setTimeout(saveNow,350)}
function renderList(){const q=$("dnSearch").value.trim().toLowerCase();const list=notes.filter(n=>(n.title+" "+n.text).toLowerCase().includes(q)).sort((a,b)=>b.updated-a.updated);
$("dnCount").textContent=notes.length+" / "+MAX;
$("dnItems").innerHTML=list.length?list.map(n=>'<button type="button" class="dcc-note-row'+(n.id===current?" active":"")+'" data-note="'+safe(n.id)+'"><span class="dcc-note-row-top"><strong>'+safe(n.title||"Untitled note")+'</strong>'+(ui.pinnedId===n.id?'<span title="Sticky">📌</span>':"")+'</span><span class="dcc-note-snippet">'+safe((n.text||"").replace(/\s+/g," ").slice(0,95)||"Empty note")+'</span><span class="dcc-note-time">'+safe(time(n.updated))+'</span></button>').join(""):'<p class="dcc-notes-empty">No notes found.</p>';
$("dnItems").querySelectorAll("[data-note]").forEach(b=>b.onclick=()=>{current=b.dataset.note;renderEditor();renderList()});
}
function renderEditor(){
 const n=byId(current),enabled=!!n;
 for(const field of [title,text,$("dnPin"),$("dnDelete")])field.disabled=!enabled;
 title.value=n?.title||"";text.value=n?.text||"";
 $("dnUpdated").textContent=n?"Updated "+time(n.updated):"Create a note to get started";
 $("dnWords").textContent=n?(n.text.trim()?n.text.trim().split(/\s+/).length:0)+" words":"";
 $("dnPin").textContent=n&&ui.pinnedId===n.id?"📌 Sticky is on":"📌 Make sticky";
 $("dnPin").disabled=!n;
}
function renderSticky(){
 const n=byId(ui.pinnedId);
 if(!n){ui.visible=false;ui.minimized=false;}
 sticky.style.display=ui.visible&&n?"flex":"none";
 sticky.classList.toggle("minimized",!!ui.minimized);
 bubble.style.display=n&&!ui.visible?"flex":"none";
 if(n){if(document.activeElement!==stickyTitle)stickyTitle.value=n.title;if(document.activeElement!==stickyText)stickyText.value=n.text}
 $("dnMin").textContent=ui.minimized?"▢":"−";
 $("dnMin").title=ui.minimized?"Expand":"Minimize";
 persist();
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
 if(ui.pinnedId===id){
  if(field==="title"&&document.activeElement!==stickyTitle)stickyTitle.value=value;
  if(field==="text"&&document.activeElement!==stickyText)stickyText.value=value;
 }
 renderList();scheduleSave();
}
function create(){if(notes.length>=MAX){status("Maximum "+MAX+" notes reached. Export or delete old notes.");return}const n=make();notes.push(n);current=n.id;renderList();renderEditor();saveNow();title.focus()}
$("dnCreate").onclick=create;
$("dnExport").onclick=()=>{const file=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),notes},null,2)],{type:"application/json"});const url=URL.createObjectURL(file),a=document.createElement("a");a.href=url;a.download="dispatcher-notes-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),20000)};
$("dnSearch").addEventListener("input",renderList);
title.addEventListener("input",e=>update(current,"title",e.target.value));
text.addEventListener("input",e=>update(current,"text",e.target.value));
$("dnPin").onclick=()=>{const n=byId(current);if(!n)return;if(ui.pinnedId===n.id&&ui.visible){ui.visible=false}else{ui.pinnedId=n.id;ui.visible=true;ui.minimized=false}renderSticky();renderEditor();renderList()};
$("dnDelete").onclick=()=>{const n=byId(current);if(!n||!confirm("Delete '"+n.title+"'? This cannot be undone."))return;notes=notes.filter(x=>x.id!==n.id);if(ui.pinnedId===n.id){ui.pinnedId=null;ui.visible=false}current=notes[0]?.id||null;renderList();renderEditor();renderSticky();saveNow()};
stickyTitle.addEventListener("input",e=>update(ui.pinnedId,"title",e.target.value));
stickyText.addEventListener("input",e=>update(ui.pinnedId,"text",e.target.value));
$("dnMin").onclick=()=>{ui.minimized=!ui.minimized;renderSticky()};
$("dnClose").onclick=()=>{ui.visible=false;ui.minimized=false;renderSticky()};
bubble.onclick=()=>{ui.visible=true;ui.minimized=false;renderSticky()};
$("dnOpenNotes").onclick=()=>{current=ui.pinnedId;renderList();renderEditor();if(typeof go==="function")go("notes")};
if(!notes.length)create();else{renderList();renderEditor();}
renderSticky();
// Allow repositioning on desktop without obstructing input on iPhone.
let pointer=null;const bar=$("dnDrag");bar.addEventListener("pointerdown",e=>{
 if(e.target.closest("button")||e.pointerType==="touch")return;
 pointer={x:e.clientX,y:e.clientY,left:sticky.getBoundingClientRect().left,top:sticky.getBoundingClientRect().top};bar.setPointerCapture(e.pointerId);
});
bar.addEventListener("pointermove",e=>{if(!pointer)return;const rect=sticky.getBoundingClientRect(),left=Math.max(6,Math.min(window.innerWidth-rect.width-6,pointer.left+e.clientX-pointer.x)),top=Math.max(6,Math.min(window.innerHeight-rect.height-6,pointer.top+e.clientY-pointer.y));sticky.style.left=left+"px";sticky.style.top=top+"px";sticky.style.right="auto";sticky.style.bottom="auto"});
bar.addEventListener("pointerup",()=>pointer=null);bar.addEventListener("pointercancel",()=>pointer=null);
})();