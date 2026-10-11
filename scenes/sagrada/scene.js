import {createRenderer} from '../../js/core/renderer.js';
import {sagrada} from '../../js/monuments/sagrada.js';
import {points} from './tour-data.js';
const canvas=document.getElementById('view');const status=document.getElementById('message');
try {
 const renderer=createRenderer(canvas,sagrada());let yaw=.48,pitch=.31,zoom=145,auto=false,time='day',dragging=false,x=0,y=0,last=0,raf=0,tour=false,photo=false,target=null,selected=0;const pointers=new Map();let pinchDistance=0;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const presets={day:{sky:[.49,.69,.76],light:1.12},sunset:{sky:[.62,.39,.34],light:.87},night:{sky:[.05,.095,.16],light:.48,night:1}};
 function render(t){const dt=Math.min(Math.max((t-last)/1000,0),.06);last=t;if(target){const a=1-Math.exp(-dt*2.7);yaw+=(target.yaw-yaw)*a;pitch+=(target.pitch-pitch)*a;zoom+=(target.zoom-zoom)*a;if(Math.abs(yaw-target.yaw)+Math.abs(pitch-target.pitch)+Math.abs(zoom-target.zoom)<.025)target=null;}else if(auto)yaw+=dt*.11;renderer.draw({yaw,pitch,zoom,...presets[time]});raf=requestAnimationFrame(render)}
 function updateTime(v){time=v;for(const name of ['day','sunset','night'])document.getElementById(name).setAttribute('aria-pressed',String(name===v))}
 document.getElementById('orbit').onclick=e=>{tour=false;document.getElementById('tour').setAttribute('aria-pressed','false');auto=!auto;e.currentTarget.setAttribute('aria-pressed',String(auto))};
 for(const name of ['day','sunset','night'])document.getElementById(name).onclick=()=>updateTime(name);
 document.getElementById('reset').onclick=()=>{target={yaw:.48,pitch:.31,zoom:145};tour=false;document.getElementById('tour').setAttribute('aria-pressed','false');auto=false;document.getElementById('orbit').setAttribute('aria-pressed','false')};
 canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragging=true;x=e.clientX;y=e.clientY});
 canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){yaw+=(e.clientX-old.x)*.008;pitch=clamp(pitch+(e.clientY-old.y)*.006,-.08,1.12)}else if(pointers.size===2){const [a,b]=[...pointers.values()];const distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance)zoom=clamp(zoom*pinchDistance/distance,35,170);pinchDistance=distance}});
 const end=e=>{pointers.delete(e.pointerId);pinchDistance=0;dragging=pointers.size>0};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=clamp(zoom*Math.exp(e.deltaY*.001),40,170)},{passive:false});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf)}else{last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(render)}});

 const poiButtons=document.getElementById('poiButtons');
 points.forEach((point,i)=>{const button=document.createElement('button');button.textContent=String(i+1).padStart(2,'0')+' · '+point.short;button.type='button';button.onclick=()=>showPoint(i);poiButtons.append(button)});
 function showPoint(i){selected=(i+points.length)%points.length;const point=points[selected];auto=false;document.getElementById('orbit').setAttribute('aria-pressed','false');target={...point.camera};const detail=document.getElementById('poiDetails');detail.replaceChildren();const heading=document.createElement('h2');heading.textContent=point.title;const paragraph=document.createElement('p');paragraph.textContent=point.description;detail.append(heading,paragraph);[...poiButtons.children].forEach((el,n)=>el.setAttribute('aria-pressed',String(n===selected)));}
 document.getElementById('nextPoi').onclick=()=>showPoint(selected+1);
 document.getElementById('tour').onclick=e=>{tour=!tour;e.currentTarget.setAttribute('aria-pressed',String(tour));if(tour)showPoint(0)};
 function setPhoto(active){photo=active;document.body.classList.toggle('photo-mode',active);document.getElementById('exitPhoto').hidden=!active;document.getElementById('photo').setAttribute('aria-pressed',String(active));}
 document.getElementById('photo').onclick=()=>setPhoto(!photo);
 document.getElementById('exitPhoto').onclick=()=>setPhoto(false);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&photo)setPhoto(false);if(e.key==='ArrowRight'&&!photo)showPoint(selected+1)});
 document.getElementById('capture').onclick=()=>{try{renderer.draw({yaw,pitch,zoom,...presets[time]});const link=document.createElement('a');link.download='WONDERS404_SagradaFamilia_'+Date.now()+'.png';link.href=canvas.toDataURL('image/png');link.click();status.textContent='Fotografía preparada.';}catch(error){status.textContent='No se pudo guardar la fotografía.';console.error(error)}};
 showPoint(0);
 updateTime('day');raf=requestAnimationFrame(render);
}catch(err){status.textContent='Este navegador no puede iniciar WebGL: '+err.message;console.error(err)}

canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();status.textContent='Se ha interrumpido WebGL. Recarga la escena para recuperarla.';});
