@echo off
echo =========================================
echo       Starting GigShield AI Demo
echo =========================================
echo.
echo Make sure you have a local instance of MongoDB running!
echo.
echo Starting Backend (Express/Node.js) on port 5000...
start cd backend ^&^& node server.js

echo Starting Frontend (Vite/React) on port 5173...
start cd frontend ^&^& npm run dev

echo.
echo Both servers have been launched in new windows.
echo Once the Vite server is ready, open http://localhost:5173 in your browser.
echo.
pause
