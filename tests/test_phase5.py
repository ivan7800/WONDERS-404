from pathlib import Path
import hashlib,zipfile
root=Path(__file__).resolve().parents[1]
assert (root/'js/core/renderer.js').exists()
model=(root/'js/monuments/taj-mahal.js').read_text()
renderer=(root/'js/core/renderer.js').read_text()
assert 'for(let i=0;i<80;i++)' in model and 'uClock' in renderer
assert 'WONDERS 404' in (root/'README.md').read_text()
print('OK: estructura y mejoras fase 5')
