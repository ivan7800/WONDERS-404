// EIFFEL 404: arranque resiliente y estado explícito del motor.
(async()=>{
 const notify=(message)=>{const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),4500)};
 try {
   const module=await import('./three-app.js');
   await module.launch();
   document.documentElement.dataset.engine='webgl';
 } catch(error) {
   console.warn('EIFFEL 404: no se pudo iniciar Three.js; motor Canvas alternativo',error);
   document.documentElement.dataset.engine='canvas';
   const fallbackOnly=['sunsetBtn','cityBtn','parksBtn','fogBtn','liftBtn','walkBtn','guidedBtn','stopBtn','sparkBtn','soundBtn','cinemaBtn'];
   for(const id of fallbackOnly){const button=document.getElementById(id);if(button){button.disabled=true;button.classList.remove('active');button.title='Requiere Three.js y WebGL';button.setAttribute('aria-label',button.textContent.trim()+' (requiere Three.js y WebGL)')}}
   const slider=document.getElementById('exposureSlider');slider.disabled=true;slider.title='Requiere Three.js y WebGL';
   const script=document.createElement('script');script.src='./app.js';
   script.onload=()=>{
      const app=document.querySelector('.app');const toolbar=document.getElementById('photoToolbar');const button=document.getElementById('photoModeBtn');
      const photo=(enabled)=>{app.classList.toggle('photo-mode',enabled);toolbar.hidden=!enabled;button.setAttribute('aria-pressed',String(enabled))};
      button.addEventListener('click',()=>photo(!app.classList.contains('photo-mode')));
      document.getElementById('photoExitBtn').addEventListener('click',()=>photo(false));
      document.getElementById('photoSaveBtn').addEventListener('click',()=>document.getElementById('photoBtn').click());
      document.addEventListener('keydown',e=>{if(e.key==='Escape')photo(false);if(e.key.toLowerCase()==='p'&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!/input|textarea|select/i.test(e.target.tagName))photo(!app.classList.contains('photo-mode'))});
      notify('MODO COMPATIBILIDAD CANVAS · FUNCIONES 3D AVANZADAS DESACTIVADAS');
   };
   script.onerror=()=>notify('ERROR AL CARGAR EL MOTOR DE RESERVA');
   document.body.appendChild(script);
 }
})();
