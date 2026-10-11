@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
    py -3 "%~dp0server.py"
    goto :end
)
where python >nul 2>nul
if not errorlevel 1 (
    python "%~dp0server.py"
    goto :end
)
echo ERROR: Instala Python 3 y vuelve a ejecutar el lanzador.
pause
:end
if errorlevel 1 pause
