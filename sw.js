/* 샬롬 말씀노트 서비스워커
   CORE: 앱 화면·아이콘 (새 버전마다 새로 받음)
   STATIC: 성경·글꼴 (내용이 바뀌지 않으면 다시 받지 않음 · 글꼴은 파일 이름에 내용 표시가 붙어 있음) */
const CORE='shalom-core-v48-9bbc77ce',STATIC='shalom-static-993aa860';
const COREF=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"],STATICF=["fonts/NotoSerifKR-500.f7bd1622.woff2", "fonts/NotoSerifKR-700.08911847.woff2", "fonts/poor-story.83487869.woff2", "fonts/pret-Regular.89f1d362.woff2", "fonts/pret-SemiBold.7a08d4b0.woff2", "bible/01.json", "bible/02.json", "bible/03.json", "bible/04.json", "bible/05.json", "bible/06.json", "bible/07.json", "bible/08.json", "bible/09.json", "bible/10.json", "bible/11.json", "bible/12.json", "bible/13.json", "bible/14.json", "bible/15.json", "bible/16.json", "bible/17.json", "bible/18.json", "bible/19.json", "bible/20.json", "bible/21.json", "bible/22.json", "bible/23.json", "bible/24.json", "bible/25.json", "bible/26.json", "bible/27.json", "bible/28.json", "bible/29.json", "bible/30.json", "bible/31.json", "bible/32.json", "bible/33.json", "bible/34.json", "bible/35.json", "bible/36.json", "bible/37.json", "bible/38.json", "bible/39.json", "bible/40.json", "bible/41.json", "bible/42.json", "bible/43.json", "bible/44.json", "bible/45.json", "bible/46.json", "bible/47.json", "bible/48.json", "bible/49.json", "bible/50.json", "bible/51.json", "bible/52.json", "bible/53.json", "bible/54.json", "bible/55.json", "bible/56.json", "bible/57.json", "bible/58.json", "bible/59.json", "bible/60.json", "bible/61.json", "bible/62.json", "bible/63.json", "bible/64.json", "bible/65.json", "bible/66.json"];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(CORE);await c.addAll(COREF.map(f=>new Request(f,{cache:'reload'})));
  const st=await caches.open(STATIC);
  await Promise.all(STATICF.map(async f=>{if(await st.match(f))return;const old=await caches.match(f,{ignoreSearch:true});if(old){await st.put(f,old);return}const r=await fetch(f,{cache:'reload'});if(r.ok)await st.put(f,r)}));
  await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CORE&&k!==STATIC).map(k=>caches.delete(k)));
  const st=await caches.open(STATIC);const want=new Set(STATICF.map(f=>new URL(f,self.registration.scope).href));for(const r of await st.keys())if(!want.has(r.url))await st.delete(r);
  await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(/version\.json$/.test(new URL(r.url).pathname))return;
  if(r.mode==='navigate'){e.respondWith(new Promise(res=>{let done=false;const fb=()=>{if(done)return;done=true;caches.match('index.html').then(m=>res(m||fetch(r)))};const t=setTimeout(fb,3000);
    fetch(r,{cache:'no-store'}).then(n=>{if(done)return;clearTimeout(t);done=true;if(n&&n.ok){const c=n.clone();caches.open(CORE).then(ca=>ca.put('index.html',c))}res(n)}).catch(()=>{clearTimeout(t);fb()})}));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).catch(()=>Response.error())))});
