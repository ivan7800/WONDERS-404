# Informe QA — WONDERS 404 Definitive RC1

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
