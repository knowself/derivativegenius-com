#!/bin/bash

# Error handling
set -e
trap 'handle_error $LINENO' ERR

handle_error() {
  local exit_code=$1
  local error_msg=" Error occurred in build script at line $1, exit code: $exit_code"
  echo "$error_msg"
  node -e "require('./scripts/build-logger.js').error('$error_msg')"
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
log " Cleaning previous build..."
rm -rf dist .vercel/output

# Check Node.js version
log " Checking Node.js version..."
command -v nvm >/dev/null 2>&1 || { echo "nvm not found"; }
node -v

# Install Python dependencies
log " Installing Python dependencies..."
command -v python3.8 >/dev/null 2>&1 || { echo "python3.8 not found"; exit 1; }
python3.8 -m pip --version >/dev/null 2>&1 || { echo "pip not found"; exit 1; }
python3.8 -m pip install -r requirements.txt

# Install Node.js dependencies
log " Installing Node.js dependencies..."
npm ci --prefer-offline --no-audit

# Build Vue.js application
log " Building Vue.js application..."
export NODE_ENV=production
export NODE_OPTIONS=--max-old-space-size=4096
npm run vue-build

# Ensure static directory exists
log " Ensuring static directory exists..."
mkdir -p dist/static

# Copy static assets
log " Copying static assets..."
cp -r public/images dist/static/
cp public/favicon.ico dist/

# Collect Django static files
log " Collecting Django static files..."
export DJANGO_SETTINGS_MODULE=api.settings
python3.8 -m django collectstatic --noinput

# Copy Django static files if they exist
if [ -d staticfiles ]; then
  log " Copying Django static files..."
  cp -r staticfiles/admin staticfiles/favicon.ico staticfiles/images staticfiles/index.html dist/static/
fi

# Prepare deployment directory
log " Preparing deployment directory..."
mkdir -p .vercel/output/static
mkdir -p .vercel/output/api

# Copy build artifacts
log " Copying build artifacts..."
cp -r dist/favicon.ico dist/images dist/index.html dist/static .vercel/output/
cp -r api .vercel/output/
cp requirements.txt .vercel/output/api/

# Generate build output config
log " Generating build output config..."
cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/wsgi.py"
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
