// Shared upgrades for seven original procedural WebGL scenes. Eiffel retains its own isolated viewer.
import {AmbientSound} from './ambient.js';
const code=document.body.dataset.monument;
const info={
 taj:{name:'Taj Mahal',fact:'La disposición axial de los jardines refuerza la simetría del mausoleo.'},
 colosseum:{name:'Coliseo',fact:'El anfiteatro fue escenario de espectáculos públicos durante la Roma imperial.'},
 giza:{name:'Guiza',fact:'Las pirámides de Guiza forman parte de una necrópolis mucho más extensa.'},
 machu:{name:'Machu Picchu',fact:'La construcción inca aprovecha terrazas y muros adaptados al terreno montañoso.'},
 petra:{name:'Petra',fact:'El Siq es un desfiladero natural que conduce al célebre Tesoro.'},
 angkor:{name:'Angkor Wat',fact:'El complejo de Angkor Wat cuenta con galerías y relieves de gran importancia histórica.'},
 sagrada:{name:'Sagrada Família',fact:'Gaudí estudió estructuras naturales para diseñar soluciones arquitectónicas orgánicas.'}
};
const $=id=>document.getElementById(id);if(!info[code])throw Error('Escenario no configurado: '+code);
const sound=new AmbientSound(code);let voice=false,tourTimer=null,seen=new Set(),lastTour=-1;const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{const saved=JSON.parse(localStorage.getItem('wonders404.atlas.v2')||'null');const collected=saved?.discoveries?.[code];if(Array.isArray(collected))seen=new Set(collected.filter(n=>Number.isInteger(n)&&n>=0&&n<=3))}catch{}
const prefKey='wonders404.quality';let quality='media';try{quality=localStorage.getItem(prefKey)||'media'}catch{}if(!['baja','media','alta'].includes(quality))quality='media';window.__wondersQuality=quality;
const buttons=$('poiButtons'),panel=$('heritage'),aside=document.querySelector('aside');
const custom=document.createElement('div');custom.className='experience-tools';custom.innerHTML=`<span class="tag">ATLAS / EXPERIENCIA</span><div class="experience-controls"><button id="ambient" type="button" aria-pressed="false">♫ ACTIVAR AMBIENTE</button><button id="narrate" type="button" aria-pressed="false">◖ ESCUCHAR HISTORIA</button><label class="quality-label">CALIDAD <select id="quality" aria-label="Calidad gráfica"><option value="baja">BAJA</option><option value="media">MEDIA</option><option value="alta">ALTA</option></select></label></div><div class="discovery-line"><span>DESCUBRIMIENTOS</span><strong id="discoveryCount">0/4</strong><div class="discovery-track"><i id="discoveryFill"></i></div></div><p id="secretNote" class="secret-note" hidden></p>`;
aside.append(custom);$('quality').value=quality;
$('discoveryCount').textContent=seen.size+'/4';$('discoveryFill').style.width=(seen.size/4*100)+'%';if(seen.size===4){$('secretNote').hidden=false;$('secretNote').textContent='✧ ARCHIVO COMPLETADO — '+info[code].fact}
const strip=document.createElement('div');strip.className='scene-chapter';strip.innerHTML='<span>WONDERS 404 / EDICIÓN EXPLORADOR</span><strong id="chapterText">VISITA LIBRE</strong>';document.body.append(strip);
const mobile=document.createElement('div');mobile.className='mobile-panels';mobile.innerHTML='<button type="button" id="toggleControls" aria-expanded="false">⚙ CONTROLES</button><button type="button" id="toggleHistory" aria-expanded="false">⌘ HISTORIA</button>';document.body.append(mobile);
function setPanel(which){for(const [node,id] of [[aside,'toggleControls'],[panel,'toggleHistory']]){const open=node===which?!node.classList.contains('mobile-open'):false;node.classList.toggle('mobile-open',open);$(id).setAttribute('aria-expanded',String(open))}}
$('toggleControls').onclick=()=>setPanel(aside);$('toggleHistory').onclick=()=>setPanel(panel);
$('quality').onchange=e=>{window.__wondersQuality=e.target.value;try{localStorage.setItem(prefKey,e.target.value)}catch{}announce('Calidad: '+e.target.value)};
function announce(text){$('message').textContent=text}
$('ambient').onclick=async()=>{try{const enabled=await sound.toggle();$('ambient').setAttribute('aria-pressed',String(enabled));$('ambient').textContent=enabled?'♫ SILENCIAR AMBIENTE':'♫ ACTIVAR AMBIENTE';announce(enabled?'Ambiente sonoro activado.':'Ambiente sonoro desactivado.')}catch(err){announce('Tu navegador no puede reproducir el sonido.');console.warn(err)}};
function stopVoice(){if('speechSynthesis' in window)window.speechSynthesis.cancel();voice=false;$('narrate').setAttribute('aria-pressed','false');$('narrate').textContent='◖ ESCUCHAR HISTORIA'}
function tellStory(){if(!('speechSynthesis' in window)){announce('Narración de voz no disponible en este navegador.');return}if(voice){stopVoice();return}const text=$('poiDetails').innerText.trim();if(!text)return;stopVoice();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='es-ES';utterance.rate=.92;utterance.pitch=1;utterance.onend=stopVoice;utterance.onerror=stopVoice;voice=true;$('narrate').setAttribute('aria-pressed','true');$('narrate').textContent='◼ DETENER NARRACIÓN';window.speechSynthesis.speak(utterance)}
$('narrate').onclick=tellStory;
function report(index){if(!Number.isInteger(index)||index<0||index>3)return;seen.add(index);$('discoveryCount').textContent=seen.size+'/4';$('discoveryFill').style.width=(seen.size/4*100)+'%';if(seen.size===4){$('secretNote').hidden=false;$('secretNote').textContent='✧ ARCHIVO COMPLETADO — '+info[code].fact}if(window.parent!==window)window.parent.postMessage({app:'WONDERS404',event:'discovery',index},location.origin)}
function onPoint(index){report(index);const label=buttons.children[index]?.textContent||'PARADA '+(index+1);$('chapterText').textContent=label.toUpperCase();stopVoice()}
// Existing renderer already animates smooth transitions toward each point.
[...buttons.children].forEach((button,index)=>button.addEventListener('click',()=>{onPoint(index);if(tourTimer)stopTour()}));
function stopTour(){clearInterval(tourTimer);tourTimer=null;lastTour=-1;if($('tour').getAttribute('aria-pressed')==='true'){$('tour').click();return}$('tour').setAttribute('aria-pressed','false');$('tour').textContent='▶ VISITA GUIADA'}
function advanceTour(){lastTour=(lastTour+1)%buttons.children.length;$('nextPoi').click(); // original advances to the next point
 // The first tour click by the original controller already opened point zero.
 onPoint(lastTour);
}
$('tour').addEventListener('click',()=>{const enabled=$('tour').getAttribute('aria-pressed')==='true';if(!enabled){stopTour();return}clearInterval(tourTimer);lastTour=0;onPoint(0);$('tour').textContent='◼ DETENER RECORRIDO';if(!reduceMotion)tourTimer=setInterval(()=>{if(document.hidden)return;advanceTour()},11000)});
$('nextPoi').addEventListener('click',()=>{if(!tourTimer){const active=[...buttons.children].findIndex(b=>b.getAttribute('aria-pressed')==='true');if(active>=0)onPoint(active)}});
$('reset').addEventListener('click',()=>{stopTour();$('chapterText').textContent='VISTA GENERAL'});
$('orbit').addEventListener('click',()=>{stopTour();$('chapterText').textContent='CÁMARA LIBRE'});
$('photo').addEventListener('click',()=>{if(document.body.classList.contains('photo-mode')){stopVoice();stopTour()}});
document.getElementById('view').addEventListener('pointerdown',()=>{if(tourTimer)stopTour()});
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='m'&&!e.ctrlKey&&!e.metaKey){$('ambient').click()}if(e.key.toLowerCase()==='p'&&!e.ctrlKey&&!e.metaKey){$('photo').click()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopVoice();sound.stop().then(()=>{$('ambient').setAttribute('aria-pressed','false');$('ambient').textContent='♫ ACTIVAR AMBIENTE'})}});
window.addEventListener('pagehide',()=>{clearInterval(tourTimer);stopVoice();sound.stop()});
