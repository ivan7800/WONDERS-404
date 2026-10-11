// Art-directed, simplified procedural model. Units are illustrative rather than surveyed.
export function tajMahal(){const faces=[];
function face(vertices,color){faces.push({vertices,color})}
function box(x,y,z,w,h,d,color){const a=x-w/2,b=x+w/2,c=y,e=y+h,f=z-d/2,g=z+d/2;const v=[[a,c,f],[b,c,f],[b,e,f],[a,e,f],[a,c,g],[b,c,g],[b,e,g],[a,e,g]];for(const q of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])face(q.map(i=>v[i]),color)}
function cylinder(x,y,z,r,h,col,segments=16){for(let i=0;i<segments;i++){let a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;face([[x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],[x+Math.cos(b)*r,y+h,z+Math.sin(b)*r],[x+Math.cos(a)*r,y+h,z+Math.sin(a)*r]],col)}}
function dome(x,y,z,r,height,col,segments=24,rings=10){for(let j=0;j<rings;j++){const t=j/rings,u=(j+1)/rings;const rr=r*Math.pow(Math.cos(t*Math.PI/2),.7),ss=r*Math.pow(Math.cos(u*Math.PI/2),.7);for(let i=0;i<segments;i++){const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;face([[x+rr*Math.cos(a),y+height*t,z+rr*Math.sin(a)],[x+rr*Math.cos(b),y+height*t,z+rr*Math.sin(b)],[x+ss*Math.cos(b),y+height*u,z+ss*Math.sin(b)],[x+ss*Math.cos(a),y+height*u,z+ss*Math.sin(a)]],col)}}}
// garden, raised marble plinth, four facade piers and arch-inspired recesses
box(0,-.35,0,58,.3,54,[.30,.39,.29]);box(0,0,0,23,.9,23,[.67,.66,.62]);box(0,.9,0,15,7.5,13,[.83,.82,.76]);box(0,8.4,0,16,.55,14,[.72,.71,.67]);
for(const x of [-6.2,6.2])for(const z of [-5.3,5.3]){box(x,.9,z,2.5,8.0,2.5,[.87,.84,.79]);box(x,9,z,2.85,.4,2.85,[.70,.67,.64]);dome(x,9.4,z,1.3,2.1,[.88,.87,.83]);cylinder(x,11.5,z,.08,.7,[.63,.49,.27],8)}
// prominent dark arched niches: geometric approximations, not historically precise openings.
for(const z of [-6.55,6.55]){box(0,1.25,z,3.8,5.8,.08,[.24,.27,.29]);box(0,6.8,z,4.6,.65,.14,[.77,.71,.67])}
for(const x of [-7.55,7.55]){box(x,1.5,0,.1,5.7,3.5,[.27,.30,.31])}
cylinder(0,8.95,0,5.6,1.0,[.73,.72,.68],32);dome(0,9.9,0,5.2,6.7,[.94,.91,.84],32,12);cylinder(0,16.6,0,.25,1.0,[.75,.58,.27]);
for(const x of [-10,10])for(const z of [-10,10]){cylinder(x,.9,z,.9,10.4,[.85,.82,.76],20);for(const level of [3.4,6.9,10.5])cylinder(x,level,z,1.18,.26,[.68,.65,.60],20);dome(x,11.3,z,1.2,2.1,[.87,.86,.81],20);cylinder(x,13.4,z,.08,.7,[.60,.47,.23],8)}
// Pointed-arch silhouettes, marble inlays, and recessed portal layers.
const ivory=[.95,.9,.81], sandstone=[.72,.53,.43], deep=[.11,.16,.19];
function archFront(cx,y,z,w,h,col){const a=w/2;face([[cx-a,y,z],[cx+a,y,z],[cx+a,y+h*.69,z],[cx,y+h,z],[cx-a,y+h*.69,z]],col)}
for(const z of [-6.68,6.68]){
 archFront(0,1.3,z,3.45,6,deep);
 for(const x of [-4.8,4.8]){archFront(x,1.5,z,1.28,3.35,[.38,.34,.33]);box(x,5,z,1.65,.18,.09,sandstone)}
 for(const x of [-2.4,2.4]){box(x,1.3,z,.13,5.8,.12,sandstone)}
 box(0,7.8,z,6,.13,.14,sandstone);
}
for(const x of [-7.67,7.67]){archFront(x,1.5,0,3.15,5.8,deep)}
// Inlay stripes, stacked plinth edge and central stair.
box(0,.8,0,23,.10,23,ivory);
for(let i=0;i<5;i++)box(0,.02+i*.12,11.8+i*.5,5,.12,.55,[.76+i*.012,.73+i*.012,.69+i*.012]);
for(const z of [-6.9,6.9])for(const x of [-5.2,5.2])box(x,1.1,z,1.5,.11,.12,sandstone);
// Reflection pool and walkway: stylized garden layout
box(0,-.03,18,4,.055,24,[.22,.43,.51]);box(-7,-.01,18,1.2,.04,25,[.74,.69,.57]);box(7,-.01,18,1.2,.04,25,[.74,.69,.57]);
// Charbagh-inspired formal channels, walkways, cypress shapes and fountains.
for(const side of [-1,1]){
 const xx=side*16;
 box(xx,-.012,17,14,.025,26,[.27,.38,.26]);
 box(xx,-.002,17,1,.03,26,[.67,.60,.49]);
 for(let i=0;i<7;i++){
  const z=5+i*3.9;
  cylinder(side*19,-.02,z,.55,1,[.38,.30,.22],8);
  for(let j=0;j<3;j++){const rr=1.2-j*.3;dome(side*19,.85+j*.85,z,rr,1.15,[.15+j*.014,.27+j*.018,.19],10,4)}
 }
}
for(let i=0;i<13;i++){
 const z=6+i*1.9;box(0,.002,z,3.65,.013,.07,[.30+i%3*.016,.57,.66]);
}
for(let i=0;i<5;i++){const z=8+i*5.2;cylinder(0,.01,z,.21,.045,[.76,.82,.85],12)}
// Phase 5: architectural relief, marble banding, garden geometry and water surface.
// Every polygon is authored locally; no textures, downloads or external scripts.
const marble=[.88,.87,.82], shadowMarble=[.67,.69,.68], inlay=[.39,.34,.32], gold=[.74,.59,.32];
// Tall facade panel outlines and recessed windows, symmetrically repeated.
for(const side of [-1,1]){
 for(const z of [-6.81,6.81]){
  for(const x of [2.8,4.4,5.7].map(v=>v*side)){
   box(x,2.0,z,.085,3.35,.085,inlay);
   box(x,5.35,z,.36,.095,.09,gold);
  }
  for(const x of [3.6,5.2].map(v=>v*side)){
   box(x,5.65,z,.5,.78,.10,shadowMarble);
   box(x,5.80,z,.3,.46,.11,[.28,.30,.31]);
  }
 }
 // Minaret gallery dark window rings and slender marble stripes.
 for(const z of [-10,10]){
  for(const level of [2.3,5.7,9.15]){
   cylinder(side*10,level,z,.96,.11,inlay,20);
   cylinder(side*10,level+.14,z,1.01,.08,marble,20);
  }
  // tapering cap below the cupola
  cylinder(side*10,10.77,z,1.30,.26,marble,20);
 }
}
// Raised pool edges with small pale coping blocks and regularly spaced fountain jets.
for(const xx of [-2.05,2.05]){
 box(xx,.012,18,.23,.15,24.5,[.76,.74,.67]);
 for(let i=0;i<12;i++)box(xx,.17,6.5+i*2,.27,.055,.45,marble);
}
for(let i=0;i<8;i++){
 const z=7+i*3.1;
 cylinder(0,.01,z,.12,.18,[.67,.82,.89],10);
 cylinder(0,.18,z,.038,.30,[.77,.88,.94],8);
}
// Fine segmented water strips are shaded dynamically in the WebGL shader.
for(let i=0;i<80;i++){
 const z=5.7+i*.30;
 const x=Math.sin(i*2.399)*1.52;
 box(x,.042,z,.48,.008,.042,[.34+(i%5)*.018,.57,.67]);
}
// Alternating garden flower beds, paths, and shrubs for depth and scale.
for(const side of [-1,1]){
 for(let row=0;row<5;row++){
  for(let col=0;col<3;col++){
   const z=6+row*5.15, x=side*(10.9+col*2.6);
   box(x,-.004,z,2.0,.038,3.2,[.29,.34+((row+col)%3)*.015,.22]);
   for(let q=0;q<4;q++){
    const colr=q%2?[.66,.34,.37]:[.85,.72,.48];
    dome(x+(q%2?-.4:.4),.04,z+(q-1.5)*.68,.23,.23,colr,7,3);
   }
  }
 }
 for(const z of [2,9,16,23,30]){
  cylinder(side*23,.02,z,.28,.7,[.46,.38,.28],8);
  dome(side*23,.7,z,1.25,2.05,[.19,.35,.25],12,5);
 }
}
// Layered octagonal base supporting the great central dome.
for(let i=0;i<3;i++)cylinder(0,9.1+i*.23,0,5.7-i*.16,.12,i%2?marble:shadowMarble,32);
// Gold finial is a stylized silhouette, not an exact survey.
cylinder(0,17.55,0,.12,.6,gold,12);
dome(0,18.1,0,.37,.52,gold,12,5);
// Fase 13: ornamentación de fachada y jardines con detalle geométrico de bajo coste.
const darkInlay=[.37,.36,.35], pearl=[.92,.90,.84], terracotta=[.59,.36,.32];
for(const z of [-6.83,6.83]){
 for(const sign of [-1,1]){
  for(let k=0;k<9;k++){
   const x=sign*(3.05+k*.34), yy=2.15+(k%3)*.25;
   box(x,yy,z,.12,.68,.045,k%2?darkInlay:terracotta);
  }
  for(let k=0;k<8;k++){
   const x=sign*(3.18+k*.39);
   box(x,7.13,z,.17,.17,.055,k%2?pearl:terracotta);
  }
 }
}
// Thin horizontal marble bands create a more legible silhouette against the sky.
for(const yy of [1.65,3.75,6.55,8.38])for(const z of [-6.9,6.9]){
 box(0,yy,z,12.4,.075,.11,yy>8?pearl:darkInlay);
}
// Garden paths and patterned planting beds; deterministic to avoid noisy flicker.
for(const side of [-1,1])for(let row=0;row<8;row++){
 const z=5.2+row*3.25;
 box(side*14.9,.045,z,6.8,.028,.10,[.70,.63,.48]);
 for(let k=0;k<4;k++){
  const xx=side*(11.5+k*1.65);
  dome(xx,.07,z+.47,.34,.38,k%2?[.28,.42,.24]:[.42,.51,.26],9,3);
 }
}
// Fountain highlights and reflecting-pool edge sparkle.
for(let i=0;i<44;i++){
 const z=6+(i*0.59), x=Math.sin(i*1.73)*1.62;
 box(x,.056,z,.20,.007,.045,i%3?[.49,.70,.75]:[.73,.80,.76]);
}
// Background courtyard plane without remote assets.
box(0,-.42,0,105,.07,100,[.34,.33,.28]);

 // Fase 15: filigrana geométrica en el paseo axial (interpretación artística).
 for(const side of [-1,1])for(let j=0;j<24;j++){
  const z=5+j*1.48;
  box(side*5.2,.071,z,.17,.016,.80,j%4===0?[.82,.74,.64]:[.51,.48,.41]);
  if(j%3===0)box(side*8.4,.07,z,1.15,.025,.12,[.80,.73,.61]);
 }
return faces}
