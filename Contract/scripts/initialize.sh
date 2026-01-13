#!/bin/bash

# Cedra GameFi Contract Initialization Script
# This script initializes the Treasury and Rewards modules after deployment

echo "🔧 Starting Contract Initialization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check required environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ Error: PRIVATE_KEY environment variable is required${NC}"
    exit 1
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}❌ Error: CONTRACT_ADDRESS environment variable is required${NC}"
    exit 1
fi

if [ -z "$SERVER_PUBLIC_KEY" ]; then
    echo -e "${RED}❌ Error: SERVER_PUBLIC_KEY environment variable is required${NC}"
    exit 1
fi

# Default values
NETWORK=${NETWORK:-testnet}
TREASURY_SEED=${TREASURY_SEED:-"cedra_gamefi_treasury_v1"}

echo -e "${BLUE}📡 Network: $NETWORK${NC}"
echo -e "${BLUE}📦 Contract Address: $CONTRACT_ADDRESS${NC}"

# Set network URL
if [ "$NETWORK" = "mainnet" ]; then
    NETWORK_URL="https://fullnode.mainnet.cedra.network"
else
    NETWORK_URL="https://fullnode.testnet.cedra.network"
fi

# Step 1: Initialize Treasury
echo -e "${YELLOW}🏦 Initializing Treasury...${NC}"

cedra move run \
    --function-id ${CONTRACT_ADDRESS}::treasury::initialize \
    --args string:"$TREASURY_SEED" \
    --private-key $PRIVATE_KEY \
    --url $NETWORK_URL \
    --assume-yes

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Treasury initialization failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Treasury initialized successfully!${NC}"

# Step 2: Initialize Rewards
echo -e "${YELLOW}🎁 Initializing Rewards...${NC}"

cedra move run \
    --function-id ${CONTRACT_ADDRESS}::rewards::initialize \
    --args hex:"$SERVER_PUBLIC_KEY" \
    --private-key $PRIVATE_KEY \
    --url $NETWORK_URL \
    --assume-yes

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Rewards initialization failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Rewards initialized successfully!${NC}"

# Step 3: Deposit initial funds (optional)
if [ ! -z "$INITIAL_DEPOSIT" ]; then
    echo -e "${YELLOW}💰 Depositing initial funds: $INITIAL_DEPOSIT CEDRA...${NC}"
    
    cedra move run \
        --function-id ${CONTRACT_ADDRESS}::treasury::deposit \
        --args u64:$INITIAL_DEPOSIT \
        --private-key $PRIVATE_KEY \
        --url $NETWORK_URL \
        --assume-yes
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Initial deposit successful!${NC}"
    else
        echo -e "${YELLOW}⚠️ Initial deposit failed (optional step)${NC}"
    fi
fi

echo -e "${GREEN}🎉 Contract initialization completed!${NC}"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "${BLUE}  - Treasury: Initialized${NC}"
echo -e "${BLUE}  - Rewards: Initialized${NC}"
echo -e "${BLUE}  - Server Public Key: Set${NC}"
if [ ! -z "$INITIAL_DEPOSIT" ]; then
    echo -e "${BLUE}  - Initial Deposit: $INITIAL_DEPOSIT CEDRA${NC}"
fi