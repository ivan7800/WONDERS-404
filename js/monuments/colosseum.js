// Stylized, original procedural reconstruction of the Colosseum (not a measured survey).
// Partial elliptical outer wall exposes the arena and concentric galleries.
export function colosseum(){
 const faces=[];const face=(vertices,color)=>faces.push({vertices,color});
 const limestone=[.70,.56,.42],sunstone=[.82,.67,.49],aged=[.52,.42,.34],inside=[.37,.32,.29],sand=[.64,.51,.37],green=[.31,.39,.28];
 function box(x,y,z,w,h,d,color){const a=x-w/2,b=x+w/2,c=y,e=y+h,f=z-d/2,g=z+d/2;const v=[[a,c,f],[b,c,f],[b,e,f],[a,e,f],[a,c,g],[b,c,g],[b,e,g],[a,e,g]];for(const q of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])face(q.map(i=>v[i]),color)}
 function ellipse(t,rx,rz,y){return [Math.cos(t)*rx,y,Math.sin(t)*rz]}
 function strip(t0,t1,ri,ro,y0,y1,col){face([ellipse(t0,ro[0],ro[1],y0),ellipse(t1,ro[0],ro[1],y0),ellipse(t1,ro[0],ro[1],y1),ellipse(t0,ro[0],ro[1],y1)],col);face([ellipse(t1,ri[0],ri[1],y0),ellipse(t0,ri[0],ri[1],y0),ellipse(t0,ri[0],ri[1],y1),ellipse(t1,ri[0],ri[1],y1)],inside);face([ellipse(t0,ri[0],ri[1],y1),ellipse(t0,ro[0],ro[1],y1),ellipse(t1,ro[0],ro[1],y1),ellipse(t1,ri[0],ri[1],y1)],col)}
 // Terrain and elliptical central arena.
 box(0,-1,0,82,.8,70,[.30,.36,.27]);box(0,-.57,0,63,.12,51,[.44,.40,.30]);
 const n=88,outer=[26,20],inner=[24.3,18.4],ar=[15,10.5];
 for(let i=0;i<n;i++){const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;face([ellipse(a,ar[0],ar[1],-.32),ellipse(b,ar[0],ar[1],-.32),ellipse(b,ar[0]*.93,ar[1]*.93,-.32),ellipse(a,ar[0]*.93,ar[1]*.93,-.32)],sand)}
 // Arena sand as a fan, centered beneath a ring of terraced seating.
 for(let i=0;i<n;i++){let a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;face([[0,-.3,0],ellipse(a,ar[0],ar[1],-.3),ellipse(b,ar[0],ar[1],-.3)],[.70,.55,.37])}
 for(let tier=0;tier<6;tier++){const r0=[15+tier*1.4,10.5+tier*1.18],r1=[16.4+tier*1.4,11.68+tier*1.18],y0=.15+tier*1.18;for(let i=0;i<n;i++){const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;face([ellipse(a,r0[0],r0[1],y0),ellipse(b,r0[0],r0[1],y0),ellipse(b,r1[0],r1[1],y0+.65),ellipse(a,r1[0],r1[1],y0+.65)],tier%2?aged:limestone);face([ellipse(a,r1[0],r1[1],y0+.65),ellipse(b,r1[0],r1[1],y0+.65),ellipse(b,r1[0],r1[1],y0+.79),ellipse(a,r1[0],r1[1],y0+.79)],sunstone)}}
 // Three orders of arcades: piers and arch-like vaulted polygon openings.
 // Preserve a ruined missing segment, so the interior arena is visible from the front.
 const bays=64;for(let level=0;level<3;level++)for(let i=0;i<bays;i++){
  const a=(i+.08)*2*Math.PI/bays,b=(i+.92)*2*Math.PI/bays,mid=(i+.5)*2*Math.PI/bays;
  // Visible breach in the eastern/southern arc, expanding towards the top.
  const breach=(Math.sin(mid)>.37 && Math.cos(mid)>.05 && (level===2||Math.cos(mid)>.45));
  if(breach)continue;
  const y=level*4.15,col=level===0?limestone:level===1?sunstone:aged;
  strip(a,a+(b-a)*.16,[24.3,18.4],outer,y,y+3.75,col);strip(b-(b-a)*.16,b,[24.3,18.4],outer,y,y+3.75,col);
  // A narrow voussoir lintel with a faceted semicircular arch profile.
  const segments=7,base=y+2.36;
  for(let k=0;k<segments;k++){const t0=a+(b-a)*.16+((b-a)*.68)*k/segments,t1=a+(b-a)*.16+((b-a)*.68)*(k+1)/segments;const arc=(t)=>base+.95*Math.sqrt(Math.max(0,1-Math.pow(2*(t-(a+b)/2)/((b-a)*.68),2)));const lo=Math.min(arc(t0),arc(t1));strip(t0,t1,[24.3,18.4],outer,lo,y+3.75,col)}
  strip(a,b,[24.0,18.1],[26.35,20.3],y+3.8,y+4.13,aged);
 }
 // Fourth attic storey, with intermittent collapsed portions.
 for(let i=0;i<bays;i++){const a=i*2*Math.PI/bays,b=(i+1)*2*Math.PI/bays,mid=(a+b)/2;if(Math.sin(mid)>.15&&Math.cos(mid)>-.15)continue;if(i%9===0)continue;strip(a,b,[24.5,18.5],outer,12.45,15.2,i%3?limestone:aged)}
 // Radial access corridors and fragments of exposed substructure.
 for(let i=0;i<16;i++){const t=i*Math.PI/8;const p=ellipse(t,14.8,10.3,0);const q=ellipse(t,22,16.5,0);face([[p[0],-.08,p[2]],[q[0],-.08,q[2]],[q[0],.08,q[2]],[p[0],.08,p[2]]],inside)}
 for(let j=0;j<9;j++){const z=-6+j*1.55;box(-3.5,-.25,z,8,.18,.22,[.49,.39,.31]);box(3,-.25,z,3,.18,.22,[.49,.39,.31])}
 // Ancient approach stones and some surrounding grass patches.
 for(let i=0;i<12;i++){const x=-34+i*6;box(x,-.52,25,4.7,.06,3.5,i%2?aged:sunstone)}
 // Fase 13: cornisas y bloques desgastados para diferenciar cada orden.
 const pale=[.86,.72,.55],mortar=[.44,.37,.31],warm=[.77,.57,.39];
 for(let level=0;level<3;level++)for(let i=0;i<64;i++){
  const t=(i+.5)*Math.PI*2/64;
  if(Math.sin(t)>.37&&Math.cos(t)>.05&&(level===2||Math.cos(t)>.45))continue;
  const p=ellipse(t,26.2,20.2,level*4.15+4.02);
  box(p[0],p[1],p[2],.55,.12,.52,i%4===0?warm:pale);
  if(i%3===0){const q=ellipse(t,26.12,20.13,level*4.15+.75);
   box(q[0],q[1],q[2],.38,.44,.36,mortar)}
 }
 // Arena: two concentric paving bands and archaeological excavation remnants.
 for(let k=0;k<96;k++){
  const a=k*2*Math.PI/96,b=(k+1)*2*Math.PI/96;
  face([ellipse(a,15.10,10.60,-.24),ellipse(b,15.10,10.60,-.24),ellipse(b,15.35,10.85,-.24),ellipse(a,15.35,10.85,-.24)],k%6===0?warm:aged);
 }
 for(let j=0;j<7;j++){
  const z=-5.8+j*1.8;
  box(-2.5,-.18,z,7,.26,.19,j%2?mortar:aged);
  box(3.2,-.18,z,3.3,.26,.19,mortar);
  for(const x of [-5.6,1.4,4.7])box(x,-.2,z,.3,.42,.31,limestone);
 }
 // Discrete patches of vegetation at the perimeter, not on the historical facade.
 for(let i=0;i<30;i++){
  const t=i*2.399;const x=Math.cos(t)*(32+i%6),z=Math.sin(t)*(25+i%5);
  box(x,-.44,z,.7,.12,.65,i%2?green:[.37,.44,.30]);
 }

 // Fase 15: sillares caídos y bandas del perímetro, visibles a ras del suelo.
 for(let i=0;i<48;i++){
  const theta=i*2.399963,rx=28.5+(i%6)*1.20,rz=22+(i%4)*1.3;
  const x=Math.cos(theta)*rx,z=Math.sin(theta)*rz;
  box(x,-.49,z,.9+(i%4)*.35,.30+(i%3)*.14,.85,i%5===0?sunstone:aged);
 }
 return faces;
}
