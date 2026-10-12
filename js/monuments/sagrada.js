// Recreación artística procedural inspirada en la Sagrada Família; no es una réplica arquitectónica.
export function sagrada(){
 const faces=[];const add=(vertices,color)=>faces.push({vertices,color});
 const sand=[.71,.59,.46],stone=[.58,.47,.37],shadow=[.36,.32,.31],cream=[.84,.76,.63],tile=[.15,.52,.49],gold=[.82,.64,.28],garden=[.25,.36,.30],walk=[.53,.46,.39];
 function box(x,y,z,w,h,d,c){let a=x-w/2,b=x+w/2,f=z-d/2,g=z+d/2,v=[[a,y,f],[b,y,f],[b,y+h,f],[a,y+h,f],[a,y,g],[b,y,g],[b,y+h,g],[a,y+h,g]];for(const ids of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])add(ids.map(i=>v[i]),c)}
 function ring(x,y,z,r1,r2,h,segments,c){for(let i=0;i<segments;i++){let a=i*2*Math.PI/segments,b=(i+1)*2*Math.PI/segments;let p=(r,t)=>[x+Math.cos(t)*r,y,z+Math.sin(t)*r];add([p(r1,a),p(r1,b),[x+Math.cos(b)*r2,y+h,z+Math.sin(b)*r2],[x+Math.cos(a)*r2,y+h,z+Math.sin(a)*r2]],c)}}
 function spire(x,z,h,r=3.4){
  box(x,0,z,r*2,7,r*2,stone);
  for(let level=0;level<10;level++){let t=level/10,y=7+level*(h-9)/10,rad=r*(1-.68*t);ring(x,y,z,rad,rad*.91,(h-9)/10,10,level%3===0?cream:sand);if(level%2===0)ring(x,y+.2,z,rad*1.10,rad*1.08,.7,10,shadow)}
  ring(x,h-2,z,r*.35,.35,2,10,tile);ring(x,h,z,.5,0,2.7,8,gold);
  // Vertical sculptural ribs enhance scale and silhouette.
  for(let k=0;k<8;k++){const a=k*Math.PI/4;for(let j=0;j<6;j++){let t=j/6,rr=r*(1-.68*t)+.06;box(x+Math.cos(a)*rr,7+t*(h-9),z+Math.sin(a)*rr,.25,3,.25,cream)}}
 }
 // Ground and pedestrian plaza.
 box(0,-2,0,190,.6,160,garden);box(0,-1.37,11,74,.30,110,walk);
 for(let i=0;i<14;i++){let z=-61+i*9;box(-69,-1.35,z,16,.07,4,garden);box(69,-1.35,z,16,.07,4,garden)}
 // Long basilica mass, transept and roof ridge.
 box(0,0,0,40,21,68,sand);box(0,0,0,62,19,22,stone);
 box(0,21,0,36,3,65,shadow);box(0,24,0,12,5,64,cream);
 for(let z=-26;z<=26;z+=8){box(-21,0,z,3.5,16,4.7,cream);box(21,0,z,3.5,16,4.7,cream);box(-20,12,z,1,5,2,tile);box(20,12,z,1,5,2,tile)}
 // Side buttresses break the long nave wall into the strong vertical rhythm of a basilica.
 for(const side of [-1,1])for(let z=-27;z<=27;z+=9){
  const x=side*22.4;
  add([[x-side*2,0,z-1.5],[x+side*2.6,0,z-1.5],[x,19,z-1.5]],stone);
  box(x,18,z,4.6,1.0,4.3,cream);
 }
 // Pointed façades and recessed portals, viewed from the front (positive Z).
 box(0,0,36,51,24,7,stone);
 for(let x of [-15,0,15]){box(x,0,40,8,16,1.3,shadow);box(x,13,40.5,10,3,1.8,cream);ring(x,17,40.2,5,0,6,9,sand)}
 for(let y of [7,15,22])for(let x of [-20,-10,0,10,20]){box(x,y,40.1,1,2.8,1.4,cream)}
 // Front and rear towers, rising organically with different heights.
 for(let [x,z,h,r] of [[-24,33,56,3.6],[-9,34,69,3.9],[9,34,66,3.9],[24,33,55,3.6],[-24,-32,65,3.8],[-9,-33,78,3.9],[9,-33,74,3.9],[24,-32,64,3.8]])spire(x,z,h,r);
 // Tall central towers symbolically represent the skyline, not exact count or construction state.
 spire(0,-4,99,5.3);for(let [x,z] of [[-17,-7],[17,-7],[-17,10],[17,10]])spire(x,z,58,2.9);
 // Sculptural finials above the smaller facade pinnacles.
 for(const x of [-24,-9,9,24])for(const z of [-32,33]){
  const height=x===-9||x===9?3.2:2.5;
  ring(x,56,z,.92,.18,height,9,gold);
 }
 // Stained glass window accents.
 for(let z=-23;z<=23;z+=10)for(let x of [-19.8,19.8])for(let y of [6,11])box(x,y,z,1.4,2.8,2.8,(z+y)%3===0?tile:gold);
 // Steps and rows of small sculptural pinnacles.
 for(let i=0;i<8;i++)box(0,-1.3+i*.2,48-i*1.1,34-i*.8,.2,1.2,cream);
 for(let i=0;i<16;i++){let x=-28+i*3.7;box(x,25,38,.75,2,.75,i%2?cream:gold)}
 // Symmetric stylized trees on the plaza.
 for(let x of [-49,49])for(let z of [-40,-20,0,20,40]){box(x,-1.3,z,1.3,6,1.3,shadow);ring(x,4.5,z,5,2,7,7,garden)}

 // Fase 18: ritmo de filigranas y mosaicos abstractos en la fachada frontal.
 for(let k=0;k<34;k++){
  const a=k*Math.PI*2/34,x=Math.cos(a)*7,y=20+Math.sin(a)*7;
  box(x,y,40.85,.38,.38,.18,k%3===0?tile:k%2?gold:cream);
 }
 for(const side of [-1,1])for(let k=0;k<12;k++){
  const z=-26+k*4.5;
  box(side*20.35,16,z,1,.36,1.05,k%3===0?tile:cream);
 }
 for(let i=0;i<22;i++)box(-27+i*2.6,25.4,39.0,.65,.8,.8,i%3===0?gold:cream);
 return faces;
}
