#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# 0. Ensure correct Node.js version
echo "🔍 Checking Node.js version..."
if command -v nvm &> /dev/null; then
    nvm use 20 || nvm install 20
fi

# 1. Install Python dependencies
echo "📦 Installing Python dependencies..."
if command -v python3.9 &> /dev/null; then
    # Check if pip is installed
    if ! python3.9 -m pip --version &> /dev/null; then
        echo "Installing pip for Python 3.9..."
        curl -sSL https://bootstrap.pypa.io/get-pip.py | python3.9
    fi
    python3.9 -m pip install -r requirements.txt
elif command -v python3 &> /dev/null; then
    # Check if pip is installed
    if ! python3 -m pip --version &> /dev/null; then
        echo "Installing pip for Python 3..."
        curl -sSL https://bootstrap.pypa.io/get-pip.py | python3
    fi
    python3 -m pip install -r requirements.txt
else
    echo "❌ Python 3.9 or Python 3 not found"
    exit 1
fi

# 2. Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# 3. Build Vue.js application with Tailwind
echo "🏗️ Building Vue.js application..."
export NODE_ENV=production
npm run vue-build

# 4. Collect Django static files
echo "📚 Collecting Django static files..."
export DJANGO_SETTINGS_MODULE=api.settings
python3.9 -m django collectstatic --noinput

# 5. Create Vercel output directory structure
echo "📁 Preparing deployment directory..."
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions

# 6. Copy Vue.js build to Vercel output
echo "📋 Copying Vue.js build files..."
cp -r dist/* .vercel/output/static/

# 7. Copy Django static files
echo "📋 Copying Django static files..."
cp -r staticfiles/* .vercel/output/static/

# 8. Prepare Python function
echo "🐍 Preparing Python function..."
mkdir -p .vercel/output/functions/api
cp api/wsgi.py .vercel/output/functions/api/
cp requirements.txt .vercel/output/functions/api/

# 9. Create function configuration
echo "⚙️ Creating function configuration..."
cat > .vercel/output/functions/api/config.json << EOF
{
  "runtime": "python3.9",
  "handler": "wsgi.py",
  "maxDuration": 10
}
EOF

# 10. Create Vercel build output configuration
echo "⚙️ Creating Vercel configuration..."
cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api"
    },
    {
      "src": "/admin/(.*)",
      "dest": "/api"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF

echo "✅ Build process completed!"
