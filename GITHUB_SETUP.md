# Preparación de GitHub Pages — WONDERS 404

1. **Validar primero en local** con `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh`.
2. Confirmar **renderizado WebGL y controles** en Chromium/Firefox/Safari y un móvil real. Ver checklist de `QA.md`.
3. Decidir la **licencia** del proyecto, incluida la copia incorporada de EIFFEL 404, antes de indicar que es código abierto.
4. Crear el repositorio `WONDERS-404` en GitHub y subir el contenido de esta carpeta a la raíz, incluyendo `index.html` y los directorios `js/`, `scenes/` y `legacy/`.
5. En **Settings → Pages**, configurar Deploy from a branch → `main` → `/ (root)` y guardar.
6. Esperar al despliegue y abrir `https://ivan7800.github.io/WONDERS-404/`.
7. Probar el catálogo, cada monumento, fotografía, sonido y el diario también desde la URL real; evita dar por hecho que una prueba local valida GitHub Pages.

**No hace falta un servidor Python en GitHub Pages.** `server.py` y los lanzadores sirven para pruebas locales.

Para la publicación final conviene añadir capturas verificadas de la experiencia real y un README con créditos/licencias de todos los recursos utilizados.
