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

## Pendiente para declarar la publicación lista

1. **Checklist visual detallado:** recorrer Eiffel y las siete escenas; revisar día, atardecer, noche, cámara, controles y una captura PNG por escena. Comprobar la recuperación del contexto si el navegador permite forzarla.
2. **Prueba móvil detallada:** zoom táctil, paneles, encuadre, carga y captura.
3. **Segundo sistema de escritorio**, solo si quieres validar tanto Windows como Linux Mint.
4. **Licencia y créditos:** decidir qué licencia autoriza el proyecto y confirmar que también cubre el código/recursos incluidos de Eiffel 404. No se debe añadir una licencia abierta hasta aclarar ese alcance.
5. **Smoke test de GitHub Pages:** después de subir, abrir la URL real y comprobar los ocho destinos, porque una prueba local no cubre la ruta `/WONDERS-404/`.

## Estimación restante

- Completar el checklist en un escritorio: **20–30 min**.
- Completar el checklist móvil: **10–15 min**.
- Segundo escritorio, si se quiere validar ambos sistemas: **otros 20–30 min**.
- Licencia/créditos y smoke test tras publicación: **15–30 min**, según los derechos confirmados y el tiempo de despliegue.

**Total estimado desde ahora:** 45–75 min si se completa el checklist en un escritorio y móvil; 65–105 min si además se valida el segundo sistema. No incluye corregir defectos visuales que aparezcan durante esas pruebas.

## Evidencia de este paquete

Ejecutar `python3 tests/run_core_qa.py`. Los resultados detallados y las limitaciones están en `QA.md` y `docs/QA_RESULTADOS.md`. Playwright/Chromium y la GPU real siguen pendientes; no se cuentan como aprobados.
