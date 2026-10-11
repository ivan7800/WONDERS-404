@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 goto use_py
where python >nul 2>nul
if not errorlevel 1 goto use_python
echo No se encuentra Python 3. Instala Python desde python.org y vuelve a ejecutar este archivo.
pause
exit /b 1

:use_py
py -3 local_server.py
goto finish

:use_python
python local_server.py

:finish
if errorlevel 1 pause
