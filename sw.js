const CACHE='phone-ledger-ipad-v8';
const FILES=['./','./index.html','./app.js?v=8','./style.css?v=8','./manifest.webmanifest?v=8','./icon-v4-180.png','./icon-v4-512.png'];

async function networkFirst(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put(request,response.clone());
    }
    return response;
  }catch(error){
    const cached=await caches.match(request);
    if(cached)return cached;
    throw error;
  }
}

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(FILES);
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith('phone-ledger-ipad-')&&name!==CACHE).map(name=>caches.delete(name)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const appFile=url.origin===self.location.origin&&(event.request.mode==='navigate'||['script','style','manifest'].includes(event.request.destination));
  if(appFile){event.respondWith(networkFirst(event.request));return}
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
