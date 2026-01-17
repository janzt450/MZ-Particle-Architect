@echo off
setlocal
echo.
echo ============================================================
echo   MZ Particle Architect - Neocities Build Tool
echo ============================================================
echo.

:: Check if Node.js is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js/NPM not found. Please install it first.
    pause
    exit /b
)

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo [INFO] Installing project dependencies...
    call npm install
)

:: Run the build
echo.
echo [INFO] Starting build process...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Check the console output above.
    pause
    exit /b
)

echo.
echo ============================================================
echo   BUILD SUCCESSFUL!
echo ============================================================
echo.
echo   Your production-ready files are in the 'dist' folder.
echo.
echo   STEPS TO DEPLOY:
echo   1. Log in to your Neocities dashboard.
echo   2. Upload all files INSIDE the 'dist' folder to your root.
echo   3. Alternatively, use 'neocities-cli' to push the dist folder.
echo.
echo ============================================================
echo.
pause