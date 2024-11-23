#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# 0. Ensure correct Node.js version
echo "🔍 Checking Node.js version..."
if command -v nvm &> /dev/null; then
    nvm use 18 || nvm install 18
fi

# 1. Install Python dependencies
echo "📦 Installing Python dependencies..."
python -m pip install -r requirements.txt

# 2. Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm ci || npm install

# 3. Build Vue.js application with Tailwind
echo "🏗️ Building Vue.js application..."
export NODE_ENV=production
npm run vue-build

# 4. Collect Django static files
echo "📚 Collecting Django static files..."
python manage.py collectstatic --noinput

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
