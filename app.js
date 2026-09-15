'use strict';
const $ = (id) => document.getElementById(id);
const connections = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
const points = [[228,356],[178,310],[139,267],[99,239],[70,216],[180,235],[166,161],[158,110],[152,70],[223,225],[225,137],[225,83],[223,43],[261,237],[276,158],[282,113],[284,79],[291,258],[318,207],[334,177],[345,150]];
function handSVG(){return `<path d="M228 376 C203 348 187 332 173 310 L120 272 Q67 252 58 220 Q59 204 76 206 L129 239 147 249 156 235 139 82 Q139 60 153 59 Q170 59 174 83 L196 195 207 198 211 49 Q210 31 224 31 Q240 32 239 52 L239 202 250 207 270 83 Q272 65 286 67 Q300 70 295 92 L278 224 287 236 334 143 Q341 131 351 138 Q362 144 355 160 L315 273 Q306 321 273 367" fill="var(--tracking)" fill-opacity=".035" stroke="var(--tracking)" stroke-opacity=".13" stroke-width="1.2"/>`+connections.map(([a,b])=>`<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" stroke="var(--tracking)" stroke-width="2" opacity=".75"/>`).join('')+points.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===0?7:4}" fill="#202c18" stroke="var(--tracking)" stroke-width="1.7"/><circle cx="${x}" cy="${y}" r="1.5" fill="var(--tracking)"/>`).join('');}
$('hand-art').innerHTML = $('mini-hand').innerHTML = handSVG();
let prefs = {camera:'environment',color:'#c7f86a'};
try { const saved = JSON.parse(localStorage.getItem('core-mr-settings')); if(saved && ['user','environment'].includes(saved.camera) && /^#[0-9a-f]{6}$/i.test(saved.color)) prefs = saved; } catch {}
const palette = [['#c7f86a','Lima'],['#65e4e7','Ciano'],['#9a92ff','Violeta'],['#ff91bd','Rosa'],['#ffffff','Branco']];
$('swatches').innerHTML = palette.map(([color,name])=>`<button type="button" class="swatch" style="background:${color}" data-color="${color}" aria-label="${name}" aria-pressed="false"></button>`).join('');
function updateColor(color){prefs.color=color; document.documentElement.style.setProperty('--tracking',color); $('custom-color').value=color; document.querySelectorAll('.swatch').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===color)));}
updateColor(prefs.color);
document.querySelector(`input[name=camera][value=${prefs.camera}]`).checked=true;
$('settings-open').onclick=()=>$('settings').showModal();
$('settings-save').onclick=()=>{try{localStorage.setItem('core-mr-settings',JSON.stringify(prefs));}catch{} $('settings').close();};
document.querySelectorAll('[name=camera]').forEach(input=>input.onchange=()=>{prefs.camera=input.value;});
document.querySelectorAll('.swatch').forEach(button=>button.onclick=()=>updateColor(button.dataset.color));
$('custom-color').oninput=e=>updateColor(e.target.value);
$('settings').addEventListener('click',e=>{if(e.target===$('settings')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
const session=$('session'), video=$('camera-video'), left=$('eye-left'), right=$('eye-right');
const ctx=left.getContext('2d'), rightCtx=right.getContext('2d');
let stream=null, tracker=null, active=false, generation=0, frame=0, loadingScript=null, wakeLock=null, sessionFacing='environment';
function loadHands(){
  if(window.Hands)return Promise.resolve();
  if(loadingScript)return loadingScript;
  loadingScript=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js';
    script.crossOrigin='anonymous';
    const timer=setTimeout(()=>{script.remove();loadingScript=null;reject(new Error('model'));},25000);
    script.onload=()=>{clearTimeout(timer);resolve();};
    script.onerror=()=>{clearTimeout(timer);script.remove();loadingScript=null;reject(new Error('model'));};
    document.head.appendChild(script);
  });return loadingScript;
}
function message(title,detail,error=false){$('session-message').hidden=false;$('session-title').textContent=title;$('session-detail').textContent=detail;$('retry').hidden=!error;document.querySelector('.loader').hidden=error;}
async function fullscreen(){try{if(!document.fullscreenElement && session.requestFullscreen) await session.requestFullscreen();}catch{}try{await screen.orientation?.lock?.('landscape');}catch{}}
$('fullscreen').onclick=fullscreen;
function draw(results){
  if(!active)return;
  const w=video.videoWidth,h=video.videoHeight;if(!w||!h)return;
  if(left.width!==w||left.height!==h){left.width=right.width=w;left.height=right.height=h;}
  ctx.save();ctx.clearRect(0,0,w,h);
  if(sessionFacing==='user'){ctx.translate(w,0);ctx.scale(-1,1);}
  ctx.drawImage(results.image,0,0,w,h);
  ctx.strokeStyle=prefs.color;ctx.fillStyle=prefs.color;ctx.lineWidth=Math.max(3,w/280);ctx.lineCap='round';ctx.shadowColor=prefs.color;ctx.shadowBlur=7;
  for(const hand of results.multiHandLandmarks||[]){
    ctx.beginPath();for(const [a,b] of connections){ctx.moveTo(hand[a].x*w,hand[a].y*h);ctx.lineTo(hand[b].x*w,hand[b].y*h);}ctx.stroke();
    for(const p of hand){ctx.beginPath();ctx.arc(p.x*w,p.y*h,Math.max(4,w/210),0,Math.PI*2);ctx.fill();ctx.save();ctx.fillStyle='#f5ffe8';ctx.beginPath();ctx.arc(p.x*w,p.y*h,1.5,0,Math.PI*2);ctx.fill();ctx.restore();}
  }
  ctx.restore();rightCtx.drawImage(left,0,0,w,h);
  $('session-message').hidden=true;
  const count=results.multiHandLandmarks?.length||0;
  $('tracking-status').textContent=count?`${count===1?'1 MÃO DETECTADA':count+' MÃOS DETECTADAS'} · TRACKING ATIVO`:'MOSTRE SUAS MÃOS À CÂMERA';
}
function release(){cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;const old=tracker;tracker=null;if(old)Promise.resolve(old.close()).catch(()=>{});wakeLock?.release().catch(()=>{});wakeLock=null;ctx.clearRect(0,0,left.width,left.height);rightCtx.clearRect(0,0,right.width,right.height);}
function fail(error,token){
  if(token!==generation||!active)return;
  active=false;release();
  let detail='Não foi possível carregar o rastreamento. Verifique sua conexão e tente novamente.';
  if(['NotAllowedError','PermissionDeniedError'].includes(error.name))detail='O acesso à câmera foi negado. Libere a permissão nas configurações do navegador e tente novamente.';
  else if(['NotFoundError','OverconstrainedError'].includes(error.name))detail='A câmera selecionada não está disponível. Saia e escolha outra câmera nas configurações.';
  else if(error.name==='NotReadableError')detail='A câmera está em uso por outro aplicativo. Feche-o e tente novamente.';
  else if(error.message==='unsupported')detail='Seu navegador não oferece acesso à câmera. Abra este app em HTTPS no Chrome ou Safari atualizado.';
  message('Vamos tentar de novo?',detail,true);$('tracking-status').textContent='EXPERIÊNCIA PAUSADA';
}
async function start(){
  const token=++generation;active=false;release();active=true;sessionFacing=prefs.camera;session.hidden=false;document.body.classList.add('in-session');
  message('Preparando sua realidade…','Permita o acesso à câmera '+(sessionFacing==='user'?'frontal':'traseira')+' para continuar.');$('tracking-status').textContent='CONECTANDO CÂMERA';
  fullscreen();
  try{
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');
    const acquired=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{exact:sessionFacing},width:{ideal:1280},height:{ideal:720}}});
    if(token!==generation||!active){acquired.getTracks().forEach(t=>t.stop());return;}
    stream=acquired;video.srcObject=stream;await video.play();
    if(token!==generation||!active)return;
    message('Conectando seus movimentos…','Carregando o modelo de mãos. A primeira vez pode levar alguns instantes.');
    await loadHands();if(token!==generation||!active)return;
    const model=new Hands({locateFile:file=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`});tracker=model;
    model.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:.6,minTrackingConfidence:.6});model.onResults(results=>{if(token===generation)draw(results);});
    if(navigator.wakeLock)navigator.wakeLock.request('screen').then(lock=>{if(token===generation&&active)wakeLock=lock;else lock.release();}).catch(()=>{});
    const tick=async()=>{if(!active||token!==generation)return;try{await model.send({image:video});if(active&&token===generation)frame=requestAnimationFrame(tick);}catch(e){fail(e,token);}};
    tick();
  }catch(e){fail(e,token);}
}
function stop(){active=false;generation++;release();session.hidden=true;document.body.classList.remove('in-session');if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});try{screen.orientation?.unlock?.();}catch{}}
$('start').onclick=start;$('retry').onclick=start;$('exit').onclick=stop;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!session.hidden)stop();});
window.addEventListener('pagehide',stop);
