@echo off
REM Cedra GameFi Contract Initialization Script for Windows
REM This script initializes the Treasury and Rewards modules after deployment

echo 🔧 Starting Contract Initialization...

REM Check required environment variables
if "%PRIVATE_KEY%"=="" (
    echo ❌ Error: PRIVATE_KEY environment variable is required
    exit /b 1
)

if "%CONTRACT_ADDRESS%"=="" (
    echo ❌ Error: CONTRACT_ADDRESS environment variable is required
    exit /b 1
)

if "%SERVER_PUBLIC_KEY%"=="" (
    echo ❌ Error: SERVER_PUBLIC_KEY environment variable is required
    exit /b 1
)

REM Default values
if "%NETWORK%"=="" set NETWORK=testnet
if "%TREASURY_SEED%"=="" set TREASURY_SEED=cedra_gamefi_treasury_v1

echo 📡 Network: %NETWORK%
echo 📦 Contract Address: %CONTRACT_ADDRESS%

REM Set network URL
if "%NETWORK%"=="mainnet" (
    set NETWORK_URL=https://fullnode.mainnet.cedra.network
) else (
    set NETWORK_URL=https://fullnode.testnet.cedra.network
)

REM Step 1: Initialize Treasury
echo 🏦 Initializing Treasury...

cedra move run --function-id %CONTRACT_ADDRESS%::treasury::initialize --args string:"%TREASURY_SEED%" --private-key %PRIVATE_KEY% --url %NETWORK_URL% --assume-yes

if %errorlevel% neq 0 (
    echo ❌ Treasury initialization failed!
    exit /b 1
)

echo ✅ Treasury initialized successfully!

REM Step 2: Initialize Rewards
echo 🎁 Initializing Rewards...

cedra move run --function-id %CONTRACT_ADDRESS%::rewards::initialize --args hex:"%SERVER_PUBLIC_KEY%" --private-key %PRIVATE_KEY% --url %NETWORK_URL% --assume-yes

if %errorlevel% neq 0 (
    echo ❌ Rewards initialization failed!
    exit /b 1
)

echo ✅ Rewards initialized successfully!

REM Step 3: Deposit initial funds (optional)
if not "%INITIAL_DEPOSIT%"=="" (
    echo 💰 Depositing initial funds: %INITIAL_DEPOSIT% CEDRA...
    
    cedra move run --function-id %CONTRACT_ADDRESS%::treasury::deposit --args u64:%INITIAL_DEPOSIT% --private-key %PRIVATE_KEY% --url %NETWORK_URL% --assume-yes
    
    if %errorlevel% equ 0 (
        echo ✅ Initial deposit successful!
    ) else (
        echo ⚠️ Initial deposit failed (optional step)
    )
)

echo 🎉 Contract initialization completed!
echo 📋 Summary:
echo   - Treasury: Initialized
echo   - Rewards: Initialized
echo   - Server Public Key: Set
if not "%INITIAL_DEPOSIT%"=="" echo   - Initial Deposit: %INITIAL_DEPOSIT% CEDRA