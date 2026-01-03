@echo off
echo 🎮 Cedra Quest - Auto Deploy Script
echo ==================================

echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    pause
    exit /b 1
)

echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [SUCCESS] Requirements check passed

echo [INFO] Installing backend dependencies...
npm install

echo [INFO] Building backend...
npm run build

echo [INFO] Setting up database...
npx prisma generate
npx prisma db push
npm run prisma:seed

echo [SUCCESS] Backend setup completed!

echo.
echo Next steps:
echo 1. Update .env with your actual values
echo 2. Deploy backend: railway up (after installing Railway CLI)
echo 3. Create frontend: Follow QUICK_START.md
echo 4. Configure Telegram bot with @BotFather
echo.

pause