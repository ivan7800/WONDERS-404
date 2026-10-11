from pathlib import Path
r=Path(__file__).resolve().parents[1]
model=(r/'js/monuments/taj-mahal.js').read_text()
render=(r/'js/core/renderer.js').read_text()
scene=(r/'scenes/taj/scene.js').read_text()
assert 'archFront' in model and 'Charbagh' in model
assert 'directional' in render and 'f.color.map' in render
for control in ['orbit','day','sunset','night','reset']:
 assert (f"getElementById('{control}')" in scene or control in "['day','sunset','night']" and control in scene)
assert (r/'legacy/eiffel/assets/eiffel_404.glb').exists()
print('PASS: fase 3, geometría ampliada, luz y controles declarados')
