#!/bin/bash

# Error handling
set -e
trap 'handle_error $LINENO' ERR

handle_error() {
  local exit_code=$?
  echo " Error occurred in build script at line $1, exit code: $exit_code"
  node -e "require('./scripts/build-logger.js').error(' Error occurred in build script at line $1, exit code: $exit_code')"
  exit $exit_code
}

# Initialize logging
node -e '
const logger = require("./scripts/build-logger.js");
logger.logBuildInfo();
logger.startTimer("Total Build Time");
'

# Log function
log() {
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] $1"
  node -e "require('./scripts/build-logger.js').log('$1')"
}

# Start build process
log " Starting build process..."

# Clean previous build
echo " Cleaning previous build..."
rm -rf dist .vercel/output

# Install Node.js dependencies
echo " Installing Node.js dependencies..."
npm ci --prefer-offline --no-audit

# Build Vue.js application
echo " Building Vue.js application..."
export NODE_ENV=production
export NODE_OPTIONS=--max-old-space-size=4096
npm run build

# Create Vercel output structure
echo " Creating Vercel output structure..."
mkdir -p .vercel/output/static
mkdir -p .vercel/output/api

# Copy Vue.js build output
echo " Copying Vue.js build output..."
cp -r dist/* .vercel/output/

# Copy API files
echo " Copying API files..."
cp -r api .vercel/output/
cp requirements.txt .vercel/output/api/

# Generate Vercel config
echo " Generating Vercel config..."
cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/wsgi.py"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/static/(.*)",
      "dest": "/static/\$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "PYTHON_VERSION": "3.8"
  }
}
EOF

# Verify output structure
echo " Verifying output structure..."
ls -la .vercel/output/
ls -la .vercel/output/api/

# Log memory usage and build info
node -e '
const logger = require("./scripts/build-logger.js");
logger.logMemoryUsage();
logger.logDiskSpace();
logger.endTimer("Total Build Time");
logger.success("Build completed successfully!");
'

# Log build size information
log " Build size information:"
du -sh dist/
du -sh .vercel/output/

# Verify key files
log " Verifying key files..."
ls -la dist/
ls -la .vercel/output/
