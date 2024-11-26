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
    "deployment/vercel.json"
    "package.json"
    "requirements.txt"
    "api/wsgi.py"
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
    "VERCEL_PROJECT_ID"
    "VERCEL_ORG_ID"
    "FIREBASE_ADMIN_PROJECT_ID"
    "FIREBASE_ADMIN_PRIVATE_KEY"
    "FIREBASE_ADMIN_CLIENT_EMAIL"
    "DJANGO_SECRET_KEY"
    "DJANGO_SETTINGS_MODULE"
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
required_node="20"
current_node=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$current_node" != "$required_node" ]; then
    echo -e "${RED}Error: Node.js version must be 20.x (found $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version verified${NC}"

# 4. Verify Python version
required_python="3.8"
current_python=$(python3 -c 'import platform; print(platform.python_version())' | cut -d. -f1,2)
if [ "$current_python" != "$required_python" ]; then
    echo -e "${RED}Error: Python version must be 3.8.x (found $current_python)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python version verified${NC}"

# 5. Check build output structure
echo "Verifying build output..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed - dist directory not found${NC}"
    exit 1
fi

# 6. Verify API endpoints
echo "Testing API endpoints..."
if ! python3 deployment/scripts/test_endpoints.py; then
    echo -e "${RED}Error: API endpoint verification failed${NC}"
    exit 1
fi

echo -e "${GREEN}All verification checks passed!${NC}"
exit 0
