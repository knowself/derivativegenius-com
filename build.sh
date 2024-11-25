#!/bin/bash

# Exit on error and enable debug output
set -e
set -x

# Function to log with timestamp and send to build logger
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    node -e "require('./scripts/build-logger.js').log('$1')"
}

# Function to handle errors
handle_error() {
    local exit_code=$?
    local error_msg="❌ Error occurred in build script at line $1, exit code: $exit_code"
    echo "$error_msg"
    node -e "require('./scripts/build-logger.js').error('$error_msg')"
    exit $exit_code
}

# Set error handler
trap 'handle_error $LINENO' ERR

# Start build logging
node -e "
const logger = require('./scripts/build-logger.js');
logger.logBuildInfo();
logger.startTimer('Total Build Time');
"

log "🚀 Starting build process..."

# Clean previous build
log "🧹 Cleaning previous build..."
rm -rf dist .vercel/output || true

# 0. Ensure correct Node.js version
log "🔍 Checking Node.js version..."
if command -v nvm &> /dev/null; then
    nvm use 20 || nvm install 20
fi
node -v

# 1. Install Python dependencies
log "📦 Installing Python dependencies..."
if command -v python3.8 &> /dev/null; then
    # Check if pip is installed
    if ! python3.8 -m pip --version &> /dev/null; then
        log "Installing pip for Python 3.8..."
        curl -sSL https://bootstrap.pypa.io/get-pip.py | python3.8
    fi
    python3.8 -m pip install -r requirements.txt
elif command -v python3 &> /dev/null; then
    # Check if pip is installed
    if ! python3 -m pip --version &> /dev/null; then
        log "Installing pip for Python 3..."
        curl -sSL https://bootstrap.pypa.io/get-pip.py | python3
    fi
    python3 -m pip install -r requirements.txt
else
    log "❌ Python 3.8 or Python 3 not found"
    exit 1
fi

# 2. Install Node.js dependencies
log "📦 Installing Node.js dependencies..."
npm ci --prefer-offline --no-audit

# 3. Build Vue.js application with Tailwind
log "🏗️ Building Vue.js application..."
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"
npm run vue-build

# Ensure static directory exists
log "📁 Ensuring static directory exists..."
mkdir -p dist/static

# Copy static assets
log "📦 Copying static assets..."
cp -r public/images dist/static/ 2>/dev/null || true
cp public/favicon.ico dist/ 2>/dev/null || true

# 4. Collect Django static files
log "📚 Collecting Django static files..."
export DJANGO_SETTINGS_MODULE=api.settings
python3.8 -m django collectstatic --noinput

# Copy Django static files if they exist
if [ -d "staticfiles" ]; then
  log "📦 Copying Django static files..."
  cp -r staticfiles/* dist/static/ 2>/dev/null || true
fi

# 5. Create Vercel output directory structure
log "📁 Preparing deployment directory..."
mkdir -p .vercel/output/static

# 6. Copy build artifacts
log "📦 Copying build artifacts..."
cp -r dist/* .vercel/output/
cp -r staticfiles/* .vercel/output/static/ || log "⚠️ Warning: No staticfiles to copy"

# 7. Generate build output configuration
log "⚙️ Generating build output config..."
cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/api/.*", "dest": "api/wsgi.py" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "PYTHON_VERSION": "3.8"
  }
}
EOF

# Output build statistics
node -e "
const logger = require('./scripts/build-logger.js');
logger.logMemoryUsage();
logger.logDiskSpace();
logger.endTimer('Total Build Time');
logger.success('Build completed successfully!');
"

# Output build size information
log "📊 Build size information:"
du -sh dist/
du -sh .vercel/output/

# List key files to verify
log "📋 Verifying key files..."
ls -la dist/
ls -la .vercel/output/
