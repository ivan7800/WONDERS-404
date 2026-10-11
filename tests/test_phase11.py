from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def test_sagrada_assets_and_links():
 for name in ['js/monuments/sagrada.js','scenes/sagrada/index.html','scenes/sagrada/scene.js','scenes/sagrada/scene.css','scenes/sagrada/tour-data.js']:
  assert (ROOT/name).is_file(),name
 assert 'scenes/sagrada/index.html' in (ROOT/'app.js').read_text()
 assert '08 <small>ESCENARIOS' in (ROOT/'index.html').read_text()
def test_previous_destinations_still_linked():
 app=(ROOT/'app.js').read_text()
 for url in ['legacy/eiffel/index.html','scenes/taj/index.html','scenes/colosseum/index.html','scenes/giza/index.html','scenes/machu/index.html','scenes/petra/index.html','scenes/angkor/index.html']:
  assert url in app
