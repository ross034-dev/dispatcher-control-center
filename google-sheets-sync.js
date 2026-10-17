(function(){
"use strict";
if(window.__sheetsConnectorLoaded)return;window.__sheetsConnectorLoaded=true;
const sheetId="12oZN0lIeZzv6pJRQzIFRrly-LYG-ZvOyq9XuElTZ0lQ",clientKey="dcc_google_web_client_id",scope="https://www.googleapis.com/auth/spreadsheets";
let token="",expires=0,client=null,auto=false,inflight=false,lastSnapshot="";
const current=()=>JSON.stringify({drivers,loads,docs});
const elt=document.createElement("div");elt.id="sheetIntegration";elt.className="card section";
elt.innerHTML='<div class="section-head"><div><div class="eyebrow">External Integration</div><h2>Google Sheets Sync</h2></div><a class="btn small" target="_blank" rel="noopener" href="https://docs.google.com/spreadsheets/d/'+sheetId+'/edit">Open Sheet ↗</a></div><p class="muted" style="font-size:13px">Connect Google securely to transfer Drivers, Loads and Documents. Your primary synchronized database remains Supabase.</p><div class="field"><label>Google OAuth Web Client ID (public; not Client Secret)</label><input class="input" id="googleClientId" placeholder="...apps.googleusercontent.com" autocomplete="off"></div><div class="hero-actions"><button class="btn" id="googleSaveId">Save Client ID</button><button class="btn primary" id="googleConnect">Connect Google</button><button class="btn" id="googleExport">Update Sheet from App</button></div><p class="muted" style="font-size:11px">Updating Sheet replaces rows in Drivers, Load Log and Documents. Manual changes in Google Sheets do not yet update the app. No Google token is stored in the repository.</p><div class="field"><label><input id="googleAuto" type="checkbox"> Auto-export changes while this page is open and Google authorization is active</label></div><div id="googleStatus" style="color:var(--muted);font-size:12px;margin-top:8px" role="status">Not connected.</div>';
const root=document.getElementById("resources")||document.getElementById("dashboard");root.append(elt);
const $=id=>document.getElementById(id),say=x=>$("googleStatus").textContent=x;
$("googleClientId").value=localStorage.getItem(clientKey)||"";
$("googleSaveId").onclick=()=>{const id=$("googleClientId").value.trim();if(!/^[0-9]+-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(id))return say("Invalid Google OAuth client ID.");localStorage.setItem(clientKey,id);token="";say("Client ID saved on this device. Choose Connect Google.")};
$("googleAuto").onchange=()=>{auto=$("googleAuto").checked;say(auto?"Auto-export enabled for this open browser session.":"Auto-export disabled.")};
function auth(){return new Promise((resolve,reject)=>{const id=localStorage.getItem(clientKey);if(!id)return reject(Error("First save the Google OAuth Web Client ID."));if(!window.google?.accounts?.oauth2)return reject(Error("Google authorization script is not available. Reload in Safari."));client=google.accounts.oauth2.initTokenClient({client_id:id,scope:scope,callback:r=>{if(r.error)return reject(Error(r.error));token=r.access_token;expires=Date.now()+(r.expires_in-90)*1000;say("Google connected. You may now update your Sheet.");resolve()}});client.requestAccessToken({prompt:"consent"})})}
$("googleConnect").onclick=()=>auth().catch(e=>say(e.message));
async function request(path,method,body){if(!token||expires<Date.now())throw Error("Google authorization expired. Tap Connect Google.");const resp=await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+path,{method:method,headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});const value=await resp.json();if(!resp.ok)throw Error(value.error?.message||"Google API error");return value}
const t=v=>v==null?"":String(v),n=v=>Number(v)||0;
function rows(){
const driverRows=drivers.map(d=>[t(d._id),t(d.name),t(d.phone),t(d.truck),t(d.trailer),t(d.equipment),t(d.home),t(d.status),t(d.prefs),t(d.avoid),t(d.notes),t(d.updated||d.created),t(d._id)]);
const loadRows=loads.map(l=>{const driver=drivers.find(d=>d._id===l.driverId);const total=n(l.loadedMiles)+n(l.dhMiles),rate=n(l.rate),gross=rate+n(l.lumper)+n(l.detention)+n(l.layover)+n(l.tonu);return [t(l.id),t(l.driverId),t(driver?.name),t(l.status),t(l.broker),t(l.puDate),t(l.puCity),t(l.puState),t(l.delDate),t(l.delCity),t(l.delState),t(l.commodity),n(l.loadedMiles),n(l.dhMiles),total,rate,n(l.loadedMiles)?rate/n(l.loadedMiles):"",total?rate/total:"",t(l.bol),t(l.rateCon),t(l.pod),n(l.lumper),n(l.detention),n(l.layover),n(l.tonu),gross,t(l.notes),t(l.docLink),t(l._id)]});
const docsRows=docs.map(d=>[t(d.loadId),t(drivers.find(x=>x._id===loads.find(l=>l.id===d.loadId)?.driverId)?.name),t(d.type),t(d.fileName),t(d.link),t(d.date),t(d.notes),t(d._id)]);
return [["Drivers",driverRows,"M"],["Load Log",loadRows,"AC"],["Documents",docsRows,"H"]]}
async function exportNow(confirmed){if(inflight)return;if(!confirmed&&!confirm("Replace existing rows in the three Google Sheets tabs with the app's current records? Sheet-only edits will be overwritten. Make a copy of the Sheet first."))return;
inflight=true;say("Updating Sheet…");try{const snapshot=current(),data=rows();const valueRanges=data.filter(x=>x[1].length).map(x=>({range:"'"+x[0]+"'!A2",values:x[1]}));if(valueRanges.length)await request("/values:batchUpdate?valueInputOption=RAW","POST",{data:valueRanges,valueInputOption:"RAW"});const trailing=data.filter(x=>x[1].length<999).map(x=>"'"+x[0]+"'!A"+(x[1].length+2)+":"+x[2]+"1000");if(trailing.length)await request("/values:batchClear","POST",{ranges:trailing});lastSnapshot=snapshot;say("Saved to Google Sheets: "+drivers.length+" drivers, "+loads.length+" loads, "+docs.length+" document references.")}catch(e){say("Google Sheets error: "+e.message)}finally{inflight=false}}
$("googleExport").onclick=()=>exportNow(false);

const imp=document.createElement("button");imp.id="googleImport";imp.className="btn";imp.textContent="Import Sheet → App (review)";
$("googleExport").insertAdjacentElement("afterend",imp);
function uid(prefix){return prefix+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}
function v(row,i){return String(row?.[i]??"")}
function buildImported(data){
 const dd=(data[0]?.values||[]).filter(r=>v(r,1)).map(row=>({_id:v(row,12)||v(row,0)||uid("drv"),name:v(row,1),phone:v(row,2),truck:v(row,3),trailer:v(row,4),equipment:v(row,5),home:v(row,6),status:v(row,7),prefs:v(row,8),avoid:v(row,9),notes:v(row,10)}));
 const ll=(data[1]?.values||[]).filter(r=>v(r,0)).map(row=>({_id:v(row,28)||uid("load"),id:v(row,0),driverId:v(row,1),status:v(row,3),broker:v(row,4),puDate:v(row,5),puCity:v(row,6),puState:v(row,7),delDate:v(row,8),delCity:v(row,9),delState:v(row,10),commodity:v(row,11),loadedMiles:v(row,12),dhMiles:v(row,13),rate:v(row,15),bol:v(row,18),rateCon:v(row,19),pod:v(row,20),lumper:v(row,21),detention:v(row,22),layover:v(row,23),tonu:v(row,24),notes:v(row,26),docLink:v(row,27)}));
 const dc=(data[2]?.values||[]).filter(r=>v(r,0)).map(row=>({_id:v(row,7)||uid("doc"),loadId:v(row,0),type:v(row,2),fileName:v(row,3),link:v(row,4),date:v(row,5),notes:v(row,6)}));
 return {drivers:dd,loads:ll,docs:dc};
}
function mergeRecords(existing,incoming,match){
 const result=[...existing];let created=0,updated=0;
 for(const fresh of incoming){const idx=result.findIndex(old=>match(old,fresh));if(idx>=0){result[idx]={...result[idx],...fresh,_id:result[idx]._id,updated:Date.now()};updated++}else{result.push({...fresh,created:Date.now(),updated:Date.now()});created++}}
 return {result,created,updated};
}
function backupBeforeImport(){
 const dump=JSON.stringify({exportedAt:new Date().toISOString(),drivers,loads,docs,favs:[...favs]},null,2);
 try{localStorage.setItem("dcc_pre_sheet_import_"+Date.now(),dump)}catch{}
 const obj=URL.createObjectURL(new Blob([dump],{type:"application/json"}));const a=document.createElement("a");a.href=obj;a.download="dispatcher-before-sheets-import.json";a.click();setTimeout(()=>URL.revokeObjectURL(obj),30000);
}
async function importSheet(){
 if(inflight)return say("Wait for current sync to finish.");
 inflight=true;
 try{
 say("Reading Google Sheet for review…");
 const ranges=["'Drivers'!A2:M1000","'Load Log'!A2:AC1000","'Documents'!A2:H1000"];
 const q=ranges.map(x=>"ranges="+encodeURIComponent(x)).join("&");
 const remote=await request("/values:batchGet?"+q,"GET");
 const incoming=buildImported(remote.valueRanges||[]);
 if(!confirm("Sheet contains "+incoming.drivers.length+" drivers, "+incoming.loads.length+" loads and "+incoming.docs.length+" document references. Import will ADD records or UPDATE matching records in the app and Supabase. Other app records will NOT be deleted. Do you want to continue?")){say("Import cancelled. No data changed.");return}
 const md=mergeRecords(drivers,incoming.drivers,(a,b)=>a._id===b._id||!!(a.name&&b.name&&a.name===b.name&&a.truck===b.truck));
 const ml=mergeRecords(loads,incoming.loads,(a,b)=>a._id===b._id||!!(a.id&&b.id&&a.id===b.id));
 const mc=mergeRecords(docs,incoming.docs,(a,b)=>a._id===b._id);
 backupBeforeImport();
 drivers=md.result;loads=ml.result;docs=mc.result;
 store.set("dcc_drivers",drivers);store.set("dcc_loads",loads);store.set("dcc_docs",docs);
 renderAll();lastSnapshot="";
 say("Imported successfully: "+md.created+" new drivers, "+ml.created+" new loads, "+mc.created+" new documents. Existing matching records updated. Other records preserved. Changes will sync through Supabase if logged in.");
 }catch(e){say("Import failed: "+e.message)}finally{inflight=false}
}
imp.onclick=importSheet;

setInterval(()=>{if(auto&&token&&expires>Date.now()&&lastSnapshot&&lastSnapshot!==current()&&!inflight)exportNow(true)},20000);
})();