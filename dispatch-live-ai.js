(()=>{"use strict";
if(window.__dccLiveAiLoaded)return;window.__dccLiveAiLoaded=true;
const page=document.getElementById("situations");if(!page)return;
const old=document.getElementById("situationStudio");if(old)old.style.display="none";
const endpoint="https://vrfycmztnbvlsouymlgq.supabase.co",pubKey="sb_publishable_sA9i5tknNuxyn2ZYDxVQJA_uoLrmcUy";
const app=window.supabase?.createClient(endpoint,pubKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
const root=document.createElement("div");root.id="liveDispatchAi";page.prepend(root);
const htmlEscape=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
root.innerHTML='<div class="lai-header"><div><div class="lai-eyebrow">DISPATCH ASSISTANT · AI-POWERED</div><h1>Ask anything about trucking.</h1><p>Piši na srpskom ili engleskom. Objasni stvarni problem, pitaj za trucking termin ili traži poruku za brokera — bez biranja šablona.</p></div><span class="lai-indicator" id="laiIndicator">AI configuration required</span></div><div class="lai-panel"><div class="lai-compose"><form id="laiForm"><textarea id="laiInput" maxlength="2500" rows="3" placeholder="Npr. Kamionu curi voda, vozač je stao i kasnimo na delivery. Šta da kažem brokeru?"></textarea><div class="lai-controls"><span>Real AI answers · Serbian & English</span><button id="laiSend" type="submit">Ask AI <span>↑</span></button></div></form></div><div class="lai-conversation" id="laiMessages" aria-live="polite"><div class="lai-welcome"><div class="lai-symbol">✳</div><h2>How can I help?</h2><p>Objašnjavam trucking termine, HOS, dokumentaciju, loadove, pregovore i probleme na ruti. Za odgovore koristim samo informacije koje mi daš.</p><div class="lai-examples"><button type="button" data-question="Šta znači Dedicated u dispatchingu?">What is Dedicated?</button><button type="button" data-question="Kamionu curi voda i vozač kasni na delivery. Šta da kažem brokeru?">Truck problem</button><button type="button" data-question="Broker nudi $2,100, a meni treba $2,500. Kako da pregovaram?">Rate negotiation</button><button type="button" data-question="Bukirao sam turu ali ne mogu da je pokrijem. Kako da odmah javim brokeru profesionalno?">Cancel booked load</button></div></div></div></div><div class="lai-footer"><button id="laiClear" type="button">↻ New conversation</button><div id="laiStatus" role="status">Sign in with your Cloud Sync account to use AI. A free-tier Gemini API key must also be configured by the project owner.</div></div><p class="lai-footnote">Pravi AI chat koristi Gemini API kroz zaštićen Supabase backend; bez server-side ključa ne šalje poruke. AI ne zna tvoju stvarnu lokaciju, ELD, GPS ili vremenske uslove bez tih podataka. Ne šalji CDL, lične dokumente ni osetljive podatke u chat.</p>';
const messagesEl=root.querySelector("#laiMessages"),input=root.querySelector("#laiInput"),form=root.querySelector("#laiForm"),send=root.querySelector("#laiSend"),status=root.querySelector("#laiStatus"),indicator=root.querySelector("#laiIndicator");
let history=[],busy=false;
function setStatus(t){status.textContent=t}
function userBubble(text){const item=document.createElement("div");item.className="lai-message lai-user";const p=document.createElement("div");p.className="lai-bubble";p.textContent=text;item.append(p);messagesEl.append(item)}
function aiBubble(text){const item=document.createElement("div");item.className="lai-message lai-ai";const avatar=document.createElement("div");avatar.className="lai-avatar";avatar.textContent="✳";const content=document.createElement("div");content.className="lai-ai-content";content.innerHTML='<div class="lai-byline">Dispatch AI</div>';const p=document.createElement("div");p.className="lai-ai-text";p.textContent=text;content.append(p);const controls=document.createElement("div");controls.className="lai-copy-controls";const copy=document.createElement("button");copy.textContent="Copy answer";copy.type="button";copy.onclick=async()=>{try{await navigator.clipboard.writeText(text);copy.textContent="Copied ✓"}catch{copy.textContent="Unable to copy"}setTimeout(()=>copy.textContent="Copy answer",1600)};controls.append(copy);content.append(controls);item.append(avatar,content);messagesEl.append(item);item.scrollIntoView({block:"nearest",behavior:"smooth"})}
function note(text){const block=document.createElement("div");block.className="lai-notice";block.textContent=text;messagesEl.append(block)}
function clear(){history=[];messagesEl.innerHTML='<div class="lai-welcome"><div class="lai-symbol">✳</div><h2>New conversation</h2><p>Pitaj šta želiš da saznaš o dispatch-u, ili napiši novu situaciju.</p></div>';input.value="";input.focus();setStatus("New session. No conversation saved to your database.")}
async function ask(message){
 if(busy||!message.trim())return;
 if(!app){setStatus("Supabase is unavailable. Check your internet connection.");return}
 busy=true;send.disabled=true;send.textContent="Thinking…";
 const welcome=messagesEl.querySelector(".lai-welcome");if(welcome)welcome.remove();
 userBubble(message);input.value="";setStatus("Checking sign-in and connecting to AI…");
 const toSend=[...history,{role:"user",content:message}].slice(-12);
 try{
  const {data:{session},error:authErr}=await app.auth.getSession();
  if(authErr||!session?.access_token){note("Please sign in using ☁ Cloud Sync at the top, then try again.");setStatus("Sign-in required.");return}
  const response=await fetch(endpoint+"/functions/v1/dispatch-ai",{method:"POST",headers:{"Content-Type":"application/json","apikey":pubKey,"Authorization":"Bearer "+session.access_token},body:JSON.stringify({messages:toSend})});
  const data=await response.json().catch(()=>({error:"Unexpected server response."}));
  if(!response.ok){const cause=data.message||data.error||"AI service unavailable.";note(cause);setStatus(response.status===503?"AI configuration needed. Ask the owner to add GEMINI_API_KEY in Supabase Edge Function secrets.":"AI request could not be completed.");return}
  const reply=String(data.reply||"").trim();if(!reply)throw Error("Empty response");
  aiBubble(reply);history=[...toSend,{role:"assistant",content:reply}].slice(-12);
  indicator.textContent="AI connected";setStatus("Response received · "+(data.remaining??"?")+" requests remaining today for your account.");
 }catch(e){note("Unable to reach AI. Check your connection and try again.");setStatus(String(e?.message||"Network error"))}
 finally{busy=false;send.disabled=false;send.innerHTML='Ask AI <span>↑</span>'}
}
form.addEventListener("submit",e=>{e.preventDefault();ask(input.value.trim())});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();form.requestSubmit()}});
root.querySelectorAll("[data-question]").forEach(b=>b.onclick=()=>ask(b.dataset.question));
root.querySelector("#laiClear").onclick=clear;
})();