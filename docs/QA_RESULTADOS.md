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
