#!/bin/bash

# Error handling
set -e

# Simple logging function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Start build process
log "Starting build process..."

# Clean previous build
log "Cleaning previous build..."
rm -rf dist .vercel/output

# Install Node.js dependencies
log "Installing Node.js dependencies..."
npm ci --prefer-offline --no-audit

# Install Python dependencies
log "Installing Python dependencies..."
pip install -r requirements.txt
pip install -r requirements-base.txt

# Build Vue.js application
log "Building Vue.js application..."
export NODE_ENV=production
export NODE_OPTIONS=--max-old-space-size=4096
npm run vue-build

# Create Vercel output structure
log "Creating Vercel output structure..."
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/api

# Copy Vue.js build output
log "Copying Vue.js build output..."
cp -r dist/* .vercel/output/static/

# Copy API files
log "Copying API files..."
cp -r api/* .vercel/output/functions/api/
cp requirements.txt requirements-base.txt .vercel/output/functions/api/

# Create Vercel config
log "Creating Vercel config..."
cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/\$1" },
    { "src": "/static/(.*)", "dest": "/static/\$1" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/static/index.html" }
  ]
}
EOF

log "Build completed successfully!"
