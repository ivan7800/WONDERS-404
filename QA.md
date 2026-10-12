# Informe QA — WONDERS 404 Remasterización visual, fase Eiffel

## Resiliencia ante pérdida de contexto WebGL — 12 de octubre de 2026

- Las siete escenas cancelan su `requestAnimationFrame` al recibir `webglcontextlost` y notifican que intentarán recuperarse.
- En `webglcontextrestored`, reconstruyen el renderer y sus buffers a partir de la geometría conservada; reanudan la animación si la página está visible.
- `tests/browser_smoke.py` ahora simula ambos eventos con un renderer stub y comprueba el aviso y una segunda inicialización del renderer.
- La verificación base confirma que los siete escenarios tienen ambos manejadores y la reconstrucción.
- **Pendiente:** ejecutar el smoke Playwright; aún no está instalado aquí. La simulación no prueba una recuperación real del driver/GPU.

## Comprobación manual comunicada — 12 de octubre de 2026

El usuario indicó que la prueba general en escritorio y móvil «va bien». No se registraron navegador, sistema operativo, escenas ni controles concretos; se considera un smoke test positivo informado por el usuario, no evidencia de haber completado toda la matriz de aceptación.

## Comprobación base repetible — 12 de octubre de 2026

Se añadió `python3 tests/run_core_qa.py`, una verificación sin paquetes Python de terceros (requiere Node.js para validar y ejecutar los módulos de geometría).

- Sintaxis JavaScript: **31 archivos** pasan con `node --check`.
- Geometría procedural: **7/7 modelos** generan caras y vértices finitos. Recuento: Taj 13.086 caras, Coliseo 8.703, Guiza 2.892, Machu Picchu 8.477, Petra 3.248, Angkor 7.158 y Sagrada Família 7.581.
- HTML: **9 páginas** y **33 referencias locales** resueltas.
- Eiffel: **3/3 GLB** con cabecera v2, longitud, JSON y mallas válidos.
- HTTP local: **no ejecutable en este entorno**; el sandbox bloquea la apertura de sockets (`Operation not permitted`). El mismo script lo prueba al ejecutarse localmente y reporta este bloqueo como `SKIP`.
- Pruebas pytest y navegador: **no ejecutables aquí** porque faltan `pytest`, Playwright y Chromium. No se marcan como superadas.

Este control no prueba compilación de shaders, dibujo WebGL, respuesta visual de los controles, FPS ni consumo de memoria.

## Remasterización visual — 12 de octubre de 2026

- Comprobada sintaxis de todos los módulos JavaScript.
- Ejecutadas directamente las 15 pruebas estáticas del proyecto; todas pasan. Este entorno no incluye pytest ni Playwright.
- Generados los siete modelos y comprobadas sus coordenadas finitas: Taj 13.086 caras, Coliseo 8.703, Guiza 2.892, Machu Picchu 8.477, Petra 3.248, Angkor 7.158 y Sagrada Família 7.581.
- Las cuatro paradas de Guiza tienen un foco propio interpolado. Las escenas restantes conservan su foco predeterminado.
- **Pendiente de validación visual:** recorrer las ocho experiencias con WebGL, comprobar órbita, zoom, encuadre y capturas de día y noche; revisar fluidez en Windows, Linux Mint y móvil.
- El visor Eiffel usa un motor propio. La caída a modo compatible observada en un navegador de revisión no demuestra un defecto reproducible de la aplicación; requiere prueba en un equipo con WebGL disponible.

**Fecha:** 11 de octubre de 2026. **Estado:** RC / pendientes pruebas de hardware.

## Pruebas realizadas

- Sintaxis JavaScript: `node --check` en los módulos.
- Geometrías: generación de los 7 modelos, caras válidas y coordenadas finitas.
- Integridad y empaquetado: todos los archivos disponibles y ZIP validado.
- Pruebas estáticas: `pytest` en los tests existentes y de la edición.
- Pruebas de interfaz sin red: Chromium con HTML y JavaScript inyectados (`tests/browser_smoke.py`). Verifica catálogo, búsqueda, filtros, favoritos, apertura/cierre, cuaderno, exportación y controles de los 7 escenarios con renderizador simulado.
- Servidor local: respuesta HTTP 200 de los archivos del atlas y sus escenas, sin usar un puerto fijo.
- Integridad Eiffel: comparación de hashes SHA-256 de la carpeta `legacy/eiffel/` con la versión HOTFIX anterior.

## No demostrado todavía

- Renderizado WebGL real y precisión visual de los siete escenarios: el Chromium automatizado disponible no permite crear un contexto WebGL, por lo que se sustituye **solo en tests de controles** por un renderizador simulado.
- Navegación browser→HTTP localhost: el entorno bloquea esa navegación con `ERR_BLOCKED_BY_ADMINISTRATOR`, pese a que el servidor responde correctamente mediante cliente HTTP convencional.
- FPS, RAM, temperaturas, compatibilidad con drivers/gráficas y experiencia táctil en dispositivos reales.
- Audio real y voces disponibles por navegador, que dependen del sistema operativo.
- Pruebas del visor original de Eiffel en todos los navegadores: conserva sus propios controles y dependencias incluidas.

## Lista de aceptación de la publicación

- [ ] Windows: abrir desde `.bat`, recorrer los 8 monumentos, cerrar y volver a abrir varias veces.
- [ ] Linux Mint: repetir el mismo recorrido desde `.sh`.
- [ ] Móvil: comprobar controles táctiles, paneles plegables, zoom y captura de imagen.
- [ ] Gráficos: inspeccionar día, atardecer y noche en 7 escenas; sin sombras rotas ni modelos recortados.
- [ ] Fotografías: guardar PNG de los 7 escenarios, abrir cada PNG y verificar que no está vacío.
- [ ] Audio: activar/desactivar en cada escena y comprobar que se detiene al cerrar.
- [ ] Visitas: iniciar, recorrer y detener; probar selección manual durante el tour.
- [ ] Progreso: marcar 4 paradas, regresar al atlas y confirmar persistencia tras recargar.
- [ ] Revisar diferencias tras publicar en GitHub Pages.
- [ ] Decidir licencia y documentar derechos de los recursos.

**No asignamos una calificación 9,5/10 sin estas pruebas.**
