from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def test_angkor_files():
 for name in ['js/monuments/angkor.js','scenes/angkor/index.html','scenes/angkor/scene.js','scenes/angkor/tour-data.js']:
  assert (ROOT/name).is_file()
def test_angkor_linked():
 assert 'scenes/angkor/index.html' in (ROOT/'app.js').read_text()
 assert '08 <small>ESCENARIOS' in (ROOT/'index.html').read_text()
