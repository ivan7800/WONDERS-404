// Angkor Wat: interpretation artistica procedural, no replica arqueologica.
export function angkor(){
 const faces=[];const add=(v,c)=>faces.push({vertices:v,color:c});
 const stone=[.43,.43,.37],bright=[.64,.60,.47],shade=[.29,.32,.29],moss=[.25,.40,.26],green=[.17,.29,.22],water=[.19,.39,.52],path=[.57,.49,.36];
 const box=(x,y,z,w,h,d,c)=>{const a=x-w/2,b=x+w/2,f=z-d/2,g=z+d/2,v=[[a,y,f],[b,y,f],[b,y+h,f],[a,y+h,f],[a,y,g],[b,y,g],[b,y+h,g],[a,y+h,g]];for(const ids of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])add(ids.map(i=>v[i]),c)};
 const terrace=(x,y,z,w,d,h=1)=>{box(x,y,z,w,h,d,stone);box(x,y+h,z,w+1,.35,d+1,bright)};
 const tower=(x,y,z,scale=1)=>{
  const tiers=[[0,7,8.8],[6,6.2,7.5],[12.5,5.2,6.2],[18,4.1,5],[23,3.2,3.7],[27,2.3,3.0],[30,1.3,3.1]];
  for(let i=0;i<tiers.length;i++){
   const [level,w,h]=tiers[i],next=tiers[i+1]?.[1]??.55;
   box(x,y+level*scale,z,w*scale,h*scale,w*scale,level%2?stone:shade);
   box(x,y+(level+h-.4)*scale,z,(w+1)*scale,.65*scale,(w+1)*scale,bright);
   // Recessed, tapered upper chamber and a dark doorway on the approach side.
   if(i>0&&i<tiers.length-1){
    const inset=w*.72;
    box(x,y+(level+h*.48)*scale,z+inset*.48,(w*.24)*scale,(h*.43)*scale,.12*scale,shade);
    for(const side of [-1,1]){
     const bx=x+side*(w*.34)*scale;
     box(bx,y+level*scale,z+inset*.50,.12*scale,h*.55*scale,.14*scale,bright);
    }
   }
   if(i===tiers.length-1){
    // Compact lotus-bud crown, keeping the characteristic Khmer skyline.
    for(let k=0;k<4;k++)box(x,y+(level+h+k*.45)*scale,z,
      (1.8-k*.31)*scale,.42*scale,(1.8-k*.31)*scale,k%2?stone:bright);
   }
  }
  // Angular Khmer silhouette with ascending layered cornices.
  for(let k=0;k<4;k++){const r=(3.9-k*.8)*scale;box(x,y+(13+k*5)*scale,z,r*2,1.1*scale,r*2,k%2?bright:stone)}
 };
 // Bas-relief-like checkerboard foliage and stone causeway.
 for(let i=0;i<30;i++)for(let j=0;j<30;j++){const x=-90+i*6,z=-90+j*6;add([[x,-2,z],[x+6,-2,z],[x+6,-2,z+6],[x,-2,z+6]],((i*7+j*11)%9)<3?green:moss)}
 // Moat frames the temple: shallow blue perimeter canals.
 for(const z of [-68,68])box(0,-1.85,z,140,.08,12,water);
 for(const x of [-68,68])box(x,-1.85,0,12,.08,125,water);
 // Elevated front causeway and paved ceremonial road.
 box(0,-1.4,36,8,.5,88,path);
 for(let i=0;i<22;i++)box(0,-.85,75-i*4,8.8,.08,.16,bright);
 for(const side of [-1,1])for(let i=0;i<18;i++){
  const z=65-i*3.45,x=side*(4.8+Math.sin(i*.22)*.35);
  box(x,-.65,z,.72,.82,.72,i%3?stone:bright);
  box(x,-.02,z,.95,.16,.95,bright);
 }
 // Outer gallery: visually readable courtyards and colonnades.
 const ring=(halfX,halfZ,y,height)=>{
  for(const z of [-halfZ,halfZ]){box(0,y,z,halfX*2,height,2.8,shade);box(0,y+height,z,halfX*2+.8,.9,3.7,bright)}
  for(const x of [-halfX,halfX]){box(x,y,0,2.8,height,halfZ*2,shade);box(x,y+height,0,3.8,.9,halfZ*2+.8,bright)}
  for(let k=-halfX+5;k<halfX-1;k+=5)for(const z of [-halfZ,halfZ]){box(k,y,z+(z>0?-1:1)*1.8,1.4,height*.72,1.1,stone);box(k,y+height*.75,z,2,.6,3,bright)}
 };
 terrace(0,-1,0,98,82,1);ring(46,37,0,7);
 terrace(0,.4,-2,69,55,1.8);ring(32,24,2.2,8);
 terrace(0,2,-4,42,36,3);ring(19,16,5,9);
 // Main five-tower quincunx.
 for(const [x,z,s] of [[-16,-19,.62],[16,-19,.62],[-16,11,.62],[16,11,.62],[0,-4,1]])tower(x,5,z,s);
 // Sacred staircases, lintels and stone windows.
 for(const z of [18,25,33])for(let n=0;n<7;n++)box(0,1+n*.37,z+n*.75,8,.38,1,stone);
 for(const side of [-1,1])for(let k=0;k<12;k++){const z=-32+k*5.7;box(side*38,0,z,2.6,4,1.4,stone);box(side*38,4,z,3,.55,2.3,bright)}
 // Groves of stylized palms/trees (sparse to keep frame rate stable).
 for(let i=0;i<105;i++){const a=i*2.39996,r=78+(i%7)*2.15,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<9&&z>0)continue;const h=3+(i%5)*.7;box(x,-1.9,z,.65,h,.65,shade);for(let k=0;k<3;k++)box(x,-1.9+h+k*1.6,z,3.7-k*.85,1.7,3.7-k*.85,k%3===0?green:moss)}

 // Fase 17: detalles rítmicos de balaustrada y tapas de arenisca.
 for(const side of [-1,1])for(let i=0;i<28;i++){
  const z=-34+i*2.5;
  box(side*45,7.15,z,.7,.48,1.3,i%4===0?bright:stone);
  if(i%2===0)box(side*45,6.68,z,1.08,.18,1.5,bright);
 }
 for(let i=0;i<20;i++){
  const z=-27+i*3;
  box(0,-.82,z,7.5,.09,.16,i%3===0?bright:path);
 }
 return faces;
}
