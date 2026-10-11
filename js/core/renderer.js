// Native WebGL renderer, no network dependencies. One independent canvas per scene.
export function createRenderer(canvas,faces){const gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});if(!gl)throw Error('WebGL no disponible');
const vertex=`attribute vec3 position;attribute vec3 color;varying vec3 vColor;varying float vDistance;varying vec3 vWorld;uniform mat4 matrix;uniform float light;void main(){gl_Position=matrix*vec4(position,1.);vColor=color*light;vWorld=position;vDistance=length(position.xz);}`;
const fragment=`precision mediump float;
varying vec3 vColor;varying float vDistance;varying vec3 vWorld;
uniform vec3 uSky;uniform float uClock;uniform float uNight;
float hash(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
void main(){
 vec3 col=vColor;
 // Deterministic procedural micro-texture gives stone and earth visual depth.
 float grain=hash(floor(vWorld*8.0));
 float broad=sin(vWorld.x*.57+vWorld.z*.33)*sin(vWorld.y*.85+vWorld.z*.19);
 float water=step(.38,col.b-col.r)*step(.44,col.b);
 float shimmer=sin(vWorld.z*4.8+uClock*1.4+vWorld.x*3.4)*.034;
 col+=water*shimmer;
 col*=1.0+(.5-water)*((grain-.5)*.086+broad*.034);
 // Diffuse atmospheric haze increases with distance and avoids harsh edges.
 float fog=clamp((vDistance-22.0)/118.0,0.0,.28);
 col=mix(col,uSky,fog);
 float nightAccent=uNight*max(0.0,sin(vWorld.y*8.0+vWorld.z))*.013;
 col+=nightAccent;
 col=clamp(col,0.0,1.0);
 // Soft highlight rolloff; intentionally not claimed as physically based rendering.
 col=col*(1.055-.055*col);
 gl_FragColor=vec4(col,1.0);
}`;
function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const p=[],c=[];function tri(a,b,d,col){p.push(...a,...b,...d);for(let j=0;j<3;j++)c.push(...col)}for(const f of faces){for(let k=1;k<f.vertices.length-1;k++){
const a=f.vertices[0],b=f.vertices[k],d=f.vertices[k+1],u=b.map((v,i)=>v-a[i]),v=d.map((q,i)=>q-a[i]);
const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
const mag=Math.hypot(...n)||1;const directional=Math.max(.32,Math.min(1.05,.68+.32*(n[0]*-.55+n[1]*.8+n[2]*.45)/mag));
tri(a,b,d,f.color.map(q=>Math.min(1,q*directional)))}}
function buffer(data,attribute){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,attribute);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0)}buffer(p,'position');buffer(c,'color'); // rebind both attributes: WebGL attribute pointers retain their buffers.
gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);const matloc=gl.getUniformLocation(program,'matrix'), lightloc=gl.getUniformLocation(program,'light'),skyloc=gl.getUniformLocation(program,'uSky'),clockloc=gl.getUniformLocation(program,'uClock'),nightloc=gl.getUniformLocation(program,'uNight');
function mul(a,b){let out=Array(16).fill(0);for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)out[j*4+i]+=a[k*4+i]*b[j*4+k];return out}
function lookAt(eye,target){const norm=v=>{const l=Math.hypot(...v);return v.map(x=>x/l)};const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];const z=norm(eye.map((v,i)=>v-target[i]));const x=norm(cross([0,1,0],z));const y=cross(z,x);return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1]}
function projection(aspect){const near=.1,far=180,f=1/Math.tan(Math.PI/6);return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]}
let previousPalette=null,lastDraw=0;
function draw({yaw,pitch,zoom,sky,light,night=0}){
 const setting=window.__wondersQuality||'media';
 const dprLimit=setting==='baja'?1:setting==='alta'?2:1.45;
 const dpr=Math.min(window.devicePixelRatio||1,dprLimit);
 const w=Math.max(1,Math.floor(canvas.clientWidth*dpr)),h=Math.max(1,Math.floor(canvas.clientHeight*dpr));
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
 const now=performance.now();const dt=lastDraw?Math.min(0.1,(now-lastDraw)/1000):1;lastDraw=now;
 const requested=[...sky,light,night];
 if(!previousPalette)previousPalette=requested.slice();
 const blend=Math.min(1,dt*2.1);
 previousPalette=previousPalette.map((value,index)=>value+(requested[index]-value)*blend);
 const skyNow=previousPalette.slice(0,3);
 gl.clearColor(...skyNow,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const eye=[Math.sin(yaw)*Math.cos(pitch)*zoom,5+Math.sin(pitch)*zoom,Math.cos(yaw)*Math.cos(pitch)*zoom];
 gl.uniformMatrix4fv(matloc,false,new Float32Array(mul(projection(w/h),lookAt(eye,[0,5,1]))));
 gl.uniform1f(lightloc,previousPalette[3]);gl.uniform3fv(skyloc,new Float32Array(skyNow));
 gl.uniform1f(clockloc,now*.001);gl.uniform1f(nightloc,previousPalette[4]);
 gl.drawArrays(gl.TRIANGLES,0,p.length/3);
}
return {draw}}
