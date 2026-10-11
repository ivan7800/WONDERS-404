from pathlib import Path
import hashlib
root=Path(__file__).resolve().parents[1]
for p in ['scenes/colosseum/index.html','scenes/colosseum/scene.css','scenes/colosseum/scene.js','scenes/colosseum/tour-data.js','js/monuments/colosseum.js']:
 assert (root/p).is_file(),p
assert 'scenes/colosseum/index.html' in (root/'app.js').read_text()
assert 'colosseum()' in (root/'scenes/colosseum/scene.js').read_text()
assert (root/'legacy/eiffel/index.html').is_file()
print('PASS: Coliseo, rutas y copia Eiffel')
