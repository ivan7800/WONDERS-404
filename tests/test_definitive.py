from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
SCENES=['taj','colosseum','giza','machu','petra','angkor','sagrada']

def test_core_modules_and_styles():
    for part in ['app.js','styles.css','server.py','js/core/renderer.js','js/core/ambient.js','js/core/experience.js','js/core/experience.css']:
        assert (ROOT/part).is_file(),part

def test_seven_experience_integrations():
    for scene in SCENES:
        text=(ROOT/'scenes'/scene/'index.html').read_text(encoding='utf-8')
        assert f'data-monument="{scene}"' in text
        assert '../../js/core/experience.js' in text
        assert '../../js/core/experience.css' in text
        assert (ROOT/'scenes'/scene/'tour-data.js').exists()

def test_static_html_references():
    for doc in [ROOT/'index.html',*(ROOT/'scenes'/s/'index.html' for s in SCENES)]:
        text=doc.read_text(encoding='utf-8')
        for reference in re.findall(r'\b(?:src|href)=["\']([^"\']+)["\']',text):
            if reference.startswith(('#','http:','https:','data:','mailto:','about:')):
                continue
            target=(doc.parent/reference).resolve()
            assert target.is_dir() if reference in ('./','.') else target.is_file(),(doc,reference)

def test_eiffel_preserved_and_assets():
    assert (ROOT/'legacy/eiffel/assets/eiffel_404.glb').is_file()
    # Original engine and its fallback are kept separate from shared renderer.
    for name in ['three-app.js','offline-webgl.js','boot.js','index.html']:
        assert (ROOT/'legacy/eiffel'/name).is_file()

def test_atlas_controls_are_functional():
    code=(ROOT/'app.js').read_text(encoding='utf-8')
    for name in ['search','favorite','journal','exportJournal','resetJournal','closeScene','message']:
        assert name in code
    assert 'localStorage.setItem' in code and 'window.addEventListener(\'message\'' in code

def test_scene_quality_and_sound():
    renderer=(ROOT/'js/core/renderer.js').read_text(encoding='utf-8')
    assert 'preserveDrawingBuffer:true' in renderer
    assert 'const dprLimit=' in renderer
    assert 'previousPalette' in renderer
    experience=(ROOT/'js/core/experience.js').read_text(encoding='utf-8')
    for method in ['AmbientSound','quality','secretNote','onPoint','stopTour','SpeechSynthesisUtterance','postMessage']:
        assert method in experience

def test_github_pages_paths():
    text=(ROOT/'app.js').read_text(encoding='utf-8')
    assert 'legacy/eiffel/index.html' in text
    for scene in SCENES:
        assert f'scenes/{scene}/index.html' in text
    assert not (ROOT/'service-worker.js').exists()
