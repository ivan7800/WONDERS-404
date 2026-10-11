/* EIFFEL 404 offline WebGL 3D renderer. Native WebGL; no external dependencies. */
(async function(){
'use strict';
const $=id=>document.getElementById(id), status=$('engineStatus'),toggle=$('engineToggle'), old=$('scene');
let canvas,gl,raf,prog,positions,colors,indices,vertexCount=0,environment={},cabin=null,visibleCity=true,visibleParks=true,drag=false,px=0,py=0;
let animation=null, cabinHeight=0, rideSelected=3, previousFrame=0, fallbackStarted=false;
function activateFallback(reason){if(fallbackStarted)return;fallbackStarted=true;cancelAnimationFrame(raf);if(canvas){canvas.remove();canvas=null;}old.style.display='';message(reason+' · MODO COMPATIBLE');const script=document.createElement('script');script.src='./boot-classic.js';script.onerror=()=>message('No se pudo iniciar el motor Canvas. Recarga la página.');document.body.appendChild(script);}
const state={yaw:-.55,pitch:.19,dist:560,focus:135,auto:false,night:false,sunset:false,fog:false,sparks:false,cinema:false,exposure:1.25,photo:false};
const unsupported=['soundBtn'];
const put=(id,fn)=>{const el=$(id);if(el)el.addEventListener('click',fn)};
function message(t){status.textContent=t}
function markUnavailable(){unsupported.forEach(id=>{let el=$(id);if(el){el.disabled=true;el.title='Función pendiente en motor WebGL local';}})}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
function setup(){
 const vs=shader(gl.VERTEX_SHADER,`attribute vec3 aPos;attribute vec4 aColor;uniform mat4 uMVP;uniform vec3 uOffset;varying vec3 vColor;varying float vHeight;varying float vDistance;void main(){vec4 clip=uMVP*vec4(aPos+uOffset,1.0);gl_Position=clip;vColor=aColor.rgb;vHeight=aPos.y;vDistance=abs(clip.w);}`);
 const fs=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 vColor;varying float vHeight;uniform float uNight;uniform float uSunset;uniform float uEnvironment;uniform float uExposure;uniform float uFog;uniform float uSparkle;uniform float uTime;uniform vec3 uSky;varying float vDistance;void main(){vec3 bronze=mix(vec3(.49,.34,.22),vColor,.48);vec3 golden=vec3(.97,.66,.33);vec3 outColor=mix(bronze,golden,uNight*.8);outColor=mix(outColor,vec3(1.0,.51,.27),uSunset*.36);outColor*=.85+clamp(vHeight/330.0,0.0,1.0)*.3;outColor=mix(outColor,vColor,uEnvironment);float pulse=pow(max(0.0,sin(vHeight*2.1+uTime*4.5)),14.0)*uSparkle*(1.0-uEnvironment)*.62;outColor+=vec3(1.0,.72,.28)*pulse;outColor*=uExposure;float mist=(1.0-exp(-max(vDistance-130.0,0.0)*.0019))*uFog;outColor=mix(outColor,uSky,mist*.75);outColor=outColor/(vec3(1.0)+outColor*.19);gl_FragColor=vec4(outColor,1.0);}`);
 prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
}
function matMul(a,b){let out=new Float32Array(16);for(let col=0;col<4;col++)for(let row=0;row<4;row++){let v=0;for(let k=0;k<4;k++)v+=a[k*4+row]*b[col*4+k];out[col*4+row]=v;}return out}
function normalize(v){let len=Math.hypot(...v)||1;return v.map(x=>x/len)}
function lookAt(eye,target){let z=normalize(eye.map((v,i)=>v-target[i])),x=normalize([z[2],0,-z[0]]),y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((a,b,i)=>a+b*eye[i],0),-y.reduce((a,b,i)=>a+b*eye[i],0),-z.reduce((a,b,i)=>a+b*eye[i],0),1])}
function projection(aspect){const f=1/Math.tan(Math.PI*47/360),near=.5,far=3000;return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0])}
async function fetchWithTimeout(path){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);try{return await fetch(path,{signal:controller.signal})}finally{clearTimeout(timer)}}
async function load(){
 const r=await fetchWithTimeout('./assets/eiffel_404.glb');if(!r.ok)throw Error('GLB: '+r.status);const b=await r.arrayBuffer(),dv=new DataView(b);if(dv.getUint32(0,true)!==0x46546c67||dv.getUint32(4,true)!==2)throw Error('GLB inválido');const n=dv.getUint32(12,true),j=JSON.parse(new TextDecoder().decode(new Uint8Array(b,20,n)));const bin=20+n+8,pr=j.meshes[0].primitives[0];
 function accessor(id){const a=j.accessors[id],v=j.bufferViews[a.bufferView],base=bin+(v.byteOffset||0)+(a.byteOffset||0),count=a.count*(a.type==='VEC4'?4:a.type==='VEC3'?3:1);if(a.componentType===5126)return new Float32Array(b,base,count);if(a.componentType===5121)return new Uint8Array(b,base,count);if(a.componentType===5125)return new Uint32Array(b,base,count);throw Error('Atributo GLB no compatible')}
 const pos=accessor(pr.attributes.POSITION),col=accessor(pr.attributes.COLOR_0),idx=accessor(pr.indices);if(!pos.length||!idx.length)throw Error('GLB vacío');
 // WebGL1 does not universally support 32-bit element arrays: expand indexed geometry once.
 const verts=new Float32Array(idx.length*3),rgba=new Uint8Array(idx.length*4);for(let i=0;i<idx.length;i++){const k=idx[i];verts.set(pos.subarray(k*3,k*3+3),i*3);rgba.set(col.subarray(k*4,k*4+4),i*4)}vertexCount=idx.length;
 function attribute(name,array,components,kind,normalized=false){const loc=gl.getAttribLocation(prog,name),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,components,kind,normalized,0,0)}
 attribute('aPos',verts,3,gl.FLOAT);attribute('aColor',rgba,4,gl.UNSIGNED_BYTE,true); // restore both bindings each frame using VAO-equivalent manual setup below
 positions=verts;colors=rgba;
 const pbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pbuf);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW);const cbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,cbuf);gl.bufferData(gl.ARRAY_BUFFER,colors,gl.STATIC_DRAW);indices={pbuf,cbuf};
}
async function loadEnvironment(name){
 const response=await fetchWithTimeout('./assets/'+name+'.glb');if(!response.ok)throw Error(name+': HTTP '+response.status);
 const b=await response.arrayBuffer(),dv=new DataView(b),n=dv.getUint32(12,true);if(dv.getUint32(0,true)!==0x46546c67)throw Error('GLB incorrecto');
 const j=JSON.parse(new TextDecoder().decode(new Uint8Array(b,20,n)));const bin=20+n+8,pr=j.meshes[0].primitives[0];
 function acc(id){const a=j.accessors[id],v=j.bufferViews[a.bufferView],off=bin+(v.byteOffset||0)+(a.byteOffset||0),total=a.count*(a.type==='VEC4'?4:a.type==='VEC3'?3:1);return new (a.componentType===5126?Float32Array:a.componentType===5121?Uint8Array:Uint32Array)(b,off,total)}
 const p=acc(pr.attributes.POSITION),c=acc(pr.attributes.COLOR_0),i=acc(pr.indices);const verts=new Float32Array(i.length*3),rgba=new Uint8Array(i.length*4);
 for(let k=0;k<i.length;k++){verts.set(p.subarray(i[k]*3,i[k]*3+3),k*3);rgba.set(c.subarray(i[k]*4,i[k]*4+4),k*4)}
 const pbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pbuf);gl.bufferData(gl.ARRAY_BUFFER,verts,gl.STATIC_DRAW);
 const cbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,cbuf);gl.bufferData(gl.ARRAY_BUFFER,rgba,gl.STATIC_DRAW);
 return {pbuf,cbuf,count:i.length};
}

// Small physical cabin, modeled as a lightweight open-frame box next to an interior lift guide.
function buildCabin(){
 const verts=[],rgba=[];const bronze=[220,166,89,255],dark=[53,65,71,255];
 function triangle(a,b,c,col){for(const v of [a,b,c]){verts.push(...v);rgba.push(...col)}}
 function box(x,y,z,w,h,d,col){const q=[[x-w/2,y-h/2,z-d/2],[x+w/2,y-h/2,z-d/2],[x+w/2,y+h/2,z-d/2],[x-w/2,y+h/2,z-d/2],[x-w/2,y-h/2,z+d/2],[x+w/2,y-h/2,z+d/2],[x+w/2,y+h/2,z+d/2],[x-w/2,y+h/2,z+d/2]];for(const f of [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]]){triangle(q[f[0]],q[f[1]],q[f[2]],col);triangle(q[f[0]],q[f[2]],q[f[3]],col)}}
 box(0,0,0,5,.55,5,dark);box(0,6.3,0,5,.5,5,dark);
 for(const x of [-2.2,2.2])for(const z of [-2.2,2.2])box(x,3.2,z,.32,6.2,.32,bronze);
 for(const z of [-2.2,2.2])box(0,3.3,z,5,.16,.17,bronze);
 const create=(a)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,a,gl.STATIC_DRAW);return b};
 return {pbuf:create(new Float32Array(verts)),cbuf:create(new Uint8Array(rgba)),count:verts.length/3};
}
function statusRide(label,progress=0){$('rideLabel').textContent=label;$('rideProgress').style.width=(Math.max(0,Math.min(1,progress))*100).toFixed(1)+'%'}
function highlightRide(id){for(const key of ['liftBtn','walkBtn','guidedBtn'])$(key).classList.toggle('active',key===id)}
function cancelRide(){animation=null;state.auto=false;$('spinBtn').classList.remove('active');highlightRide(null);statusRide('EXPLORACIÓN LIBRE',0)}
function ease(t){return t*t*(3-2*t)}
function interpolate(a,b,t){return a+(b-a)*ease(t)}
function animate(kind){cancelRide();const now=performance.now();if(kind==='lift'){
 // Route starts from the current camera position, without an initial jump.
 const start={focus:state.focus,dist:state.dist,yaw:state.yaw,pitch:state.pitch};
 animation={kind,start,time:now,duration:20000};highlightRide('liftBtn');statusRide('ASCENSOR · INICIANDO',0);
 }else if(kind==='walk'){
 const h=[135,57,115,276][rideSelected];animation={kind,start:{focus:state.focus,dist:state.dist,yaw:state.yaw,pitch:state.pitch},height:h,time:now,duration:13000};highlightRide('walkBtn');statusRide('MIRADOR · PLATAFORMA '+rideSelected,0);
 }else{
 animation={kind,start:{focus:state.focus,dist:state.dist,yaw:state.yaw,pitch:state.pitch},time:now,duration:35000};highlightRide('guidedBtn');statusRide('VISITA GUIADA · COMENZANDO',0);
 }}
function animateFrame(now){if(!animation)return;const a=animation,p=Math.min(1,(now-a.time)/a.duration),u=ease(p);
 if(a.kind==='lift'){
 const heights=[0,57,115,276],segments=[0,.24,.52,1];let i=0;while(i<2&&p>segments[i+1])i++;
 const k=ease(Math.min(1,(p-segments[i])/(segments[i+1]-segments[i])));
 cabinHeight=heights[i]+(heights[i+1]-heights[i])*k;
 const h=interpolate(a.start.focus,cabinHeight+3,Math.min(1,p*8));
 state.focus=h;state.dist=interpolate(a.start.dist,94,Math.min(1,p*5));state.pitch=interpolate(a.start.pitch,.17,Math.min(1,p*5));state.yaw=a.start.yaw+p*.34;
 statusRide('ASCENSOR · '+Math.round(cabinHeight)+' M',p);
 }else if(a.kind==='walk'){
 state.focus=interpolate(a.start.focus,a.height,Math.min(1,p*4));state.dist=interpolate(a.start.dist,47,Math.min(1,p*4));state.pitch=interpolate(a.start.pitch,.06,Math.min(1,p*4));state.yaw=a.start.yaw+p*Math.PI*1.2;
 statusRide('MIRADOR · '+Math.round(a.height)+' M',p);
 }else{
 const heights=[0,57,115,276,115],times=[0,.20,.47,.75,1];let i=0;while(i<3&&p>times[i+1])i++;
 const t=ease(Math.min(1,(p-times[i])/(times[i+1]-times[i])));
 const target=heights[i]+(heights[i+1]-heights[i])*t;
 state.focus=interpolate(a.start.focus,target,Math.min(1,p*8));state.dist=interpolate(a.start.dist,95,Math.min(1,p*7));state.pitch=interpolate(a.start.pitch,.15,Math.min(1,p*6));state.yaw=a.start.yaw+p*5.3;
 statusRide('VISITA GUIADA · '+Math.round(target)+' M',p);
 }
 $('altitude').textContent=String(Math.round(Math.max(0,a.kind==='walk'?a.height:state.focus))).padStart(3,'0')+' M';
 if(p>=1){if(a.kind==='lift')rideSelected=3;cancelRide();statusRide('RECORRIDO COMPLETADO',1)}
}

function drawMesh(mesh){let loc=gl.getAttribLocation(prog,'aPos');gl.bindBuffer(gl.ARRAY_BUFFER,mesh.pbuf);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc);loc=gl.getAttribLocation(prog,'aColor');gl.bindBuffer(gl.ARRAY_BUFFER,mesh.cbuf);gl.vertexAttribPointer(loc,4,gl.UNSIGNED_BYTE,true,0,0);gl.enableVertexAttribArray(loc);gl.drawArrays(gl.TRIANGLES,0,mesh.count)}
function draw(t){if(!gl||gl.isContextLost()){activateFallback('WebGL interrumpido');return;}const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight),dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.floor(w*dpr)||canvas.height!==Math.floor(h*dpr)){canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);gl.viewport(0,0,canvas.width,canvas.height)}
 if(state.auto)state.yaw+=.0035;animateFrame(t);const sky=state.night?[.018,.033,.07]:state.sunset?[.52,.27,.28]:[.34,.52,.64];gl.clearColor(...sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.uniform1f(gl.getUniformLocation(prog,'uSunset'),state.sunset?1:0);gl.uniform1f(gl.getUniformLocation(prog,'uFog'),state.fog?1:0);gl.uniform1f(gl.getUniformLocation(prog,'uSparkle'),state.sparks?1:0);gl.uniform1f(gl.getUniformLocation(prog,'uTime'),t*.001);gl.uniform1f(gl.getUniformLocation(prog,'uExposure'),state.exposure);gl.uniform3f(gl.getUniformLocation(prog,'uSky'),...sky);
 const cp=Math.cos(state.pitch),eye=[Math.sin(state.yaw)*cp*state.dist,state.focus+Math.sin(state.pitch)*state.dist,Math.cos(state.yaw)*cp*state.dist];const mvp=matMul(projection(w/h),lookAt(eye,[0,state.focus,0]));gl.uniformMatrix4fv(gl.getUniformLocation(prog,'uMVP'),false,mvp);gl.uniform1f(gl.getUniformLocation(prog,'uNight'),state.night?1:0);
 gl.uniform3f(gl.getUniformLocation(prog,'uOffset'),0,0,0);gl.uniform1f(gl.getUniformLocation(prog,'uEnvironment'),1);if(visibleCity)drawMesh(environment.city);if(visibleParks)drawMesh(environment.parks);gl.uniform1f(gl.getUniformLocation(prog,'uEnvironment'),0);drawMesh({pbuf:indices.pbuf,cbuf:indices.cbuf,count:vertexCount});if(cabin){gl.uniform3f(gl.getUniformLocation(prog,'uOffset'),11,cabinHeight,11);drawMesh(cabin);gl.uniform3f(gl.getUniformLocation(prog,'uOffset'),0,0,0)}raf=requestAnimationFrame(frameSafe);
}
function frameSafe(t){try{draw(t)}catch(e){console.error('Fallo de renderizado:',e);activateFallback('Error de renderizado')}}
function level(n){cancelRide();rideSelected=n===0?3:n;let h=[135,57,115,276][n];state.focus=h;state.dist=[560,185,160,115][n];document.querySelectorAll('[data-level]').forEach(b=>b.classList.toggle('active',+b.dataset.level===n));$('altitude').textContent=String([0,57,115,276][n]).padStart(3,'0')+' M'}
function theme(mode){state.night=mode==='night';state.sunset=mode==='sunset';document.querySelector('.app').classList.toggle('light',mode!=='night');for(const [id,m] of [['dayBtn','day'],['nightBtn','night'],['sunsetBtn','sunset']])$(id).classList.toggle('active',mode===m)}
function togglePhoto(force){state.photo=typeof force==='boolean'?force:!state.photo;document.querySelector('.app').classList.toggle('photo-mode',state.photo);$('photoModeBtn').setAttribute('aria-pressed',String(state.photo));$('photoToolbar').hidden=!state.photo}
function savePhoto(){try{const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='EIFFEL-404-STUDIO.png';a.click()}catch(error){console.error('Captura PNG:',error);message('No se pudo guardar la captura')}}
function setPremium(id,key){state[key]=!state[key];$(id).classList.toggle('active',state[key]);$(id).setAttribute('aria-pressed',String(state[key]))}
function resetPremium(){state.fog=false;state.sparks=false;state.exposure=1.25;state.cinema=false;for(const id of ['fogBtn','sparkBtn','cinemaBtn']){$(id).classList.remove('active');$(id).setAttribute('aria-pressed','false')}$('exposureSlider').value='1.25';$('exposureValue').textContent='1.25';document.querySelector('.app').classList.remove('cinema');togglePhoto(false)}
function attach(){markUnavailable();put('liftBtn',()=>animate('lift'));put('walkBtn',()=>animate('walk'));put('guidedBtn',()=>animate('guided'));put('stopBtn',cancelRide);put('cityBtn',()=>{visibleCity=!visibleCity;$('cityBtn').classList.toggle('active',visibleCity)});put('parksBtn',()=>{visibleParks=!visibleParks;$('parksBtn').classList.toggle('active',visibleParks)});document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>level(+b.dataset.level)));put('dayBtn',()=>theme('day'));put('nightBtn',()=>theme('night'));put('sunsetBtn',()=>theme('sunset'));put('fogBtn',()=>setPremium('fogBtn','fog'));put('sparkBtn',()=>setPremium('sparkBtn','sparks'));put('cinemaBtn',()=>{setPremium('cinemaBtn','cinema');document.querySelector('.app').classList.toggle('cinema',state.cinema)});
 $('exposureSlider').addEventListener('input',e=>{state.exposure=Math.max(.6,Math.min(2.2,Number(e.target.value)||1.25));$('exposureValue').textContent=state.exposure.toFixed(2)});
 put('photoModeBtn',()=>togglePhoto());put('photoExitBtn',()=>togglePhoto(false));put('photoSaveBtn',savePhoto);put('spinBtn',()=>{state.auto=!state.auto;$('spinBtn').classList.toggle('active',state.auto)});put('resetBtn',()=>{cancelRide();cabinHeight=0;state.yaw=-.55;state.pitch=.19;state.auto=false;$('spinBtn').classList.remove('active');theme('day');resetPremium();level(0);visibleCity=true;visibleParks=true;$('cityBtn').classList.add('active');$('parksBtn').classList.add('active')});put('exploreBtn',()=>level(1));put('tourBtn',()=>animate('guided'));put('photoBtn',savePhoto);put('fullBtn',()=>{if(document.fullscreenElement)document.exitFullscreen();else document.querySelector('.app').requestFullscreen?.()});
 const modal=$('helpModal');put('helpBtn',()=>{modal.hidden=false});put('closeHelp',()=>{modal.hidden=true});put('modalStart',()=>{modal.hidden=true});modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});document.addEventListener('keydown',e=>{if(e.key==='Escape'){modal.hidden=true;togglePhoto(false)}if('1234'.includes(e.key))level(+e.key-1);if(e.key==='d')theme('day');if(e.key==='n')theme('night')});
 canvas.addEventListener('pointerdown',e=>{cancelRide();drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;state.yaw+=(e.clientX-px)*.007;state.pitch=Math.max(-.8,Math.min(1.1,state.pitch+(e.clientY-py)*.003));px=e.clientX;py=e.clientY});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);canvas.addEventListener('wheel',e=>{e.preventDefault();state.dist=Math.min(1300,Math.max(35,state.dist*(e.deltaY>0?1.09:.91)))},{passive:false});
 let pinch=0;canvas.addEventListener('touchmove',e=>{if(e.touches.length!==2)return;let d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch)state.dist=Math.max(35,Math.min(1300,state.dist*pinch/d));pinch=d},{passive:true});canvas.addEventListener('touchend',()=>pinch=0);
}
try{
 message('Cargando modelos 3D locales…');canvas=document.createElement('canvas');canvas.id='webgl-scene';canvas.setAttribute('aria-label','Torre Eiffel: modelo GLB 3D local');old.after(canvas);gl=canvas.getContext('webgl',{antialias:true,preserveDrawingBuffer:true})||canvas.getContext('experimental-webgl');if(!gl)throw Error('WebGL no disponible');setup();await load();environment.city=await loadEnvironment('paris_city');environment.parks=await loadEnvironment('paris_parks');cabin=buildCabin();gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);old.style.display='none';attach();theme('day');level(0);message('3D WEBGL LOCAL · PARÍS 3D · VISITA INMERSIVA');statusRide('EXPLORACIÓN LIBRE',0);toggle.textContent='MODO COMPATIBLE';toggle.onclick=()=>{const p=new URLSearchParams(location.search);p.set('engine','canvas');location.search=p.toString()};canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();activateFallback('Contexto WebGL perdido');});raf=requestAnimationFrame(frameSafe);
}
catch(err){console.error('WebGL local:',err);activateFallback('WebGL no disponible')}
})();
