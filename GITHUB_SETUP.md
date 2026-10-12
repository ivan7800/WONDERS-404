# GitHub Pages — WONDERS 404 v0.5.1 RC

El contenido ya está publicado en [`ivan7800/WONDERS-404`](https://github.com/ivan7800/WONDERS-404), rama `main`.

## Comprobación local

1. Descomprime el ZIP preparado. **`index.html` debe quedar en la raíz** junto a `app.js`, `styles.css` y los directorios del proyecto. No subas la carpeta contenedora como único nivel.
2. Para probarlo localmente, ejecuta `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh`.
3. Completa la lista de aceptación de `QA.md` en un navegador con WebGL y en un móvil.
4. El proyecto se publica bajo la licencia MIT de `LICENSE`. La copia de Eiffel 404 que va dentro de este repositorio queda cubierta por esa licencia; el repositorio independiente `EIFFEL-404` mantiene condiciones separadas.

## Activar o comprobar Pages

1. En **Settings → Pages**, elige **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda si Pages aún no está activado.
2. Abre `https://ivan7800.github.io/WONDERS-404/`.
3. Comprueba catálogo, los ocho monumentos, fotografía, sonido y cuaderno desde la URL real. Una prueba local no valida la subruta `/WONDERS-404/`.

GitHub Pages permite publicar desde la raíz de una rama o desde `/docs`. Para esta aplicación debe usarse la raíz. Consulta la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

`server.py` y los lanzadores se usan solo para pruebas locales; GitHub Pages sirve los archivos estáticos directamente.
