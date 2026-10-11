from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
SCENES=['taj','colosseum','giza','machu','petra','angkor','sagrada']
def test_all_scenes_exist():
    app=(ROOT/'app.js').read_text()
    for scene in SCENES:
        assert (ROOT/'scenes'/scene/'index.html').is_file()
        assert (ROOT/'scenes'/scene/'scene.js').is_file()
        assert f"scenes/{scene}/index.html" in app

def test_scene_scripts_reference_working_imports():
    for scene in SCENES:
        script=ROOT/'scenes'/scene/'scene.js'
        text=script.read_text()
        for rel in re.findall(r"from ['\"]([^'\"]+)['\"]",text):
            assert (script.parent/rel).resolve().is_file(),(scene,rel)

def test_accessibility_and_unload():
    app=(ROOT/'app.js').read_text()
    assert "about:blank" in app and "previousFocus.focus()" in app
    for scene in SCENES:
        assert 'webglcontextlost' in (ROOT/'scenes'/scene/'scene.js').read_text()
