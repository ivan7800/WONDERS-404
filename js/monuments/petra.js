// Petra: maqueta artística procedural. No es una reconstrucción arqueológica exacta.
export function petra(){
 const faces=[];const add=(v,c)=>faces.push({vertices:v,color:c});
 const rose=[.65,.35,.27],sand=[.69,.43,.30],shade=[.43,.24,.22],warm=[.79,.52,.36],dark=[.33,.20,.19];
 const box=(x,y,z,w,h,d,c)=>{const a=x-w/2,b=x+w/2,f=z-d/2,g=z+d/2,v=[[a,y,f],[b,y,f],[b,y+h,f],[a,y+h,f],[a,y,g],[b,y,g],[b,y+h,g],[a,y+h,g]];for(const ids of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])add(ids.map(i=>v[i]),c)};
 const cone=(x,y,z,r,h,c,n=12)=>{const apex=[x,y+h,z];for(let i=0;i<n;i++){let a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;add([[x+r*Math.cos(a),y,z+r*Math.sin(a)],[x+r*Math.cos(b),y,z+r*Math.sin(b)],apex],c)}};
 // Ground surface with subtle sand banding.
 for(let i=0;i<22;i++)for(let j=0;j<22;j++){let x=-105+i*10,z=-115+j*10;add([[x,-2,z],[x+10,-2,z],[x+10,-2,z+10],[x,-2,z+10]],(i+2*j)%7<2?sand:rose)}
 // Siq: long high, uneven sandstone walls framing a narrow approach.
 for(const side of [-1,1])for(let k=0;k<19;k++){
  const z=18+k*5.3,noise=Math.sin(k*.84+side)*2.7,width=9+Math.sin(k*.48)*2.5;
  const x=side*(width+8+noise),h=16+5*Math.sin(k*.37+1.3)+4*Math.cos(k*.91);
  box(x,-1.8,z,15,h,5.7,(k%4===0)?warm:(k%3===0?shade:rose));
  box(x+side*6,-1.8,z,7,h*.75,5.8,k%2?shade:sand);
  // strata / weathering lines
  for(let t=0;t<3;t++)box(x,-1.5+h*(.24+t*.20),z,15,.24,5.9,t%2?warm:shade);
 }
 // Natural rock mass behind the facade.
 box(0,-2,-26,65,39,18,shade);for(let k=0;k<14;k++)box(-28+k*4.3,16+Math.sin(k)*2,-27,4,4+Math.cos(k*.7)*2,19,k%2?rose:sand);
 // Al-Khazneh / Treasury stylized symmetrical facade; z front closer to camera.
 box(0,-1,-15,37,25,4,rose);box(0,22,-15,41,2.7,5,warm);box(0,3,-12.2,8,17,.55,dark);
 // Lower level columns & recessed side bays
 for(const side of [-1,1]){
  box(side*12,2,-12,7,14,.65,shade);
  for(const k of [0,1,2]){
   const x=side*(7.6+k*4.7);box(x,1,-10.8,1.15,18,1.15,warm);box(x,17,-10.8,2.05,1.25,2.1,sand);box(x,.6,-10.8,2.1,1.25,2.2,sand);
  }
 }
 box(0,19,-11,40,2.5,3.5,sand);
 // Upper temple, pediments and characteristic circular tholos.
 box(-12,21.5,-11,11,11,3,warm);box(12,21.5,-11,11,11,3,warm);box(0,21.5,-10,9,10,3,rose);
 for(const x of [-16,-11,11,16])box(x,22,-8.7,1,9.5,1,warm);
 for(const x of [-4.5,4.5])box(x,22,-8.2,1,9.5,1,warm);
 box(0,31,-10,11,2,4,sand);cone(0,33,-10,5.6,5,warm,16);
 // Central urn and top pediments.
 box(0,38,-10,.9,2,.9,shade);cone(0,40,-10,1.5,2,warm);
 for(const side of [-1,1])add([[side*7,33,-9],[side*19,33,-9],[side*13,38,-9]],sand);
 // Courtyard paving, scattered dressed rocks and steps to the facade.
 for(let k=0;k<8;k++)box(0,-1.8+k*.14,-1-k*1.8,31,.18,1.65,k%2?warm:sand);
 for(let k=0;k<40;k++){const x=-58+(k*29%116),z=-37+(k*41%95);if(Math.abs(x)<20&&z<40)continue;box(x,-1.9,z,1.2+(k%4)*.6,.7+(k%3)*.5,1.5,k%2?shade:sand)}

 // Fase 17: vetas de arenisca y piezas esculpidas en la fachada superior.
 for(const side of [-1,1])for(let k=0;k<19;k++){
  const z=18+k*5.3,noise=Math.sin(k*.84+side)*2.7,width=9+Math.sin(k*.48)*2.5;
  const x=side*(width+8+noise),h=16+5*Math.sin(k*.37+1.3)+4*Math.cos(k*.91);
  for(const ratio of [.13,.40,.72])box(x,-1.8+h*ratio,z,15,.11,5.8,ratio===.4?warm:shade);
 }
 for(let i=0;i<24;i++){
  const x=-17+(i%12)*3.1,y=4+Math.floor(i/12)*4.8;
  box(x,y,-9.52,1.1,1.2,.14,i%4===0?warm:shade);
 }
 return faces;
}
