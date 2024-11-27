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

# Install Python dependencies
echo " Installing Python dependencies..."
pip install -r requirements.txt

# Build Vue.js application
echo " Building Vue.js application..."
export NODE_ENV=production
export NODE_OPTIONS=--max-old-space-size=4096
npm run vue-build

# Create Vercel output structure
echo " Creating Vercel output structure..."
mkdir -p .vercel/output/static
mkdir -p .vercel/output/api

# Copy Vue.js build output
echo " Copying Vue.js build output..."
cp -r dist/* .vercel/output/static/

# Copy Django files
echo " Copying Django files..."
mkdir -p .vercel/output/api/django
cp -r api/* .vercel/output/api/django/
cp requirements.txt .vercel/output/api/

# Create Vercel config
echo " Creating Vercel config..."
cat > .vercel/output/config.json << EOF
{
  "version": 2,
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/django/wsgi.py" },
    { "src": "/admin/(.*)", "dest": "/api/django/wsgi.py" },
    { "src": "/static/(.*)", "dest": "/static/\$1" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/static/index.html" }
  ]
}
EOF

# Log build completion
log " Build completed successfully!"
node -e 'require("./scripts/build-logger.js").endTimer("Total Build Time")'
