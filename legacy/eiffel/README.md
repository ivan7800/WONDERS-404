# EIFFEL 404

Experiencia web interactiva para explorar una interpretación artística 3D de la Torre Eiffel y un entorno inspirado en París.

[**Abrir demo en GitHub Pages**](https://ivan7800.github.io/EIFFEL-404/)

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-demo-2ea44f?logo=github)
![Stack](https://img.shields.io/badge/HTML-CSS-JavaScript-orange)
![Render](https://img.shields.io/badge/3D-WebGL%20%7C%20Canvas-blue)

## Estado

**Versión 7.6.1 RC — candidata a pruebas, no certificada como estable.** El proyecto ofrece un motor WebGL local y una visualización Canvas de compatibilidad. Si WebGL no está disponible, el motor muestra el modo compatible y desactiva las funciones que no puede ofrecer.

La geometría es artística y estilizada; no es fotogrametría, CAD de precisión ni un gemelo digital. La torre del modelo termina en 330 m y los niveles principales se alinean con las referencias incluidas.

## Funciones

- Rotación y zoom con ratón o pantalla táctil.
- Vista general y selección de niveles (57 m, 115 m y 276 m).
- Escenas de día, noche y ocaso.
- Modelos 3D locales de la torre, ciudad y jardines de París.
- Recorrido en ascensor, mirador y visita guiada en WebGL.
- Bruma, destellos, exposición, Cinema, modo foto y captura PNG.
- Renderizador Canvas de reserva con niveles, día/noche, giro y controles básicos.
- Sin CDN ni dependencias JavaScript remotas.

El sonido permanece desactivado en el motor WebGL local. Algunas funciones no están disponibles en el motor Canvas.

## Ejecutar en Windows

1. Descarga el ZIP con **Code → Download ZIP** y descomprímelo.
2. Instala Python 3 si todavía no está instalado.
3. Ejecuta `INICIAR_WINDOWS.bat`; el lanzador elige un puerto local disponible y abre el navegador.
4. Deja abierta la ventana del servidor mientras utilizas la aplicación. Pulsa `Ctrl+C` para detenerlo.

## Ejecutar en Linux o macOS

Desde la carpeta del proyecto, puedes iniciar el lanzador multiplataforma:

```bash
python3 local_server.py
```

Deja abierta la terminal; pulsa `Ctrl+C` para detener el servidor. Como alternativa, inicia un servidor propio:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/`. El servidor HTTP es necesario para cargar los modelos GLB; al abrir `index.html` con `file://`, la aplicación usa el Canvas de reserva.

## Controles

| Acción | Control |
|---|---|
| Girar la escena | Arrastrar con ratón o dedo |
| Acercar o alejar | Rueda del ratón o gesto de pellizco |
| Elegir nivel | Botones de nivel o teclas `1`–`4` |
| Día, noche y ocaso | Botones o teclas `D`, `N` y `O` en WebGL |
| Modo foto | Botón o tecla `P`; `Escape` para salir |
| Restablecer escena | Botón **REINICIAR** |

## Estructura

- `index.html`, `styles.css`: interfaz y estilos.
- `offline-webgl.js`: motor WebGL sin dependencias externas.
- `app.js`: motor Canvas de compatibilidad.
- `assets/*.glb`: recursos 3D locales.
- `assets/architecture-reference.json`: medidas de referencia y fuentes.
- `generate_model.py`: generador reproducible del modelo Eiffel.
- `blender/crear_torre.py`: prototipo de generación en Blender.
- `tests/`: pruebas automatizadas de assets, Canvas y WebGL.

Para regenerar la torre Eiffel con Python instala las dependencias de generación:

```bash
python -m pip install numpy trimesh
python generate_model.py
```

## Pruebas automatizadas

Requisitos: Python 3.10 o posterior.

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
python -m playwright install chromium
python -m pytest -q
```

Linux/macOS:

```bash
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
python -m playwright install --with-deps chromium
python -m pytest -q
```

Las pruebas WebGL usan Chromium con SwiftShader. Esto da cobertura automatizada del renderizador WebGL, pero no sustituye la comprobación final en una GPU física y en un móvil. El workflow de GitHub Actions ejecuta la misma suite en cada push y pull request.

Consulta [QA.md](QA.md) para el alcance y las limitaciones de las pruebas.

## Licencia y atribución

Proyecto independiente, sin afiliación con la Société d'Exploitation de la Tour Eiffel. Las marcas y el monumento pertenecen a sus titulares. Este repositorio no declara una licencia de reutilización; pide autorización al autor antes de reutilizar o redistribuir código o recursos.
