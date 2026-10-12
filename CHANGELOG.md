# Changelog — WONDERS 404

## Actualización de licencia MIT — 12 de octubre de 2026

- Añadido `LICENSE` con MIT para el código y los recursos originales distribuidos en este repositorio, incluida la copia de Eiffel 404.
- Aclarado en la documentación que esta licencia cubre la copia incluida aquí y no modifica por sí sola la licencia del repositorio independiente `EIFFEL-404`.
- Actualizadas las instrucciones de GitHub Pages y el estado de publicación tras la subida a `main`.

## Paquete GitHub v0.5.1 RC — 12 de octubre de 2026

- Revisadas y actualizadas las instrucciones para que el contenido del ZIP se coloque directamente en la raíz del repositorio.
- Alineada la versión visible de la portada con v0.5.1 RC.
- Documentado que el ZIP no lleva `LICENSE`; no se atribuyen permisos de reutilización a Eiffel 404 sin confirmación de derechos.
- El usuario informó que la prueba general en escritorio y móvil «va bien». La validación gráfica detallada y el smoke test de GitHub Pages siguen pendientes.

## Revisión de release — 12 de octubre de 2026

- Añadido `.gitignore` para artefactos Python, Playwright, sistema y editor.
- Añadido `docs/ESTADO_RELEASE.md` con gates pendientes, derechos/licencia y estimación realista de pruebas.
- Auditoría estática básica: no detectó credenciales, `eval` ni scripts/CDN externos en las páginas de ejecución. Persistencia limitada a datos locales de visitas/favoritos/descubrimientos y preferencia gráfica.
- El proyecto no se marca como release final: WebGL físico, móvil, licencia/atribución y smoke test posterior en GitHub Pages siguen pendientes.

## Resiliencia WebGL — 12 de octubre de 2026

- Las siete escenas pausan el bucle de dibujo al perderse el contexto WebGL y reconstruyen el renderizador al restaurarse.
- El test Playwright simula eventos de pérdida/restauración y comprueba que la escena reconstruye el renderizador. Pendiente de ejecutar con Playwright y Chromium instalados.
- La prueba base estática verifica que las siete escenas contienen ambos manejadores y la ruta de reconstrucción.

## QA Eiffel — 12 de octubre de 2026

- Incorporada una prueba base sin dependencias Python externas: sintaxis JS, geometría de los siete monumentos, referencias HTML, cabeceras/JSON/mallas GLB y rutas HTTP locales cuando el entorno permite abrir sockets.
- Verificada la copia aislada de Eiffel: los tres archivos GLB conservan cabecera GLB 2.0, estructura JSON y mallas.
- No se modifica el motor ni se afirma validación gráfica: el renderizado WebGL, controles en navegador y rendimiento siguen pendientes de navegador/hardware real.

## Remasterización visual — pasada 1 · 2026-10-12
- Guiza: pirámides por hiladas, variación de revestimiento, terreno continuo y Esfinge facetada; cámaras con foco propio para las cuatro paradas.
- Petra: perfil irregular de acantilado y columnata del tholos.
- Taj Mahal: minaretes ligeramente cónicos, balcones anillados y remates.
- Sagrada Família: contrafuertes laterales y remates de pináculos.
- Machu Picchu: juntas de mampostería y vanos trapezoidales en recintos y templo.
- Angkor Wat: cámaras escalonadas, vanos, coronación de torres y balaustrada de la calzada.
- El renderizador compartido admite foco opcional; el encuadre predeterminado se conserva en los escenarios restantes.
- Pasan sintaxis y pruebas estáticas. Render WebGL, rendimiento y móviles pendientes de hardware real.

## Definitive RC1 · 2026-10-11

### Fase 14 — Inmersión
- Ambiente sintetizado localmente, activable por el usuario, separado por escenario.
- Narración opcional usando síntesis de voz del navegador.
- Recorrido automático de puntos de interés e información de capítulo, con cierre al interactuar.
- Cambios suaves de luz entre día, atardecer y noche.

### Fase 15 — Taj Mahal y Coliseo
- Nuevos elementos geométricos ornamentales en los modelos, paletas y superficies estilizadas.

### Fase 16 — Guiza y Machu Picchu
- Rocas y elementos de piedra añadidos a Guiza; remates de mampostería y terrazas en Machu Picchu.

### Fase 17 — Petra y Angkor Wat
- Vetas de piedra y tallas en Petra; balaustradas y calzada de Angkor Wat.

### Fase 18 — Sagrada Família y Eiffel
- Nuevos elementos geométricos de mosaico y fachada en Sagrada Família.
- La Torre Eiffel original se conserva sin modificaciones para prevenir regresiones; participa en el catálogo y diario mejorados.

### Fase 19 — Museo interactivo
- Cuaderno de viaje local: visitas, favoritos, 4 descubrimientos por destino, nota desbloqueable y exportación JSON.

### Fase 20 — Interfaz, optimización, móvil
- Nuevo atlas adaptable con filtros, búsqueda, tarjetas por destino, progreso, modalidades gráficas y paneles móviles plegables.
- Render con límite de densidad de píxeles configurable y carga diferida por iframe.

### Fase 21 — Auditoría
- Pruebas automáticas de estructura y controles, revisión de geometrías y rutas.
- Se documenta la limitación para pruebas WebGL y de navegación en el entorno actual.

## Base anterior

- Fase 13 hotfix: puerto local dinámico para evitar HTTP 404 cuando el puerto 8000 estaba ocupado.
- Fases 1–13: ocho destinos y dos remasterizaciones geométricas iniciales.
# Piloto visual Guiza — 2026-10-12

- Reconstruidas las tres pirámides con hiladas subdivididas, variación de piedra y restos de revestimiento.
- Remodelada la Esfinge con cuerpo y cabeza facetados, patas y tocado diferenciados.
- Terreno continuo de mayor resolución, calzada y restos perimetrales.
- Las cuatro paradas del recorrido enfocan ahora el monumento elegido; el renderizador admite un foco opcional sin cambiar las cámaras de los demás escenarios.
- Comprobadas sintaxis, coordenadas finitas y 15 pruebas estáticas. Render WebGL visual, FPS y móviles pendientes de prueba en hardware real.

# Remasterización visual — pasada 1 — 2026-10-12

- Guiza: pirámides por hiladas, variación de revestimiento, terreno continuo y Esfinge facetada; cámaras enfocadas para las cuatro paradas.
- Petra: perfil irregular de acantilado y columnata del tholos.
- Taj Mahal: minaretes con ligera conicidad, balcones anillados y remates.
- Sagrada Família: contrafuertes laterales y remates de pináculos.
- Machu Picchu: juntas de mampostería y vanos trapezoidales en recintos y templo.
- Angkor Wat: cámaras escalonadas, vanos, coronación de torres y balaustrada de la calzada.
- El renderizador compartido admite foco de cámara opcional; las escenas no modificadas conservan su encuadre.
- Pruebas estáticas y sintaxis pasan. Falta validación visual y de rendimiento con WebGL en hardware real.


