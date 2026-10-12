# Resultados de verificación — Definitive RC1

- **15 / 15** pruebas estáticas (`python3 -m pytest -q tests`).
- **36 / 36** rutas comprobadas desde cliente HTTP convencional: portada, JavaScript/CSS principales, escena de Eiffel, GLB y siete escenas con sus módulos.
- **8 / 8** conjuntos de controles probados en Chromium mediante inyección local de código: portada y siete escenarios. Las escenas usan **renderizador simulado** porque este Chromium no dispone de contexto WebGL.
- La interfaz del catálogo fue renderizada mediante Chromium real; captura en `docs/atlas-preview.png`.
- Versión móvil de **390 px** probada: catálogo responsive y paneles históricos/de controles plegables.
- **7 / 7** geometrías generadas con caras y coordenadas finitas.
- **27 / 27** archivos de `legacy/eiffel/` coinciden byte a byte con la base Fase 13 HOTFIX.
- **Sintaxis JS:** comprobación con `node --check` en todos los `.js` (incluidos los de Eiffel).
- **No verificado:** renderizado WebGL real de los monumentos, GPU/driver y rendimiento en dispositivos físicos; interacción del visor Eiffel en navegadores de usuario; audio real y PNG con escena renderizada.

No se considera release final certificada hasta que se complete el checklist de `QA.md` en Windows/Linux y móvil.
# Verificación de resiliencia WebGL — 12 de octubre de 2026

- Se amplió `tests/run_core_qa.py`: pasa el control estático de pérdida/restauración en **7/7 escenas**.
- Se añadió al smoke Playwright una secuencia simulada `webglcontextlost` → `webglcontextrestored`, que valida la reconstrucción del renderer.
- El test Playwright no se pudo ejecutar en este entorno (dependencia ausente). No se declara probado en navegador ni en GPU.

# Resultado QA repetible — 12 de octubre de 2026

Comando: `python3 tests/run_core_qa.py`.

- PASS: sintaxis de 31 archivos JavaScript.
- PASS: los siete modelos generan geometría válida; sus coordenadas son finitas (Taj 13.086 caras, Coliseo 8.703, Guiza 2.892, Machu Picchu 8.477, Petra 3.248, Angkor 7.158, Sagrada Família 7.581).
- PASS: nueve páginas y 33 referencias locales.
- PASS: los tres GLB de Eiffel pasan cabecera GLB 2.0, tamaño, JSON y comprobación de mallas.
- SKIP: HTTP local; el sandbox impide abrir sockets (`Operation not permitted`). El script repetirá esta parte automáticamente donde sí estén permitidos.

También pasó `python3 -m compileall -q .`.

No se ejecutaron `pytest` ni Playwright: no están instalados. Sigue pendiente comprobar las escenas renderizadas con WebGL en navegador, GPU y móvil reales; el renderizador simulado de `browser_smoke.py` no constituye evidencia visual.

