#!/bin/bash

# Exit on error
set -e

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt --no-cache-dir

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm ci --prefer-offline --no-audit

# Build Vue.js application
echo "Building Vue.js application..."
npm run build
