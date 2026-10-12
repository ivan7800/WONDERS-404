// Artistic interpretation of Giza, not a measured archaeological survey.
export function giza(){
 const faces=[];const add=(vertices,color)=>faces.push({vertices,color});
 const sand=[.70,.53,.34],dune=[.77,.60,.39],limestone=[.82,.70,.51],
       worn=[.66,.53,.38],shadow=[.43,.34,.26],bedrock=[.59,.48,.36];
 const quad=(a,b,c,d,color)=>add([a,b,c,d],color);
 function box(x,y,z,w,h,d,color){
  const a=x-w/2,b=x+w/2,f=z-d/2,g=z+d/2;
  const v=[[a,y,f],[b,y,f],[b,y+h,f],[a,y+h,f],[a,y,g],[b,y,g],[b,y+h,g],[a,y+h,g]];
  for(const ids of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])add(ids.map(i=>v[i]),color);
 }
 const ring=(x,z,r,y)=>[[x-r,y,z-r],[x+r,y,z-r],[x+r,y,z+r],[x-r,y,z+r]];
 function pyramid(cx,cz,side,height,courses,exposure){
  for(let course=0;course<courses;course++){
   const t=course/courses,u=(course+1)/courses;
   const lower=ring(cx,cz,side*(1-t)/2,height*t);
   const upper=ring(cx,cz,side*(1-u)/2,height*u);
   for(let face=0;face<4;face++){
    const a=lower[face],b=lower[(face+1)%4],c=upper[(face+1)%4],d=upper[face];
    const number=course*4+face;
    const color=(number*13%17<exposure&&course<courses-2)?limestone:
      (number*7%11<3?worn:(face===1||face===2?bedrock:sand));
    const steps=course<4?5:course<courses-4?4:2;
    const lerp=(p,q,v)=>p.map((n,i)=>n+(q[i]-n)*v);
    for(let j=0;j<steps;j++){
     const x=j/steps,y=(j+1)/steps,variation=number*19+j*11;
     const tint=variation%13===0?.84:variation%9===0?1.09:1;
     quad(lerp(a,b,x),lerp(a,b,y),lerp(d,c,y),lerp(d,c,x),color.map(v=>Math.min(1,v*tint)));
    }
   }
  }
  // An inset doorway and courses of partially surviving casing stone.
  box(cx,2.2,cz+side*.42,side*.095,2.9,.16,shadow);
  box(cx,4.8,cz+side*.39,side*.11,.38,.65,limestone);
 }
 // Shared vertex heights prevent cracks between adjacent ground tiles.
 const n=36,span=172,step=span/n;
 const height=(x,z)=>-.82+Math.sin(x*.055)*Math.cos(z*.047)*.42+Math.sin(z*.13+x*.08)*.13;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){
  const x=-span/2+i*step,z=-span/2+j*step;
  quad([x,height(x,z),z],[x+step,height(x+step,z),z],
   [x+step,height(x+step,z+step),z+step],[x,height(x,z+step),z+step],
   (i*11+j*7)%17<5?dune:sand);
 }
 // Placement preserves the existing points of interest and camera views.
 pyramid(-19,-15,30,26,20,3);pyramid(19,-24,27,24,19,5);pyramid(33,18,17,14,15,2);
 for(const [x,z,w] of [[-19,-15,34],[19,-24,31],[33,18,20]]){
  box(x,-.48,z,w,.42,w,bedrock);
  for(let k=-2;k<=2;k++)box(x+k*w*.12,-.34,z+w*.53,w*.1,.18,.7,k%2?limestone:worn);
 }
 for(let j=0;j<15;j++){
  const z=23+j*3.4;
  box(-2,-.33,z,4.2,.14,2.7,j%4===0?limestone:worn);
  for(const s of [-1,1])box(-2+s*2.5,-.35,z,.26,.28,2.4,shadow);
 }
 for(let i=0;i<9;i++)box(-45+(i%5)*3.6,-.36,34+Math.floor(i/5)*5.2,
   2.5,1.2+i%3*.35,3.1,i%3?bedrock:worn);
 // Faceted lion body and headdress make the Sphinx a recognizable sculpture.
 const sx=-10,sz=29;
 function ellipseRing(x,y,z,rx,rz,count=12){return Array.from({length:count},(_,i)=>{
  const a=i*Math.PI*2/count;return [x+Math.cos(a)*rx,y,z+Math.sin(a)*rz];
 })}
 function connect(a,b,color){for(let i=0;i<a.length;i++)quad(a[i],a[(i+1)%a.length],b[(i+1)%b.length],b[i],color)}
 connect(ellipseRing(sx,.15,sz+3,6.2,10.4),ellipseRing(sx,2.55,sz+3,5.5,9.5),worn);
 connect(ellipseRing(sx,2.55,sz+3,5.5,9.5),ellipseRing(sx,4,sz+2,3.5,7.1),limestone);
 for(const side of [-1,1]){
  connect(ellipseRing(sx+side*4,1.05,sz+7,2.5,3.2,10),
   ellipseRing(sx+side*3.8,3.4,sz+7,2,2.5,10),bedrock);
  box(sx+side*3.6,-.28,sz-7,2.7,1.35,9.6,limestone);
  box(sx+side*3.6,-.3,sz-11.1,3,.65,2.6,worn);
  for(let toe=0;toe<3;toe++)box(sx+side*3.6+(toe-1)*.72,-.26,sz-12.2,.58,.32,1,bedrock);
 }
 connect(ellipseRing(sx,3.1,sz-5.2,2.9,2.55,10),
  ellipseRing(sx,9.2,sz-5.3,2.55,2,10),bedrock);
 connect(ellipseRing(sx,5.35,sz-7.6,1.65,1.15,10),
  ellipseRing(sx,9.45,sz-7.45,2,1.25,10),limestone);
 for(const s of [-1,1]){
  add([[sx+s*2.2,9.5,sz-6.5],[sx+s*3.6,8.4,sz-6.2],
   [sx+s*3.2,3.25,sz-6.3],[sx+s*1.9,5.1,sz-7]],worn);
  box(sx+s*.9,8.15,sz-8.53,.65,.13,.2,shadow);
 }
 box(sx,6.35,sz-8.48,1.35,.16,.24,shadow);
 box(sx,5.45,sz-8.15,1.65,.13,.2,worn);
 box(sx,9.35,sz-7.8,4.4,.52,.55,limestone);
 for(let i=0;i<35;i++){
  const theta=i*2.399963,dist=40+(i%8)*3,x=Math.cos(theta)*dist,z=Math.sin(theta)*dist+7;
  if(x>-40&&x<53&&z>-45&&z<38)continue;
  box(x,-.64,z,.9+(i%4)*.55,.18+(i%3)*.16,1.2+(i%5)*.28,i%4?bedrock:limestone);
 }
 for(let i=0;i<7;i++)box(-65+i*8,-.42,57,4.5,.17,2.2,i%3?dune:bedrock);
 return faces;
}
