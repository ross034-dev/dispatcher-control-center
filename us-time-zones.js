(()=>{
"use strict";
if(window.__dccTimeZonesReady)return;
window.__dccTimeZonesReady=true;
const PLACES=[
 {id:"belgrade",name:"Serbia · Belgrade",city:"Belgrade",state:"RS",tz:"Europe/Belgrade",region:"Serbia",short:"RS"},
 {id:"newyork",name:"New York, NY",city:"New York",state:"NY",tz:"America/New_York",region:"Eastern",short:"ET"},
 {id:"atlanta",name:"Atlanta, GA",city:"Atlanta",state:"GA",tz:"America/New_York",region:"Eastern",short:"ET"},
 {id:"miami",name:"Miami, FL",city:"Miami",state:"FL",tz:"America/New_York",region:"Eastern",short:"ET"},
 {id:"boston",name:"Boston, MA",city:"Boston",state:"MA",tz:"America/New_York",region:"Eastern",short:"ET"},
 {id:"charlotte",name:"Charlotte, NC",city:"Charlotte",state:"NC",tz:"America/New_York",region:"Eastern",short:"ET"},
 {id:"indianapolis",name:"Indianapolis, IN",city:"Indianapolis",state:"IN",tz:"America/Indiana/Indianapolis",region:"Eastern",short:"ET"},
 {id:"detroit",name:"Detroit, MI",city:"Detroit",state:"MI",tz:"America/Detroit",region:"Eastern",short:"ET"},
 {id:"columbus",name:"Columbus, OH",city:"Columbus",state:"OH",tz:"America/New_York",region:"Eastern",short:"ET"},
 {id:"chicago",name:"Chicago, IL",city:"Chicago",state:"IL",tz:"America/Chicago",region:"Central",short:"CT"},
 {id:"dallas",name:"Dallas, TX",city:"Dallas",state:"TX",tz:"America/Chicago",region:"Central",short:"CT"},
 {id:"houston",name:"Houston, TX",city:"Houston",state:"TX",tz:"America/Chicago",region:"Central",short:"CT"},
 {id:"nashville",name:"Nashville, TN",city:"Nashville",state:"TN",tz:"America/Chicago",region:"Central",short:"CT"},
 {id:"memphis",name:"Memphis, TN",city:"Memphis",state:"TN",tz:"America/Chicago",region:"Central",short:"CT"},
 {id:"kansascity",name:"Kansas City, MO",city:"Kansas City",state:"MO",tz:"America/Chicago",region:"Central",short:"CT"},
 {id:"minneapolis",name:"Minneapolis, MN",city:"Minneapolis",state:"MN",tz:"America/Chicago",region:"Central",short:"CT"},
 {id:"louisville",name:"Louisville, KY",city:"Louisville",state:"KY",tz:"America/Kentucky/Louisville",region:"Eastern",short:"ET"},
 {id:"elpaso",name:"El Paso, TX",city:"El Paso",state:"TX",tz:"America/Denver",region:"Mountain",short:"MT"},
 {id:"denver",name:"Denver, CO",city:"Denver",state:"CO",tz:"America/Denver",region:"Mountain",short:"MT"},
 {id:"saltlake",name:"Salt Lake City, UT",city:"Salt Lake City",state:"UT",tz:"America/Denver",region:"Mountain",short:"MT"},
 {id:"boise",name:"Boise, ID",city:"Boise",state:"ID",tz:"America/Boise",region:"Mountain",short:"MT"},
 {id:"cheyenne",name:"Cheyenne, WY",city:"Cheyenne",state:"WY",tz:"America/Denver",region:"Mountain",short:"MT"},
 {id:"phoenix",name:"Phoenix, AZ",city:"Phoenix",state:"AZ",tz:"America/Phoenix",region:"Arizona (no DST)",short:"MST"},
 {id:"tucson",name:"Tucson, AZ",city:"Tucson",state:"AZ",tz:"America/Phoenix",region:"Arizona (no DST)",short:"MST"},
 {id:"losangeles",name:"Los Angeles, CA",city:"Los Angeles",state:"CA",tz:"America/Los_Angeles",region:"Pacific",short:"PT"},
 {id:"seattle",name:"Seattle, WA",city:"Seattle",state:"WA",tz:"America/Los_Angeles",region:"Pacific",short:"PT"},
 {id:"portland",name:"Portland, OR",city:"Portland",state:"OR",tz:"America/Los_Angeles",region:"Pacific",short:"PT"},
 {id:"lasvegas",name:"Las Vegas, NV",city:"Las Vegas",state:"NV",tz:"America/Los_Angeles",region:"Pacific",short:"PT"},
 {id:"sanfrancisco",name:"San Francisco, CA",city:"San Francisco",state:"CA",tz:"America/Los_Angeles",region:"Pacific",short:"PT"},
 {id:"anchorage",name:"Anchorage, AK",city:"Anchorage",state:"AK",tz:"America/Anchorage",region:"Alaska",short:"AKT"},
 {id:"honolulu",name:"Honolulu, HI",city:"Honolulu",state:"HI",tz:"Pacific/Honolulu",region:"Hawaii (no DST)",short:"HST"}
];
const PRIMARY=[
 {name:"Eastern",tz:"America/New_York",cities:"New York · Atlanta · Miami",tag:"ET"},
 {name:"Central",tz:"America/Chicago",cities:"Chicago · Dallas · Houston",tag:"CT"},
 {name:"Mountain",tz:"America/Denver",cities:"Denver · Salt Lake City",tag:"MT"},
 {name:"Pacific",tz:"America/Los_Angeles",cities:"Los Angeles · Seattle",tag:"PT"},
 {name:"Arizona",tz:"America/Phoenix",cities:"Phoenix · Tucson · no DST",tag:"MST"},
 {name:"Alaska",tz:"America/Anchorage",cities:"Anchorage",tag:"AKT"},
 {name:"Hawaii",tz:"Pacific/Honolulu",cities:"Honolulu · no DST",tag:"HST"},
 {name:"Serbia",tz:"Europe/Belgrade",cities:"Your local reference",tag:"RS"}
];
const locale="en-US";
function dateParts(instant,tz){
 const arr=new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(instant);
 const out={};for(const p of arr)if(p.type!=="literal")out[p.type]=Number(p.value);
 return out;
}
function formatted(instant,tz,options){
 return new Intl.DateTimeFormat(locale,{timeZone:tz,...options}).format(instant)
}
function zoneAbbr(instant,tz){
 return new Intl.DateTimeFormat("en-US",{timeZone:tz,timeZoneName:"short"}).formatToParts(instant).find(x=>x.type==="timeZoneName")?.value||"";
}
function dayDelta(instant,tz){
 const ser=dateParts(instant,"Europe/Belgrade"),other=dateParts(instant,tz);
 const a=Date.UTC(ser.year,ser.month-1,ser.day),b=Date.UTC(other.year,other.month-1,other.day);
 const diff=Math.round((b-a)/86400000);
 return diff===0?"Same day":diff>0?"Next day":"Previous day";
}
function localToInstants(d,t,tz){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!/^\d{2}:\d{2}$/.test(t))return [];
 const [year,month,day]=d.split("-").map(Number),[hour,minute]=t.split(":").map(Number);
 if(hour>23||minute>59||month<1||month>12||day<1||day>31)return [];
 const wall=Date.UTC(year,month-1,day,hour,minute);
 const options=[];
 // Scan plausible UTC offsets in 15-minute increments to resolve DST transitions accurately.
 for(let offset=-12*60;offset<=14*60;offset+=15){
  const ms=wall-offset*60000,parts=dateParts(new Date(ms),tz);
  if(parts.year===year&&parts.month===month&&parts.day===day&&parts.hour===hour&&parts.minute===minute)options.push(ms);
 }
 return [...new Set(options)].sort((a,b)=>a-b).map(ms=>new Date(ms));
}
function dateValue(now){
 const p=dateParts(now,"Europe/Belgrade");
 return p.year+"-"+String(p.month).padStart(2,"0")+"-"+String(p.day).padStart(2,"0");
}
const section=document.createElement("section");section.className="page";section.id="timezones";
section.innerHTML='<div class="tz-head"><div><div class="eyebrow">REFERENCE / US DISPATCH</div><h1>USA Time Zones</h1><p class="sub">Live clocks, daylight-saving-aware conversion and appointment planning — from Serbia to any major US trucking market.</p></div><div class="tz-live"><span class="tz-dot"></span>LIVE · updating every minute</div></div><div class="tz-summary"><div><b>Serbia time</b><strong id="tzSerbiaNow">--:--</strong><small id="tzSerbiaDate"></small></div><div><b>New York</b><strong id="tzNYNow">--:--</strong><small id="tzNYDate"></small></div><div><b>Chicago</b><strong id="tzChicagoNow">--:--</strong><small id="tzChicagoDate"></small></div><div><b>Los Angeles</b><strong id="tzLANow">--:--</strong><small id="tzLADate"></small></div></div><div class="tz-section-title"><h2>Current time across the US</h2><span>Automatic DST adjustments · Local time at each location</span></div><div class="tz-grid" id="tzClocks"></div><div class="tz-section-title"><h2>Pickup & delivery time converter</h2><span>Enter the time shown on the appointment</span></div><div class="tz-convert"><div class="tz-fields"><label>From location<select id="tzFrom"></select></label><label>Date<input id="tzDate" type="date"></label><label>Time (24-hour)<input id="tzTime" type="time" value="16:00"></label><label>To location<select id="tzTo"></select></label></div><div class="tz-actions"><button id="tzSwap" type="button" class="tz-outline">⇄ Swap locations</button><button id="tzNow" type="button" class="tz-outline">Use current time</button><button id="tzConvert" type="button" class="tz-primary">Convert time →</button></div><div class="tz-result" id="tzResult" aria-live="polite"></div></div><div class="tz-notice"><strong>Dispatcher tips</strong><p>Always confirm the appointment\'s <b>local facility time zone</b>. Arizona (most locations) and Hawaii do not observe daylight saving time; some states span multiple zones (for example TX, TN, KY, IN, ID and OR). DST switching dates can differ between Serbia and the US, so the usual hour difference is not constant all year. Navajo Nation in northeastern Arizona observes DST, unlike most of the state.</p></div>';
const market=document.getElementById("market");if(market)market.insertAdjacentElement("beforebegin",section);else document.querySelector("main.content")?.append(section);
const nav=document.createElement("button");nav.className="nav-btn";nav.type="button";nav.dataset.page="timezones";nav.innerHTML='<span class="dot"></span>USA Time Zones';
const navMarket=document.querySelector('.sidebar .nav-btn[data-page="market"]');
if(navMarket)navMarket.insertAdjacentElement("afterend",nav);
else document.querySelector(".sidebar")?.append(nav);
nav.addEventListener("click",()=>typeof go==="function"&&go("timezones"));
const $=id=>document.getElementById(id);
function refreshClocks(){
 const now=new Date();
 const big=[["tzSerbiaNow","tzSerbiaDate","Europe/Belgrade"],["tzNYNow","tzNYDate","America/New_York"],["tzChicagoNow","tzChicagoDate","America/Chicago"],["tzLANow","tzLADate","America/Los_Angeles"]];
 for(const [clock,label,tz] of big){
  $(clock).textContent=formatted(now,tz,{hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
  $(label).textContent=formatted(now,tz,{weekday:"short",month:"short",day:"numeric"})+" · "+zoneAbbr(now,tz);
 }
 $("tzClocks").innerHTML=PRIMARY.map(zone=>{
 const time=formatted(now,zone.tz,{hour:"2-digit",minute:"2-digit",hourCycle:"h23"}),date=formatted(now,zone.tz,{weekday:"short",month:"short",day:"numeric"});
 return '<div class="tz-clock"><div class="tz-clock-top"><strong>'+zone.name+'</strong><span>'+zoneAbbr(now,zone.tz)+'</span></div><div class="tz-clock-time">'+time+'</div><div class="tz-clock-date">'+date+' <span>· '+dayDelta(now,zone.tz)+'</span></div><p>'+zone.cities+'</p></div>';
 }).join("");
}
const opts=PLACES.map(p=>'<option value="'+p.id+'">'+p.name+' — '+p.region+'</option>').join("");
$("tzFrom").innerHTML=opts;$("tzTo").innerHTML=opts;
$("tzFrom").value="belgrade";$("tzTo").value="chicago";$("tzDate").value=dateValue(new Date());
function convert(){
 const from=PLACES.find(p=>p.id===$("tzFrom").value),to=PLACES.find(p=>p.id===$("tzTo").value);
 if(!from||!to)return;
 const arr=localToInstants($("tzDate").value,$("tzTime").value,from.tz);
 if(arr.length===0){$("tzResult").innerHTML='<div class="tz-warning">This local time does not exist or is invalid (possibly due to the spring daylight saving transition). Try another time.</div>';return}
 const instant=arr[0],full=formatted(instant,to.tz,{weekday:"long",month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
 const iso=formatted(instant,from.tz,{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
 const ambiguity=arr.length>1?'<p class="tz-warning">This time occurs twice during a fall DST change. Showing the first occurrence; confirm whether the appointment uses daylight or standard time.</p>':"";
 const source=from.name+" · "+iso+" "+zoneAbbr(instant,from.tz);
 const copy=to.name+": "+full+" ("+zoneAbbr(instant,to.tz)+")";
 $("tzResult").innerHTML='<div class="tz-result-left"><span>FROM</span><p>'+source+'</p></div><div class="tz-result-arrow">→</div><div class="tz-result-right"><span>CONVERTED TIME</span><strong>'+full+'</strong><p>'+to.name+' · '+zoneAbbr(instant,to.tz)+'</p></div><button type="button" id="tzCopy">Copy result</button>'+ambiguity;
 $("tzCopy").onclick=async()=>{const b=$("tzCopy");try{await navigator.clipboard.writeText(copy);b.textContent="Copied ✓"}catch{const t=document.createElement("textarea");t.value=copy;document.body.append(t);t.select();const ok=document.execCommand("copy");t.remove();b.textContent=ok?"Copied ✓":"Select result manually"}setTimeout(()=>{if(b.isConnected)b.textContent="Copy result"},1500)};
}
$("tzConvert").onclick=convert;
$("tzSwap").onclick=()=>{const v=$("tzFrom").value;$("tzFrom").value=$("tzTo").value;$("tzTo").value=v;convert()};
$("tzNow").onclick=()=>{const now=new Date(),from=PLACES.find(x=>x.id===$("tzFrom").value);
 const p=dateParts(now,from.tz);$("tzDate").value=p.year+"-"+String(p.month).padStart(2,"0")+"-"+String(p.day).padStart(2,"0");
 $("tzTime").value=String(p.hour).padStart(2,"0")+":"+String(p.minute).padStart(2,"0");convert()};
for(const id of ["tzFrom","tzDate","tzTime","tzTo"])$(id).addEventListener("change",convert);
refreshClocks();convert();setInterval(()=>{if(!document.hidden)refreshClocks()},30000);
})();