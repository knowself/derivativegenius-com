#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# 0. Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "🔄 Activating virtual environment..."
    source venv/bin/activate
fi

# 1. Install Python dependencies
echo "📦 Installing Python dependencies..."
python -m pip install -r requirements.txt

# 2. Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# 3. Build Vue.js application
echo "🏗️ Building Vue.js application..."
npm run build

# 4. Collect Django static files
echo "📚 Collecting Django static files..."
python manage.py collectstatic --noinput

# 5. Create Vercel output directory
echo "📁 Preparing deployment directory..."
mkdir -p .vercel/output/static

# 6. Copy Vue.js build to Vercel output
echo "📋 Copying Vue.js build files..."
cp -r dist/* .vercel/output/static/

# 7. Copy Django static files
echo "📋 Copying Django static files..."
cp -r staticfiles/* .vercel/output/static/

# 8. Create Vercel configuration
echo "⚙️ Creating Vercel configuration..."
cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/wsgi.py"
    },
    {
      "src": "/admin/(.*)",
      "dest": "/api/wsgi.py"
    },
    {
      "src": "/static/(.*)",
      "dest": "/static/\$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/static/index.html"
    }
  ]
}
EOF

echo "✅ Build completed successfully!"
