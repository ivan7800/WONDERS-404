/* Offline 3D by default on HTTP; Canvas if opened as file:// or requested explicitly. */
(function(){const p=new URLSearchParams(location.search);const local3d=location.protocol!=='file:'&&p.get('engine')!=='canvas';const s=document.createElement('script');s.src=local3d?'./offline-webgl.js':'./boot-classic.js';document.body.appendChild(s);})();
