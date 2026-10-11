from pathlib import Path
import hashlib
root=Path(__file__).resolve().parents[1]
for filename in ['index.html','app.js','styles.css','scenes/taj/index.html','scenes/taj/scene.js','scenes/taj/scene.css','js/core/renderer.js','js/monuments/taj-mahal.js','legacy/eiffel/index.html']:
    assert (root/filename).is_file(),filename
assert '../../js/core/renderer.js' in (root/'scenes/taj/scene.js').read_text()
assert 'scenes/taj/index.html' in (root/'app.js').read_text()
assert 'legacy/eiffel/index.html' in (root/'app.js').read_text()
print('PASS: estructura, rutas de escenas y archivos principales')
