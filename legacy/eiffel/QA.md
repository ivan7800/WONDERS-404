# QA — EIFFEL 404 v7.6.1 RC

## Cambios aplicados en esta candidata

- Alineado el segundo nivel a 115 m en Canvas, WebGL, modelo generado, modelo Blender y pruebas.
- Corregida la altura máxima del GLB Eiffel a 330 m y sincronizados los metadatos de bounds del accessor.
- Sustituidos los scripts de prueba sueltos por pruebas pytest reproducibles sobre un servidor HTTP local.
- Añadidas comprobaciones de estructura GLB, alturas de referencia, modo Canvas y arranque WebGL real en Chromium/SwiftShader.
- Añadido workflow de GitHub Actions para ejecutar las mismas comprobaciones en push, pull request o ejecución manual.
- Retiradas del ZIP las capturas antiguas generadas por pruebas anteriores para no presentarlas como evidencia actual.

## Ejecutar las pruebas

Consulta los comandos completos en el README. En resumen:

```bash
python -m pip install -r requirements-dev.txt
python -m playwright install --with-deps chromium
python -m pytest -q
```

La prueba WebGL abre la aplicación servida por HTTP, espera el mensaje de motor activo, comprueba el canvas y los controles, verifica errores JavaScript y detecta respuestas fallidas de modelos. Usa Chromium con SwiftShader: prueba el camino WebGL con renderizado por software, no una GPU física.

## Límites del resultado

- En este entorno de preparación no están instalados Playwright ni Chromium; por tanto, no se pudo ejecutar la suite de navegador aquí.
- Se verificaron con Python estándar la sintaxis JavaScript (Node), cabeceras/chunks GLB, rutas locales, alineación y bounds de los modelos.
- GitHub Actions añadida, pero aún no ejecutada. Su resultado quedará visible tras importar/subir este ZIP a un repositorio y lanzar el workflow.
- Antes de declarar la app estable, prueba también una GPU real, al menos un navegador adicional y un móvil; las pruebas automatizadas no sustituyen esa comprobación.

## Veredicto

**Candidata reforzada para que la pruebes localmente.** No certificada como release estable hasta ejecutar la suite Playwright y completar la comprobación manual en dispositivos reales.
