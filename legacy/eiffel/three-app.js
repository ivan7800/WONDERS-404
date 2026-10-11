import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export async function launch(){
 const old=document.getElementById('scene');
 if(!document.createElement('canvas').getContext('webgl2') && !document.createElement('canvas').getContext('webgl')) throw new Error('WebGL no disponible');
 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8)); renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const canvas=renderer.domElement;canvas.id='webgl-scene';canvas.setAttribute('aria-label','Modelo tridimensional interactivo de la Torre Eiffel');
 old.after(canvas);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#98b8c9');scene.fog=new THREE.FogExp2('#bdc7be',0.0009);
 const camera=new THREE.PerspectiveCamera(46,1,0.5,4000);
 const sun=new THREE.DirectionalLight(0xffd5a2,3.2);sun.position.set(-260,420,190);scene.add(sun);
 const hemi=new THREE.HemisphereLight(0xc6e1fa,0x71543e,2.3);scene.add(hemi);
 const nightGlow=new THREE.PointLight(0xffc16e,0,520);nightGlow.position.set(0,170,65);scene.add(nightGlow);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),new THREE.MeshStandardMaterial({color:0x718278,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.6;scene.add(ground);
 const grid=new THREE.GridHelper(850,34,0x81958b,0x81958b);grid.material.transparent=true;grid.material.opacity=.12;grid.position.y=-1.3;scene.add(grid);
 // Paisaje estilizado inspirado en el entorno del Champ-de-Mars y el Sena.
 const city=new THREE.Group(),parks=new THREE.Group(),water=new THREE.Group();scene.add(city,parks,water);
 let seed=404;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
 const houseMaterial=new THREE.MeshStandardMaterial({color:0xc7b6a3,roughness:.92,flatShading:true});
 const roofMaterial=new THREE.MeshStandardMaterial({color:0x596779,roughness:.82});
 const houseGeo=new THREE.BoxGeometry(1,1,1);const houses=new THREE.InstancedMesh(houseGeo,houseMaterial,230);const roofs=new THREE.InstancedMesh(houseGeo,roofMaterial,230);const obj=new THREE.Object3D();
 for(let i=0;i<230;i++){
   let x=(rnd()-.5)*1800,z=(rnd()-.5)*1800;
   if(Math.abs(x)<132&&Math.abs(z)<154){x+=(x<0?-1:1)*215}
   if(z < -285 && z > -405){z-=145}
   const w=12+rnd()*21,d=14+rnd()*23,h=11+rnd()*23;
   obj.position.set(x,h/2-1,z);obj.scale.set(w,h,d);obj.rotation.y=0;obj.updateMatrix();houses.setMatrixAt(i,obj.matrix);
   obj.position.y=h+.4;obj.scale.set(w+2,2,d+2);obj.updateMatrix();roofs.setMatrixAt(i,obj.matrix);
 }
 houses.instanceMatrix.needsUpdate=true;roofs.instanceMatrix.needsUpdate=true;city.add(houses,roofs);
 const turf=new THREE.MeshStandardMaterial({color:0x547b55,roughness:1});
 const pathway=new THREE.MeshStandardMaterial({color:0xcabda2,roughness:1});
 const avenue=new THREE.MeshStandardMaterial({color:0x6e7880,roughness:1});
 function plane(w,d,x,z,mat,y=-1.32){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);return m}
 // Eje peatonal ajardinado y avenidas: evocación artística, NO cartografía exacta.
 parks.add(plane(130,580,0,350,turf),plane(24,580,0,350,pathway,-1.29),plane(170,24,0,112,avenue,-1.26),plane(170,24,0,-118,avenue,-1.26));
 const trunkGeo=new THREE.CylinderGeometry(1.1,1.3,10,5),crownGeo=new THREE.ConeGeometry(6,19,7);
 const trunkMat=new THREE.MeshStandardMaterial({color:0x66503d}),leafMat=new THREE.MeshStandardMaterial({color:0x315b44,roughness:1});
 const trunks=new THREE.InstancedMesh(trunkGeo,trunkMat,140),crowns=new THREE.InstancedMesh(crownGeo,leafMat,140);
 for(let i=0;i<140;i++){const side=i%2?-1:1;const row=Math.floor(i/2);const x=side*(39+(row%3)*6),z=84+row*8.2;obj.rotation.y=0;obj.scale.set(1,1,1);obj.position.set(x,4,z);obj.updateMatrix();trunks.setMatrixAt(i,obj.matrix);obj.position.y=17;obj.updateMatrix();crowns.setMatrixAt(i,obj.matrix)}
 trunks.instanceMatrix.needsUpdate=true;crowns.instanceMatrix.needsUpdate=true;parks.add(trunks,crowns);
 const riverMat=new THREE.MeshStandardMaterial({color:0x3b7891,metalness:.25,roughness:.32});water.add(plane(2000,115,0,-360,riverMat,-1.22));
 const bridgeMat=new THREE.MeshStandardMaterial({color:0xa7a39b,roughness:.9});water.add(plane(28,128,0,-360,bridgeMat,-.92));
 const stars=new THREE.Group();scene.add(stars);const starGeo=new THREE.BufferGeometry(),starPositions=[];
 for(let i=0;i<340;i++){const th=rnd()*Math.PI*2,ph=rnd()*Math.PI*.42;const r=1800;starPositions.push(Math.cos(th)*Math.cos(ph)*r,300+Math.sin(ph)*r,Math.sin(th)*Math.cos(ph)*r)}
 starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));stars.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xfff3dc,size:5,sizeAttenuation:false})));stars.visible=false;
 let model;
 try{model=(await new GLTFLoader().loadAsync('./assets/eiffel_404.glb')).scene;}catch(error){renderer.dispose();canvas.remove();throw error;}
 scene.add(model);model.traverse(o=>{if(o.isMesh){o.frustumCulled=false;if(o.material){o.material.metalness=.67;o.material.roughness=.43;o.material.side=THREE.DoubleSide;}}});
 const spots=[];const lamps=new THREE.Group();scene.add(lamps);
 const lampMat=new THREE.MeshBasicMaterial({color:0xffd28d});const lampGeo=new THREE.SphereGeometry(.75,5,4);
 for(const h of [12,25,40,57,75,96,115,148,180,215,245,276,300]){let r=h<=276?Math.max(4,57-h*.18):3;for(let i=0;i<8;i++){let t=i*Math.PI/4;const m=new THREE.Mesh(lampGeo,lampMat);m.position.set(Math.cos(t)*r,h,Math.sin(t)*r);lamps.add(m)}}
 // Decoración nocturna independiente: pequeñas luces de superficie, activación voluntaria.
 const sparkles=new THREE.Group();scene.add(sparkles);sparkles.visible=false;
 const sparkleGeo=new THREE.SphereGeometry(.65,5,4);
 const sparkleMat=new THREE.MeshBasicMaterial({color:0xffe8ad});
 for(let i=0;i<145;i++){const h=8+rnd()*286, angle=rnd()*Math.PI*2, radius=Math.max(4,58-h*.17);const m=new THREE.Mesh(sparkleGeo,sparkleMat);m.position.set(Math.cos(angle)*radius,h,Math.sin(angle)*radius);m.userData.phase=rnd()*6.28;sparkles.add(m)}
 const state={spark:false,cinema:false,photo:false,exposure:1.25,ride:null,rideToken:0,yaw:-.55,pitch:.2,dist:550,focus:135,target:135,night:false,period:'day',auto:false,drag:false,x:0,y:0,level:0,fog:false};
 const $=id=>document.getElementById(id),app=document.querySelector('.app');let toastTimer;
 function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2700)}
 function resize(){const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}window.addEventListener('resize',resize);if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(app);resize();
 function mode(period){
  state.period=period;state.night=period==='night';const night=state.night,sunset=period==='sunset';
  app.classList.toggle('light',!night);app.classList.toggle('sunset',sunset);
  for(const [id,on] of [['dayBtn',period==='day'],['sunsetBtn',sunset],['nightBtn',night]])$(id).classList.toggle('active',on);
  scene.background.set(night?'#071328':sunset?'#dd8e74':'#91b6c8');
  scene.fog.color.set(night?'#172c43':sunset?'#caa090':'#bdc7be');
  sun.color.set(night?'#91a7cf':sunset?'#ff975e':'#ffd5a2');sun.position.set(sunset?-400:-260,sunset?130:420,190);
  sun.intensity=night?.14:sunset?2.1:3.2;hemi.intensity=night?.78:sunset?1.65:2.3;
  nightGlow.intensity=night?35:sunset?8:0;lamps.visible=night||sunset;stars.visible=night;
  houseMaterial.color.set(night?'#425065':sunset?'#c4a094':'#c7b6a3');roofMaterial.color.set(night?'#27374f':'#596779');
  ground.material.color.set(night?'#273d41':sunset?'#80786c':'#718278');riverMat.color.set(night?'#183e65':sunset?'#80636d':'#3b7891');
  renderer.toneMappingExposure=state.exposure*(night?1.2:sunset?1.08:1);
 }
 function setFog(on){state.fog=on;scene.fog.density=on?.0033:.0009;$('fogBtn').classList.toggle('active',on);toast(on?'BRUMA ACTIVADA':'BRUMA DESACTIVADA')}
 // Panel premium: sonido generado localmente con Web Audio. Nada se descarga ni se reproduce sin permiso.
 let audioCtx=null,audioNodes=null;
 async function setSound(on){
  if(!on){if(audioNodes){const {gain,osc1,osc2}=audioNodes;gain.gain.setTargetAtTime(0,audioCtx.currentTime,.09);setTimeout(()=>{try{osc1.stop();osc2.stop()}catch{}},350);audioNodes=null}$('soundBtn').setAttribute('aria-pressed','false');$('soundBtn').classList.remove('active');toast('AMBIENTE SILENCIADO');return}
  try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)throw Error('Web Audio no disponible');audioCtx??=new AudioContext();await audioCtx.resume();const osc1=audioCtx.createOscillator(),osc2=audioCtx.createOscillator(),gain=audioCtx.createGain();osc1.type='sine';osc1.frequency.value=110;osc2.type='sine';osc2.frequency.value=164.81;gain.gain.value=0;osc1.connect(gain);osc2.connect(gain);gain.connect(audioCtx.destination);osc1.start();osc2.start();gain.gain.setTargetAtTime(.018,audioCtx.currentTime,.35);audioNodes={osc1,osc2,gain};$('soundBtn').classList.add('active');$('soundBtn').setAttribute('aria-pressed','true');toast('AMBIENTE ACTIVADO · AUDIO SINTÉTICO')}catch(e){toast('AUDIO NO DISPONIBLE')}}
 $('soundBtn').addEventListener('click',()=>setSound(!audioNodes));
 $('sparkBtn').addEventListener('click',()=>{state.spark=!state.spark; sparkles.visible=state.spark; $('sparkBtn').classList.toggle('active',state.spark);$('sparkBtn').setAttribute('aria-pressed',String(state.spark));toast(state.spark?'DESTELLOS ACTIVADOS':'DESTELLOS DESACTIVADOS')});
 $('cinemaBtn').addEventListener('click',()=>{state.cinema=!state.cinema;app.classList.toggle('cinema',state.cinema);$('cinemaBtn').classList.toggle('active',state.cinema);$('cinemaBtn').setAttribute('aria-pressed',String(state.cinema));toast(state.cinema?'MODO CINEMA ACTIVADO':'MODO CINEMA DESACTIVADO')});
 $('exposureSlider').addEventListener('input',e=>{state.exposure=Number(e.target.value);$('exposureValue').textContent=state.exposure.toFixed(2); renderer.toneMappingExposure=state.exposure*(state.night?1.2:state.period==='sunset'?1.08:1)});
 function photoMode(on){state.photo=on;app.classList.toggle('photo-mode',on);$('photoToolbar').hidden=!on;$('photoModeBtn').setAttribute('aria-pressed',String(on));toast(on?'ESTUDIO FOTOGRÁFICO · P PARA SALIR':'MODO FOTO CERRADO');resize()}
 $('photoModeBtn').addEventListener('click',()=>photoMode(!state.photo));$('photoExitBtn').addEventListener('click',()=>photoMode(false));
 $('photoSaveBtn').addEventListener('click',()=>$('photoBtn').click());
 document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||/input|textarea|select/i.test(e.target.tagName)||!$('helpModal').hidden)return;const k=e.key.toLowerCase();if(k==='p')photoMode(!state.photo);if(k==='escape'&&state.photo)photoMode(false);if('1234'.includes(k)&&k.length===1)setLevel(Number(k)-1);if(k==='d')mode('day');if(k==='n')mode('night');if(k==='o')mode('sunset')});
 $('cityBtn').addEventListener('click',()=>{city.visible=!city.visible;$('cityBtn').classList.toggle('active',city.visible);toast(city.visible?'CIUDAD VISIBLE':'CIUDAD OCULTA')});
 $('parksBtn').addEventListener('click',()=>{parks.visible=!parks.visible;water.visible=parks.visible;$('parksBtn').classList.toggle('active',parks.visible);toast(parks.visible?'PAISAJE VISIBLE':'PAISAJE OCULTO')});
 $('fogBtn').addEventListener('click',()=>setFog(!state.fog));
 $('sunsetBtn').addEventListener('click',()=>mode('sunset'));
 function setLevel(num){cancelRide(false);const heights=[135,57,115,276],ranges=[550,185,160,105];state.level=num;state.target=heights[num];state.dist=ranges[num];document.querySelectorAll('[data-level]').forEach(b=>b.classList.toggle('active',Number(b.dataset.level)===num));$('altitude').textContent=String([0,57,115,276][num]).padStart(3,'0')+' M';if(num)toast(['','PRIMER NIVEL · 57 M','SEGUNDO NIVEL · 115 M','CIMA · 276 M'][num])}
 document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>setLevel(Number(b.dataset.level))));
 $('dayBtn').addEventListener('click',()=>mode('day'));$('nightBtn').addEventListener('click',()=>mode('night'));
 $('spinBtn').addEventListener('click',()=>{state.auto=!state.auto;$('spinBtn').classList.toggle('active',state.auto);toast(state.auto?'GIRO AUTOMÁTICO ACTIVADO':'GIRO AUTOMÁTICO DESACTIVADO')});
 $('resetBtn').addEventListener('click',()=>{cancelRide(false);state.yaw=-.55;state.pitch=.2;state.auto=false;$('spinBtn').classList.remove('active');state.spark=false;sparkles.visible=false;$('sparkBtn').classList.remove('active');$('sparkBtn').setAttribute('aria-pressed','false');state.cinema=false;app.classList.remove('cinema');$('cinemaBtn').classList.remove('active');$('cinemaBtn').setAttribute('aria-pressed','false');setSound(false);setFog(false);mode('day');state.exposure=1.25;$('exposureSlider').value='1.25';$('exposureValue').textContent='1.25';renderer.toneMappingExposure=1.25;city.visible=true;parks.visible=true;water.visible=true;$('cityBtn').classList.add('active');$('parksBtn').classList.add('active');setLevel(0);toast('VISTA RESTABLECIDA')});
 $('exploreBtn').addEventListener('click',()=>{setLevel(1);toast('ARRASTRA PARA EXPLORAR')});
 $('tourBtn').addEventListener('click',()=>startGuided());
 $('photoBtn').addEventListener('click',()=>{try{renderer.render(scene,camera);const a=document.createElement('a');a.download='EIFFEL-404-'+(state.night?'noche':'dia')+'.png';a.href=canvas.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();toast('CAPTURA PNG GENERADA')}catch(e){toast('CAPTURA NO DISPONIBLE')}});
 $('fullBtn').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(app.requestFullscreen)await app.requestFullscreen();else toast('PANTALLA COMPLETA NO DISPONIBLE')}catch{toast('PANTALLA COMPLETA BLOQUEADA')}});
 const levelHeights=[0,57,115,276],levelNames=['BASE','PRIMER NIVEL','SEGUNDO NIVEL','CIMA'];
 const rideLabel=$('rideLabel'),rideProgress=$('rideProgress');
 function rideUI(text,ratio=0){rideLabel.textContent=text;rideProgress.style.width=(Math.max(0,Math.min(1,ratio))*100).toFixed(1)+'%';}
 function cancelRide(show=true){state.ride=null;state.rideToken++;$('liftBtn').classList.remove('active');$('walkBtn').classList.remove('active');$('guidedBtn').classList.remove('active');rideUI('EXPLORACIÓN LIBRE');if(show)toast('RECORRIDO DETENIDO');}
 function beginRide(type,segments){cancelRide(false);state.auto=false;$('spinBtn').classList.remove('active');const key=type==='lift'?'liftBtn':type==='walk'?'walkBtn':'guidedBtn';$(key).classList.add('active');state.ride={type,segments,segment:0,elapsed:0,from:{h:state.focus,d:state.dist,y:state.yaw,p:state.pitch}};rideUI(type==='lift'?'ASCENSOR · INICIO':type==='walk'?'ACCESO AL MIRADOR':'VISITA GUIADA',0);toast(type==='lift'?'ASCENSOR EN MOVIMIENTO':type==='walk'?'ACERCÁNDOTE AL MIRADOR':'VISITA GUIADA INICIADA');}
 function startLift(){beginRide('lift',[{h:0,d:125,y:state.yaw,p:.08,t:3},{h:57,d:95,y:-.8,p:.07,t:4.5},{h:115,d:82,y:.35,p:.06,t:4.5},{h:276,d:75,y:1.2,p:.06,t:6}]);}
 function startWalk(){const i=state.level||1,h=levelHeights[i];beginRide('walk',[{h,d:i===3?30:38,y:state.yaw+.45,p:.02,t:3.5}]);}
 function startGuided(){beginRide('guided',[{h:57,d:90,y:-.8,p:.09,t:4},{h:57,d:72,y:.7,p:.08,t:4},{h:115,d:78,y:1.7,p:.06,t:4},{h:115,d:65,y:3.1,p:.07,t:4},{h:276,d:65,y:4.2,p:.04,t:5},{h:276,d:52,y:5.5,p:.07,t:4}]);}
 $('liftBtn').addEventListener('click',startLift);$('walkBtn').addEventListener('click',startWalk);$('guidedBtn').addEventListener('click',startGuided);$('stopBtn').addEventListener('click',()=>cancelRide());
 function updateRide(dt){const ride=state.ride;if(!ride)return;const target=ride.segments[ride.segment];if(!target){cancelRide(false);toast('RECORRIDO COMPLETADO');return}ride.elapsed+=dt;const raw=Math.min(1,ride.elapsed/target.t),u=raw*raw*(3-2*raw),from=ride.from;
  state.focus=from.h+(target.h-from.h)*u;state.target=state.focus;state.dist=from.d+(target.d-from.d)*u;state.yaw=from.y+(target.y-from.y)*u;state.pitch=from.p+(target.p-from.p)*u;
  const overall=(ride.segment+raw)/ride.segments.length;rideUI(ride.type==='lift'?'ASCENSOR · '+Math.round(state.focus)+' M':ride.type==='walk'?'MIRADOR · '+Math.round(state.focus)+' M':'VISITA · '+Math.round(overall*100)+'%',overall);
  if(raw>=1){ride.segment++;ride.elapsed=0;ride.from={h:target.h,d:target.d,y:target.y,p:target.p};if(ride.segment>=ride.segments.length){cancelRide(false);toast('RECORRIDO COMPLETADO')}}
 }
 const modal=$('helpModal');function openHelp(){modal.hidden=false;$('closeHelp').focus()}function closeHelp(){modal.hidden=true;$('helpBtn').focus()}
 $('helpBtn').addEventListener('click',openHelp);$('closeHelp').addEventListener('click',closeHelp);$('modalStart').addEventListener('click',closeHelp);modal.addEventListener('click',e=>{if(e.target===modal)closeHelp()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeHelp()});
 const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));let pinch=0;
 canvas.addEventListener('pointerdown',e=>{if(state.ride)cancelRide(false);state.drag=true;state.x=e.clientX;state.y=e.clientY;canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!state.drag)return;state.yaw+=(e.clientX-state.x)*.006;state.pitch=clamp(state.pitch+(e.clientY-state.y)*.003,-.9,1.05);state.x=e.clientX;state.y=e.clientY});
 canvas.addEventListener('pointerup',()=>state.drag=false);canvas.addEventListener('pointercancel',()=>state.drag=false);
 canvas.addEventListener('wheel',e=>{e.preventDefault();if(state.ride)cancelRide(false);state.dist=clamp(state.dist*(e.deltaY>0?1.09:.91),32,1200)},{passive:false});
 canvas.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
 canvas.addEventListener('touchmove',e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch)state.dist=clamp(state.dist*pinch/d,32,1200);pinch=d}},{passive:true});
 canvas.addEventListener('touchend',()=>pinch=0);
 mode('day');old.style.display='none';toast('MODO 3D · THREE.JS ACTIVO');
 const focus=new THREE.Vector3(0,135,0);let last=performance.now();
 function tick(t){const dt=Math.min(.05,Math.max(0,(t-last)/1000));last=t;if(state.auto)state.yaw+=dt*.17;if(state.ride)updateRide(dt);else state.focus+=(state.target-state.focus)*Math.min(1,dt*4);focus.set(0,state.focus,0);const c=Math.cos(state.pitch);camera.position.set(state.dist*c*Math.sin(state.yaw),state.focus+state.dist*Math.sin(state.pitch),state.dist*c*Math.cos(state.yaw));camera.lookAt(focus);if(state.spark){for(let i=0;i<sparkles.children.length;i++){const p=sparkles.children[i];p.scale.setScalar(.65+.45*Math.sin(t*.004+p.userData.phase))}}renderer.render(scene,camera);requestAnimationFrame(tick)}requestAnimationFrame(tick);
}
