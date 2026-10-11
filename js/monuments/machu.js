// Interpretación artística de Machu Picchu, NO levantamiento topográfico.
// Caras simples, sin dependencias, procesadas por el motor WebGL compartido.
export function machu(){
 const faces=[];const face=(vertices,color)=>faces.push({vertices,color});
 const grass=[.22,.39,.25],grass2=[.31,.46,.29],earth=[.32,.32,.24],stone=[.57,.57,.49],stoneDark=[.39,.42,.37],stoneLight=[.68,.66,.54];
 const box=(x,y,z,w,h,d,c)=>{const a=x-w/2,b=x+w/2,f=z-d/2,g=z+d/2;const v=[[a,y,f],[b,y,f],[b,y+h,f],[a,y+h,f],[a,y,g],[b,y,g],[b,y+h,g],[a,y+h,g]];for(const ids of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])face(ids.map(i=>v[i]),c)};
 const terrain=(x,z)=> {const ridge=Math.max(0,1-Math.abs(x+62)/75)*Math.max(0,1-Math.abs(z+38)/120);const west=35*Math.exp(-Math.pow((x+72)/22,2))*Math.exp(-Math.pow((z+28)/62,2));const east=42*Math.exp(-Math.pow((x-78)/25,2))*Math.exp(-Math.pow((z+25)/63,2));const far=25*Math.exp(-Math.pow((z+92)/32,2))*(.6+.4*Math.cos(x*.045));const plateau= x>-40&&x<40&&z>-33&&z<38 ? 0 : -6;return Math.max(-11,west+east+far+ridge*3+plateau+Math.sin(x*.18+z*.08)*1.4)};
 // Malla montañosa lejana, marcada por valles y aristas alternadas.
 const extent=145,n=52,step=2*extent/n;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){let x=-extent+i*step,z=-extent+j*step;
  const a=[x,terrain(x,z)-9,z],b=[x+step,terrain(x+step,z)-9,z],c=[x+step,terrain(x+step,z+step)-9,z+step],d=[x,terrain(x,z+step)-9,z+step];
  const color=(i+j)%11<3?grass2:((i*5+j*3)%17<4?earth:grass);face([a,b,c],color);face([a,c,d],color);
 }
 // Cresta y plataformas de la ciudadela, cuidando silueta y profundidad.
 for(let k=0;k<11;k++){const z=-38+k*7;const width=51-Math.abs(k-5)*2.6;const y=-1+k*.43;box(0,y-1,z,width,1.6,6.2,stoneDark);box(0,y-.08,z,width-.7,.16,5.6,k%3===0?grass2:grass)}
 // Terrazas cultivables laterales con muros de piedra escalonados.
 for(const side of [-1,1])for(let k=0;k<14;k++){const x=side*(24+k*2.8),z=15-k*3.6,y=-.3-k*.68;box(x,y-1.3,z,7.5,1.7,7.1,stoneDark);box(x,y-.04,z,7.1,.12,6.7,k%3?grass:grass2)}
 // Conjuntos de recintos incas: muros incompletos, patios y accesos libres.
 function ruin(x,z,w,d,h=2.7){const y=1.6;box(x-w/2,y,z,.9,h,d,stone);box(x+w/2,y,z,.9,h,d,stoneLight);box(x,y,z-d/2,w,.95,.75,stone);box(x-w*.28,y,z+d/2,w*.44,h,.8,stoneDark);box(x+w*.28,y,z+d/2,w*.44,h,.8,stone)}
 for(let i=0;i<16;i++){const row=Math.floor(i/4),col=i%4;ruin(-19+col*12,-20+row*11,7.8,6.2,2.2+(i%4)*.25)}
 // Templo de tres ventanas y muro ceremonial (interpretación simplificada).
 box(14,2.9,-12,1.3,5,16,stoneLight);for(let j=0;j<4;j++)box(8+j*3.8,2.9,-20,1.15,4.7,1.4,stone);box(14,7.4,-20,15.7,1.1,1.4,stone);
 // Escalera de acceso y patios.
 for(let i=0;i<12;i++)box(1,-.4+i*.19,36-i*2.9,3.6,.18,2.55,stoneLight);
 // Llamas de piedra abstractas y vegetación baja como elementos de escala.
 for(let i=0;i<26;i++){const x=-37+(i*17%71),z=-39+(i*23%87);if(Math.abs(x)<23&&z<26)continue;box(x,-.5,z,1.4,.5,1.4,i%3?grass2:earth)}
 // Bandas de bruma suspendidas en las quebradas: translúcidas no disponibles
 // en el renderer actual; se sugieren con bandas de color verde-gris opaco.
 for(let i=0;i<8;i++){const z=-61-i*9,x=-83+(i%3)*5;face([[x,-3+i*.9,z],[x+18,-3+i*.9,z],[x+18,-2+i*.9,z+3],[x,-2+i*.9,z+3]],[.42,.53,.48])}

 // Fase 16: remates de mampostería y terrazas con bordes de piedra.
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const xx=-19+col*12,zz=-20+row*11;
  for(let k=0;k<5;k++)box(xx-3.3+k*1.65,4.02,zz-3.1,1.50,.15,.78,k%3===0?stoneLight:stone);
 }
 for(const side of [-1,1])for(let k=0;k<12;k++){
  const x=side*(27+k*2.8),z=15-k*3.6,y=-.3-k*.68;
  box(x,y+.08,z,5.0,.14,.23,k%4===0?stoneLight:stone);
 }
 return faces;
}
