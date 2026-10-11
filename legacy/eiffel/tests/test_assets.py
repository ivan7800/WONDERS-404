import json
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GLB_MAGIC = 0x46546C67
JSON_CHUNK = 0x4E4F534A
BIN_CHUNK = 0x004E4942


def read_glb(path: Path):
    data = path.read_bytes()
    magic, version, total_length = struct.unpack_from("<III", data, 0)
    assert magic == GLB_MAGIC
    assert version == 2
    assert total_length == len(data)

    json_length, json_type = struct.unpack_from("<II", data, 12)
    assert json_type == JSON_CHUNK
    document = json.loads(data[20 : 20 + json_length])

    bin_header = 20 + json_length
    bin_length, bin_type = struct.unpack_from("<II", data, bin_header)
    assert bin_type == BIN_CHUNK
    bin_start = bin_header + 8
    assert bin_start + bin_length == len(data)
    return data, document, bin_start


def test_all_models_have_valid_glb_chunks_and_views():
    models = sorted((ROOT / "assets").glob("*.glb"))
    assert {p.name for p in models} == {"eiffel_404.glb", "paris_city.glb", "paris_parks.glb"}
    for path in models:
        data, document, bin_start = read_glb(path)
        assert document["asset"]["version"] == "2.0"
        assert document["buffers"][0]["byteLength"] <= len(data) - bin_start
        for view in document["bufferViews"]:
            end = view.get("byteOffset", 0) + view["byteLength"]
            assert end <= document["buffers"][0]["byteLength"]


def test_eiffel_model_height_matches_published_330m_reference():
    data, document, bin_start = read_glb(ROOT / "assets" / "eiffel_404.glb")
    primitive = document["meshes"][0]["primitives"][0]
    accessor = document["accessors"][primitive["attributes"]["POSITION"]]
    view = document["bufferViews"][accessor["bufferView"]]
    assert accessor["type"] == "VEC3"
    assert accessor["componentType"] == 5126
    base = bin_start + view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    heights = [struct.unpack_from("<f", data, base + i * 12 + 4)[0] for i in range(accessor["count"])]
    assert min(heights) >= -1
    assert max(heights) <= 330
    assert max(heights) >= 329


def test_second_floor_is_consistent_at_115m():
    reference = json.loads((ROOT / "assets" / "architecture-reference.json").read_text(encoding="utf-8"))
    assert reference["official_anchors"]["second_floor_height_m"] == 115
    app_js = (ROOT / "app.js").read_text(encoding="utf-8")
    webgl_js = (ROOT / "offline-webgl.js").read_text(encoding="utf-8")
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    assert "SEGUNDO NIVEL · 115 M" in app_js
    assert "[135,57,115,276]" in webgl_js
    assert 'data-level="2"><span>02</span><b>SEGUNDO NIVEL</b><small>115 M</small>' in html
