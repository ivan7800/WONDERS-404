#!/usr/bin/env python3
"""Dependency-free baseline QA for WONDERS 404 (Python + Node.js required)."""
from __future__ import annotations

import json
import pathlib
import re
import shutil
import subprocess
import sys
import threading
import urllib.request
from http.server import ThreadingHTTPServer

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCENES = {
    "taj": ("taj-mahal.js", "tajMahal"),
    "colosseum": ("colosseum.js", "colosseum"),
    "giza": ("giza.js", "giza"),
    "machu": ("machu.js", "machu"),
    "petra": ("petra.js", "petra"),
    "angkor": ("angkor.js", "angkor"),
    "sagrada": ("sagrada.js", "sagrada"),
}


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def check_javascript() -> None:
    node = shutil.which("node")
    check(node is not None, "Node.js is required for JavaScript syntax checks")
    files = sorted(ROOT.rglob("*.js"))
    for path in files:
        result = subprocess.run([node, "--check", str(path)], capture_output=True, text=True)
        check(result.returncode == 0, f"JS syntax failed: {path.relative_to(ROOT)}\n{result.stderr}")
    print(f"PASS JS syntax: {len(files)} files")


def check_geometry() -> None:
    node = shutil.which("node")
    modules = []
    for scene, (filename, function) in SCENES.items():
        source = (ROOT / "js/monuments" / filename).read_text(encoding="utf-8")
        encoded = __import__("base64").b64encode(source.encode()).decode()
        modules.append(f"{{scene:{json.dumps(scene)},fn:{json.dumps(function)},src:{json.dumps(encoded)}}}")
    script = r"""
const items = [__ITEMS__];
for (const item of items) {
  const source = Buffer.from(item.src, 'base64').toString('utf8');
  const module = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  const faces = module[item.fn]();
  if (!Array.isArray(faces) || faces.length < 100) throw Error(`${item.scene}: modelo vacío`);
  let vertices = 0;
  for (const face of faces) {
    if (!Array.isArray(face.vertices) || face.vertices.length < 3) throw Error(`${item.scene}: cara inválida`);
    for (const vertex of face.vertices) {
      if (!Array.isArray(vertex) || vertex.length !== 3 || vertex.some(n => !Number.isFinite(n)))
        throw Error(`${item.scene}: coordenada inválida`);
      vertices++;
    }
  }
  console.log(`PASS ${item.scene}: ${faces.length} caras, ${vertices} vértices finitos`);
}
""".replace("__ITEMS__", ",".join(modules))
    result = subprocess.run([node, "--input-type=module", "-e", script], cwd=ROOT, capture_output=True, text=True)
    check(result.returncode == 0, f"Geometría JS falló:\n{result.stdout}{result.stderr}")
    print(result.stdout, end="")


def check_local_http() -> None:
    # Reuse the project's handler without launching a browser or opening a tab.
    sys.path.insert(0, str(ROOT))
    import server  # noqa: PLC0415

    try:
        httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
    except OSError as error:
        if error.errno in (1, 13, 10013):
            print(f"SKIP HTTP local: el entorno bloquea la apertura de sockets ({error})")
            return
        raise
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{httpd.server_port}"
    paths = ["/index.html", "/app.js", "/styles.css", "/js/core/renderer.js"]
    for scene in SCENES:
        paths.extend((f"/scenes/{scene}/index.html", f"/scenes/{scene}/scene.js", f"/scenes/{scene}/tour-data.js"))
    paths.extend(("/legacy/eiffel/index.html", "/legacy/eiffel/boot-local.js",
                  "/legacy/eiffel/offline-webgl.js", "/legacy/eiffel/assets/eiffel_404.glb",
                  "/legacy/eiffel/assets/paris_city.glb", "/legacy/eiffel/assets/paris_parks.glb"))
    try:
        for path in paths:
            with urllib.request.urlopen(base + path, timeout=4) as response:
                check(response.status == 200, f"HTTP {response.status}: {path}")
                check(response.read(1) != b"", f"Recurso vacío: {path}")
    finally:
        httpd.shutdown()
        httpd.server_close()
        thread.join(timeout=2)
    print(f"PASS HTTP local: {len(paths)} rutas del atlas y Eiffel")


def check_glb() -> None:
    import struct

    for path in sorted((ROOT / "legacy/eiffel/assets").glob("*.glb")):
        raw = path.read_bytes()
        check(len(raw) >= 20, f"GLB truncado: {path.name}")
        magic, version, total, json_length, json_type = struct.unpack_from("<IIIII", raw)
        check(magic == 0x46546C67 and version == 2, f"Cabecera GLB inválida: {path.name}")
        check(total == len(raw) and json_type == 0x4E4F534A, f"Longitud/chunk JSON inválido: {path.name}")
        document = json.loads(raw[20:20 + json_length].decode("utf-8").rstrip(" \t\r\n\0"))
        check(document.get("asset", {}).get("version") == "2.0", f"Asset GLB no es 2.0: {path.name}")
        check(document.get("meshes"), f"GLB sin mallas: {path.name}")
    check(len(list((ROOT / "legacy/eiffel/assets").glob("*.glb"))) == 3, "Se esperaban los 3 modelos GLB de Eiffel")
    print("PASS GLB Eiffel: 3 modelos, cabeceras y chunks JSON válidos")


def check_html_references() -> None:
    documents = [ROOT / "index.html", *(ROOT / "scenes" / scene / "index.html" for scene in SCENES), ROOT / "legacy/eiffel/index.html"]
    count = 0
    for document in documents:
        source = document.read_text(encoding="utf-8")
        for reference in re.findall(r"\b(?:src|href)=[\"']([^\"']+)", source):
            if reference.startswith(("#", "http:", "https:", "data:", "mailto:", "about:")):
                continue
            target = (document.parent / reference.split("?", 1)[0]).resolve()
            check(target.is_dir() if reference in ("./", ".") else target.is_file(),
                  f"Referencia HTML rota: {document.relative_to(ROOT)} -> {reference}")
            count += 1
    print(f"PASS HTML: {len(documents)} páginas, {count} referencias locales")


def check_context_recovery() -> None:
    for scene in SCENES:
        source = (ROOT / "scenes" / scene / "scene.js").read_text(encoding="utf-8")
        check("webglcontextlost" in source and "webglcontextrestored" in source,
              f"Falta gestión de pérdida/restauración WebGL: {scene}")
        check("renderer=createRenderer(canvas,geometry)" in source,
              f"No se reconstruye el renderizador tras restaurar WebGL: {scene}")
    print("PASS WebGL context lifecycle: 7/7 escenas con reconstrucción tras restauración")


def main() -> int:
    try:
        check_javascript()
        check_geometry()
        check_html_references()
        check_context_recovery()
        check_glb()
        check_local_http()
    except Exception as error:  # produce one useful failure in shells and CI
        print(f"FAIL {error}", file=sys.stderr)
        return 1
    print("PASS QA base completada. Esto no sustituye la prueba visual WebGL en navegador.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
