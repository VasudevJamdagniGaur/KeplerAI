@echo off
echo Starting KeplerAI Application...
echo.

echo Starting Flask Backend Server...
start "Flask Backend" cmd /k "cd /d %~dp0backend && py app.py"

timeout /t 3 /nobreak >nul

echo Starting React Frontend Server...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both servers are starting...
echo.
echo React Frontend will be available at: http://localhost:3000
echo Flask Backend will be available at: http://localhost:5000
echo.
echo Press any key to exit this window...
pause >nul
