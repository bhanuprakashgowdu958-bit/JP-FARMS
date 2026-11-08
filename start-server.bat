@echo off
title JP Farms Dev Server
cd /d "%~dp0"
echo ===================================================
echo   JP FARMS - STARTING DEVELOPMENT SERVER
echo ===================================================
echo.
echo Launching dev server on http://localhost:3000 ...
echo (Keep this window open while browsing the website)
echo.
node scripts/dev.js
pause

