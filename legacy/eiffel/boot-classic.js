/* EIFFEL 404 v6.2: works from file:// and offline; WebGL is optional. */
(function(){
'use strict';
const status=document.getElementById('engineStatus');
const button=document.getElementById('engineToggle');
const params=new URLSearchParams(location.search);
const wantWebGL=false; // Canvas fallback only; WebGL handled by boot-local.js
const announce=message=>{status.textContent=message;};
function fallback(reason){
 document.documentElement.dataset.engine='canvas';
 if(reason)console.warn('EIFFEL 404: WebGL no disponible:',reason);
 const ids=['sunsetBtn','cityBtn','parksBtn','fogBtn','liftBtn','walkBtn','guidedBtn','stopBtn','sparkBtn','soundBtn','cinemaBtn'];
 ids.forEach(id=>{const el=document.getElementById(id);if(el){el.disabled=true;el.title='Disponible en 3D WebGL'}});
 const slider=document.getElementById('exposureSlider');if(slider)slider.disabled=true;
 let script=document.createElement('script');script.src='./app.js';
 script.onload=()=>{
  announce('VISUALIZACIÓN ACTIVA · MODO COMPATIBLE');
  const app=document.querySelector('.app'),toolbar=document.getElementById('photoToolbar'),photoBtn=document.getElementById('photoModeBtn');
  const photo=on=>{app.classList.toggle('photo-mode',on);toolbar.hidden=!on;photoBtn.setAttribute('aria-pressed',String(on));};
  photoBtn.addEventListener('click',()=>photo(!app.classList.contains('photo-mode')));
  document.getElementById('photoExitBtn').addEventListener('click',()=>photo(false));
  document.getElementById('photoSaveBtn').addEventListener('click',()=>document.getElementById('photoBtn').click());
  document.addEventListener('keydown',e=>{if(e.key==='Escape')photo(false);if(e.key.toLowerCase()==='p'&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!/input|textarea|select/i.test(e.target.tagName))photo(!app.classList.contains('photo-mode'));});
 };
 script.onerror=()=>announce('ERROR: no se pudo cargar app.js; comprueba que has extraído todo el ZIP');
 document.body.appendChild(script);
 button.textContent='ACTIVAR 3D WEBGL';
 button.onclick=()=>{if(location.protocol==='file:'){announce('Para WebGL, abre INICIAR_WINDOWS.bat; el modo visible funciona sin servidor.');return;}params.set('engine','webgl');location.search=params.toString();};
}
if(wantWebGL && location.protocol!=='file:'){
 announce('Cargando modelo 3D WebGL...');
 import('./three-app.js').then(m=>m.launch()).then(()=>{
  document.documentElement.dataset.engine='webgl';announce('MODELO 3D WEBGL ACTIVO');
  button.textContent='MODO COMPATIBLE';button.onclick=()=>{params.delete('engine');location.search=params.toString();};
 }).catch(error=>fallback(error));
}else fallback(wantWebGL?'WebGL requiere servidor HTTP':null);
})();
