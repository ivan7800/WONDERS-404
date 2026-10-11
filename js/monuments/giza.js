// Original stylized geometric landscape. Not an exact survey of the Giza plateau.
export function giza(){
 const faces=[];const face=(v,c)=>faces.push({vertices:v,color:c});
 const sand=[.67,.50,.31],dune=[.75,.57,.35],stone=[.73,.60,.43],shade=[.52,.40,.28],limestone=[.77,.68,.52];
 function box(x,y,z,w,h,d,col){let a=x-w/2,b=x+w/2,f=z-d/2,g=z+d/2;const v=[[a,y,f],[b,y,f],[b,y+h,f],[a,y+h,f],[a,y,g],[b,y,g],[b,y+h,g],[a,y+h,g]];for(const ids of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])face(ids.map(i=>v[i]),col)}
 function pyramid(cx,cz,side,height,stepCount){
  let bottom=0;for(let i=0;i<stepCount;i++){
   const t=i/stepCount,tt=(i+1)/stepCount;const half=side/2*(1-t),upper=side/2*(1-tt),lo=bottom+height*t,hi=bottom+height*tt;
   const ring=(r,y)=>[[cx-r,y,cz-r],[cx+r,y,cz-r],[cx+r,y,cz+r],[cx-r,y,cz+r]];let a=ring(half,lo),b=ring(upper,hi);
   for(let k=0;k<4;k++)face([a[k],a[(k+1)%4],b[(k+1)%4],b[k]],[(.68+i%3*.025)*(k%2?.87:1),.56*(k%2?.88:1),.38*(k%2?.88:1)]);
  }
  // Four clean tip faces eliminate a flat cap.
  const r=side/(2*stepCount),last=ringTop(cx,cz,r,height*(stepCount-1)/stepCount);const top=[cx,height,cz];for(let k=0;k<4;k++)face([last[k],last[(k+1)%4],top],stone);
 }
 function ringTop(x,z,r,y){return [[x-r,y,z-r],[x+r,y,z-r],[x+r,y,z+r],[x-r,y,z+r]]}
 // Surface tiles with subtle rolling terrain and a warmer distant horizon.
 const n=24,span=160;for(let i=0;i<n;i++)for(let j=0;j<n;j++){let x=-span/2+i*span/n,z=-span/2+j*span/n;const h=(xx,zz)=>-.8+Math.sin(xx*.078)*Math.cos(zz*.067)*.28+Math.sin(zz*.17+xx*.11)*.13;face([[x,h(x,z),z],[x+span/n,h(x+span/n,z),z],[x+span/n,h(x+span/n,z+span/n),z+span/n],[x,h(x,z+span/n),z+span/n]],(i+j)%5===0?dune:sand)}
 // Relative sizes and placement are artistically simplified, not surveyed coordinates.
 pyramid(-19,-15,30,26,18);pyramid(19,-24,27,24,17);pyramid(33,18,17,14,13);
 // Entrance pathway and mastaba-like blocks.
 for(let j=0;j<12;j++)box(-2,-.35,22+j*3,3.3,.22,2.45,j%2?limestone:shade);
 for(let i=0;i<7;i++)box(-43+i*3,-.35,31+(i%2)*4,2.5,1.5+(i%3)*.45,3.2,stone);
 // Sphinx facing forward: sculptural faceted head, headdress, body and paws.
 const sx=-10,sz=29;
 box(sx,-.3,sz,12,3.8,19,stone);box(sx,2.7,sz-5.5,8,3.1,7,shade);
 box(sx,5.5,sz-6.5,4.6,5.2,4.2,limestone);box(sx,7.1,sz-8.75,3.3,1.25,1.9,stone);
 box(sx,5.0,sz-9,2.4,1.2,2.2,limestone);box(sx-4,-.25,sz-11,3.2,2.25,9,stone);box(sx+4,-.25,sz-11,3.2,2.25,9,stone);
 // Horizontal monument platforms and low boundary stones.
 box(-19,-.42,-15,34,.47,34,shade);box(19,-.42,-24,31,.47,31,shade);box(33,-.42,18,20,.47,20,shade);
 for(let i=0;i<14;i++){let x=-65+i*9.5;box(x,-.42,55,5,.16,2,i%3?dune:stone)}

 // Fase 16: pequeñas zonas de roca erosionada y sillares alrededor de la necrópolis.
 for(let i=0;i<90;i++){
  const theta=i*2.399963,dist=42+(i%9)*3;
  const x=Math.cos(theta)*dist,z=Math.sin(theta)*dist+6;
  if(x>-40&&x<53&&z>-45&&z<38)continue;
  box(x,-.72,z,.8+(i%4)*.7,.16+(i%3)*.12,1.4+(i%5)*.25,i%4===0?limestone:shade);
 }
 for(let j=0;j<14;j++)box(-10+(j%7)*1.25,3.9,27+j%2*.21,.11,.25,.4,j%2?limestone:stone);
 return faces;
}
