from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def test_remaster_present():
    taj=(ROOT/'js/monuments/taj-mahal.js').read_text()
    col=(ROOT/'js/monuments/colosseum.js').read_text()
    assert 'Fase 13' in taj and 'Fase 13' in col
    for name in ('taj','colosseum'):
        s=(ROOT/f'scenes/{name}/scene.js').read_text()
        assert 'sunset' in s and 'night' in s and 'const presets=' in s
