from pathlib import Path
import hashlib
r=Path(__file__).resolve().parents[1]
for p in ['scenes/machu/index.html','scenes/machu/scene.css','scenes/machu/scene.js','scenes/machu/tour-data.js','js/monuments/machu.js']:
 assert (r/p).is_file(),p
a=(r/'app.js').read_text();assert 'scenes/machu/index.html' in a
assert 'machu()' in (r/'scenes/machu/scene.js').read_text()
assert len(list((r/'scenes').glob('*/index.html'))) >=4
print('PASS fase 8: Machu, rutas, escenas')
