
@echo off
setlocal
echo.
echo ============================================================
echo   MZ Particle Architect - Web Builder
echo ============================================================
echo.

:: Check if Node.js is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js/NPM not found. Please install it first.
    pause
    exit /b
)

:: Install dependencies if needed
if not exist node_modules (
    echo [INFO] Installing project dependencies...
    call npm install
)

:: Clean previous build
if exist dist (
    echo [INFO] Cleaning previous dist folder...
    rmdir /s /q dist
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
echo   Your web-ready files are in the 'dist' folder.
echo.
echo   STEPS TO DEPLOY TO NEOCITIES:
echo   1. Go to dashboard.neocities.org
echo   2. Delete existing index.html/assets if creating a fresh update.
echo   3. Drag and drop the CONTENTS of the 'dist' folder into your site root.
echo      (This includes index.html and the 'assets' folder).
echo.
echo ============================================================
echo.
pause
