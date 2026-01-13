#!/bin/bash

# Cedra GameFi Contract Deployment Script
# This script compiles and publishes the contract to Cedra Network

echo "🚀 Starting Cedra GameFi Contract Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if private key is provided
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ Error: PRIVATE_KEY environment variable is required${NC}"
    echo "Usage: PRIVATE_KEY=your_private_key ./scripts/deploy.sh"
    exit 1
fi

# Check if network is provided (default to testnet)
NETWORK=${NETWORK:-testnet}
echo -e "${BLUE}📡 Network: $NETWORK${NC}"

# Step 1: Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf build/

# Step 2: Compile the contract
echo -e "${YELLOW}🔨 Compiling contract...${NC}"
cedra move compile

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Compilation failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Compilation successful!${NC}"

# Step 3: Run tests (optional)
echo -e "${YELLOW}🧪 Running tests...${NC}"
cedra move test

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Tests failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All tests passed!${NC}"

# Step 4: Publish the contract
echo -e "${YELLOW}📦 Publishing contract to $NETWORK...${NC}"

if [ "$NETWORK" = "mainnet" ]; then
    NETWORK_URL="https://fullnode.mainnet.cedra.network"
else
    NETWORK_URL="https://fullnode.testnet.cedra.network"
fi

cedra move publish \
    --private-key $PRIVATE_KEY \
    --url $NETWORK_URL \
    --assume-yes

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Publishing failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Contract published successfully!${NC}"

# Step 5: Get the published address
echo -e "${BLUE}📋 Contract Information:${NC}"
echo -e "${BLUE}Package Name: CedraMiniApp${NC}"
echo -e "${BLUE}Network: $NETWORK${NC}"
echo -e "${BLUE}Modules:${NC}"
echo -e "${BLUE}  - cedra_gamefi::errors${NC}"
echo -e "${BLUE}  - cedra_gamefi::treasury${NC}"
echo -e "${BLUE}  - cedra_gamefi::rewards${NC}"

echo -e "${GREEN}✨ Deployment completed successfully!${NC}"