@echo off
REM Cedra GameFi Contract Deployment Script for Windows
REM This script compiles and publishes the contract to Cedra Network

echo 🚀 Starting Cedra GameFi Contract Deployment...

REM Check if private key is provided
if "%PRIVATE_KEY%"=="" (
    echo ❌ Error: PRIVATE_KEY environment variable is required
    echo Usage: set PRIVATE_KEY=your_private_key && deploy.bat
    exit /b 1
)

REM Check if network is provided (default to testnet)
if "%NETWORK%"=="" set NETWORK=testnet
echo 📡 Network: %NETWORK%

REM Step 1: Clean previous builds
echo 🧹 Cleaning previous builds...
if exist build rmdir /s /q build

REM Step 2: Compile the contract
echo 🔨 Compiling contract...
cedra move compile

if %errorlevel% neq 0 (
    echo ❌ Compilation failed!
    exit /b 1
)

echo ✅ Compilation successful!

REM Step 3: Run tests
echo 🧪 Running tests...
cedra move test

if %errorlevel% neq 0 (
    echo ❌ Tests failed!
    exit /b 1
)

echo ✅ All tests passed!

REM Step 4: Publish the contract
echo 📦 Publishing contract to %NETWORK%...

if "%NETWORK%"=="mainnet" (
    set NETWORK_URL=https://fullnode.mainnet.cedra.network
) else (
    set NETWORK_URL=https://fullnode.testnet.cedra.network
)

cedra move publish --private-key %PRIVATE_KEY% --url %NETWORK_URL% --assume-yes

if %errorlevel% neq 0 (
    echo ❌ Publishing failed!
    exit /b 1
)

echo 🎉 Contract published successfully!

REM Step 5: Display contract information
echo 📋 Contract Information:
echo Package Name: CedraMiniApp
echo Network: %NETWORK%
echo Modules:
echo   - cedra_gamefi::errors
echo   - cedra_gamefi::treasury
echo   - cedra_gamefi::rewards

echo ✨ Deployment completed successfully!