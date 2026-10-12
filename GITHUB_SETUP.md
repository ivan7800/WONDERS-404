# Preparación de GitHub Pages — WONDERS 404 v0.5.1 RC

## Antes de subir

1. Descomprime el ZIP preparado. **`index.html` debe quedar en la raíz** junto a `app.js`, `styles.css` y los directorios del proyecto. No subas la carpeta contenedora como único nivel.
2. Para probarlo localmente, ejecuta `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh`.
3. Completa la lista de aceptación de `QA.md` en un navegador con WebGL y en un móvil.
4. Este paquete no incluye `LICENSE`. Puedes publicar el código sin conceder una licencia abierta. Antes de añadir MIT u otra licencia, confirma derechos sobre todo el código y recursos incluidos, especialmente Eiffel 404.

## Publicar desde una rama

1. Crea el repositorio `WONDERS-404` y sube **el contenido** del ZIP a la raíz: `index.html`, `app.js`, `styles.css`, `js/`, `scenes/` y `legacy/` deben quedar en ese nivel.
2. En **Settings → Pages**, elige **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda.
3. Espera al despliegue y abre `https://ivan7800.github.io/WONDERS-404/`.
4. Comprueba catálogo, los ocho monumentos, fotografía, sonido y cuaderno desde la URL real. Una prueba local no valida la subruta `/WONDERS-404/`.

GitHub Pages permite publicar desde la raíz de una rama o desde `/docs`. Para esta aplicación debe usarse la raíz. Consulta la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

`server.py` y los lanzadores se usan solo para pruebas locales; GitHub Pages sirve los archivos estáticos directamente.
