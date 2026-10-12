# Estado de publicación — WONDERS 404

**Versión preparada:** v0.5.1 RC — Resiliencia WebGL  
**Estado:** candidata para validación final; todavía no es release estable.

## Prueba informada por el usuario

El usuario indicó que «va bien» después de una prueba en escritorio y móvil. Lo registro como smoke test manual positivo, sin navegador, sistema operativo, escenas ni controles concretos identificados. El checklist completo y la recuperación de contexto WebGL siguen sin evidencia detallada.

## Hecho

- Ocho destinos integrados: Eiffel mantiene su visor separado; los otros siete usan el renderer procedural compartido.
- Pasada de detalle geométrico aplicada a Guiza, Petra, Taj Mahal, Sagrada Família, Machu Picchu y Angkor Wat.
- Recuperación del contexto WebGL implementada en las siete escenas procedurales.
- QA base sin dependencias Python de terceros y `.gitignore` para mantener limpio el repositorio.
- Revisión estática: sin credenciales o secretos detectados; no se encontró `eval` ni dependencias CDN en el runtime. El almacenamiento de visitas/favoritos permanece en `localStorage`.
- Rutas relativas y referencias locales comprobadas para GitHub Pages.
- Licencia MIT añadida para el contenido original incluido en este repositorio, incluida la copia de Eiffel 404. No cambia las condiciones del repositorio independiente `EIFFEL-404`.
- Versión publicada en `ivan7800/WONDERS-404`, rama `main`.

## Pendiente para declarar la publicación lista

1. **Checklist visual detallado:** recorrer Eiffel y las siete escenas; revisar día, atardecer, noche, cámara, controles y una captura PNG por escena. Comprobar la recuperación del contexto si el navegador permite forzarla.
2. **Prueba móvil detallada:** zoom táctil, paneles, encuadre, carga y captura.
3. **Segundo sistema de escritorio**, solo si quieres validar tanto Windows como Linux Mint.
4. **Smoke test de GitHub Pages:** abrir la URL real y comprobar los ocho destinos, porque una prueba local no cubre la ruta `/WONDERS-404/`.

## Estimación restante

- Completar el checklist en escritorio y móvil: **35–50 min**.
- Smoke test de GitHub Pages: **5–10 min**.
- Segundo sistema de escritorio, si se quiere validar Windows y Linux Mint: **otros 20–30 min**.

**Total estimado desde ahora:** 40–60 min con escritorio, móvil y Pages; 60–90 min si además se valida el segundo sistema. No incluye corregir defectos visuales que aparezcan durante esas pruebas.

## Evidencia de este paquete

Ejecutar `python3 tests/run_core_qa.py`. Los resultados detallados y las limitaciones están en `QA.md` y `docs/QA_RESULTADOS.md`. Playwright/Chromium y la GPU real siguen pendientes; no se cuentan como aprobados.
