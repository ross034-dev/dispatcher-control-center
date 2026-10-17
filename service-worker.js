const CACHE='dispatcher-cc-v2';
const ASSETS=['./manifest.webmanifest','./icon.svg'];

const MOBILE_CSS=`
.mobile-bottom-nav{display:none}
@media(max-width:620px){
  body{padding-bottom:calc(78px + env(safe-area-inset-bottom))}
  .topbar{top:0;padding:calc(8px + env(safe-area-inset-top)) 12px 9px;gap:8px}
  .topbar .icon-btn{min-width:46px;min-height:46px;border-radius:14px;font-size:18px}
  .topbar .search input{min-height:46px;font-size:16px;border-radius:14px}
  .sidebar{padding-top:calc(24px + env(safe-area-inset-top));padding-bottom:calc(90px + env(safe-area-inset-bottom))}
  .content{padding-bottom:calc(108px + env(safe-area-inset-bottom))}
  .mobile-bottom-nav{position:fixed;left:10px;right:10px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:70;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:7px;background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);border:1px solid var(--line);border-radius:22px;box-shadow:0 12px 35px rgba(15,23,42,.18)}
  [data-theme="dark"] .mobile-bottom-nav{background:rgba(15,26,44,.94)}
  .mobile-nav-btn{appearance:none;border:0;background:transparent;color:var(--muted);min-height:56px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px;font-weight:700;padding:5px 2px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
  .mobile-nav-btn .micon{font-size:20px;line-height:1}
  .mobile-nav-btn.active{background:color-mix(in srgb,var(--accent) 12%,var(--surface));color:var(--accent)}
  .mobile-nav-btn:active{transform:scale(.96)}
}`;

const MOBILE_NAV=`<nav class="mobile-bottom-nav" id="mobileBottomNav" aria-label="Mobile navigation">
<button class="mobile-nav-btn active" data-mobile-page="dashboard"><span class="micon">⌂</span><span>Home</span></button>
<button class="mobile-nav-btn" data-mobile-page="drivers"><span class="micon">♙</span><span>Drivers</span></button>
<button class="mobile-nav-btn" data-mobile-page="loads"><span class="micon">▣</span><span>Loads</span></button>
<button class="mobile-nav-btn" data-mobile-page="phrases"><span class="micon">Aa</span><span>Learn</span></button>
<button class="mobile-nav-btn" id="mobileMoreBtn"><span class="micon">•••</span><span>More</span></button>
</nav>`;

const MOBILE_JS=`<script>
(function(){
 const nav=document.getElementById('mobileBottomNav'); if(!nav)return;
 nav.querySelectorAll('[data-mobile-page]').forEach(btn=>btn.addEventListener('click',()=>{
   const id=btn.dataset.mobilePage;
   if(typeof go==='function') go(id);
   nav.querySelectorAll('[data-mobile-page]').forEach(x=>x.classList.toggle('active',x===btn));
 }));
 const more=document.getElementById('mobileMoreBtn');
 if(more) more.addEventListener('click',()=>document.getElementById('sidebar')?.classList.add('open'));
 const originalGo=window.go;
 if(typeof originalGo==='function') window.go=function(id){originalGo(id);nav.querySelectorAll('[data-mobile-page]').forEach(x=>x.classList.toggle('active',x.dataset.mobilePage===id));};
})();
<\/script>`;

function enhanceMobile(html){
 if(html.includes('id="mobileBottomNav"')) return html;
 html=html.replace('</style>',MOBILE_CSS+'\n</style>');
 html=html.replace('</main>','</main>\n'+MOBILE_NAV);
 html=html.replace('</body>',MOBILE_JS+'\n</body>');
 return html;
}

self.addEventListener('install',event=>{
 self.skipWaiting();
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
   await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET') return;
 if(event.request.mode==='navigate'){
   event.respondWith((async()=>{
     try{
       const response=await fetch(event.request,{cache:'no-store'});
       const html=enhanceMobile(await response.text());
       return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
     }catch(err){
       const cached=await caches.match('./index.html');
       if(cached){const html=enhanceMobile(await cached.text());return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8'}})}
       throw err;
     }
   })());
   return;
 }
 event.respondWith(fetch(event.request).then(response=>{
   const copy=response.clone();
   caches.open(CACHE).then(cache=>cache.put(event.request,copy));
   return response;
 }).catch(()=>caches.match(event.request)));
});
