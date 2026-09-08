#!/bin/bash

# Deployment verification script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting deployment verification...${NC}"

# 1. Check required files
required_files=(
    "package.json"
    "next.config.mjs"
)

echo "Checking required files..."
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}Error: Required file $file not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Found $file${NC}"
done

# 2. Verify environment variables
required_env=(
    "DATABASE_URL"
)

echo "Checking environment variables..."
for env_var in "${required_env[@]}"; do
    if [ -z "${!env_var}" ]; then
        echo -e "${RED}Error: Required environment variable $env_var is not set${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Found $env_var${NC}"
done

# 3. Verify Node.js version
required_node_major="24"
current_node_major=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$current_node_major" -lt "$required_node_major" ]; then
    echo -e "${RED}Error: Node.js 24 or newer is required (found $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version verified${NC}"

# 4. Check build output structure
echo "Verifying build output..."
npm run build

if [ ! -d ".next" ]; then
    echo -e "${RED}Error: Build failed - .next directory not found${NC}"
    exit 1
fi


echo -e "${GREEN}All verification checks passed!${NC}"
exit 0
