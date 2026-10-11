// User-initiated Web Audio ambience: generated locally, no remote samples or streams.
const SOUND_PROFILES={taj:{cutoff:600,wind:0.020,water:0.019,drone:74},colosseum:{cutoff:350,wind:0.028,water:0,drone:67},giza:{cutoff:260,wind:0.037,water:0,drone:63},machu:{cutoff:750,wind:0.03,water:0.008,drone:86},petra:{cutoff:300,wind:0.026,water:0,drone:74},angkor:{cutoff:940,wind:0.022,water:0.024,drone:98},sagrada:{cutoff:540,wind:0.013,water:0,drone:112},eiffel:{cutoff:480,wind:0.018,water:0,drone:88}};
export class AmbientSound{
 constructor(id){this.id=id;this.ctx=null;this.nodes=[];this.active=false}
 async start(){if(this.active)return true;const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw Error('Audio no disponible');const ctx=new Ctx();this.ctx=ctx;const p=SOUND_PROFILES[this.id]||SOUND_PROFILES.eiffel;
  const len=ctx.sampleRate*3,b=ctx.createBuffer(1,len,ctx.sampleRate),ch=b.getChannelData(0);let previous=0;
  for(let i=0;i<len;i++){const white=Math.random()*2-1;previous=(previous+0.024*white)/1.024;ch[i]=previous*3.3}
  const source=ctx.createBufferSource();source.buffer=b;source.loop=true;
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=p.cutoff;
  const volume=ctx.createGain();volume.gain.value=p.wind;
  source.connect(filter).connect(volume).connect(ctx.destination);source.start();this.nodes.push(source);
  if(p.water){const water=ctx.createBufferSource();water.buffer=b;water.loop=true;const hp=ctx.createBiquadFilter();hp.type='bandpass';hp.frequency.value=380;hp.Q.value=.3;const gain=ctx.createGain();gain.gain.value=p.water;water.connect(hp).connect(gain).connect(ctx.destination);water.start();this.nodes.push(water)}
  const tone=ctx.createOscillator();tone.type='sine';tone.frequency.value=p.drone;const toneVolume=ctx.createGain();toneVolume.gain.value=.004;tone.connect(toneVolume).connect(ctx.destination);tone.start();this.nodes.push(tone);
  await ctx.resume();this.active=true;return true
 }
 async stop(){const ctx=this.ctx;this.active=false;this.ctx=null;this.nodes=[];if(ctx){try{await ctx.close()}catch{}}}
 toggle(){return this.active?this.stop().then(()=>false):this.start()}
}
