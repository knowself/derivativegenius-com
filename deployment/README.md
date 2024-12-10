# Deployment Configuration

This directory contains the canonical deployment configuration for the Derivative Genius application.

## Structure

```
deployment/
├── README.md           # This file
├── vercel.json         # Main Vercel configuration
├── scripts/           
│   ├── build.sh        # Production build script
│   └── verify.sh       # Deployment verification script
└── config/
    ├── python.json     # Python runtime settings
    └── node.json       # Node.js runtime settings
```

## Deployment Rules

1. **Configuration Changes**
   - All deployment config changes must be made in this directory
   - Changes must be tested in preview deployment before production
   - Document all changes in CHANGELOG.md

2. **Version Control**
   - Never modify production configs directly
   - Use feature branches for config changes
   - Require review before merging config changes

3. **Testing**
   - Run verify.sh before deployment
   - Test all auth endpoints in preview deployment
   - Verify build output structure

4. **Documentation**
   - Keep README.md and _p_tech_config.md in sync
   - Document all environment variables
   - Maintain deployment troubleshooting guide

## Current Configuration

### Runtime Versions
- Python: 3.8 (Locked)
- Node.js: 20.x (Locked)
- Memory: 1024MB
- Timeout: 10s

## Deployment Steps

1. Frontend build (Vue.js)
2. Backend preparation (FastAPI)
   - Set up virtual environment: `python -m venv venv`
   - Install dependencies: `pip install -r requirements.txt`
   - Configure environment variables:

```bash
# FastAPI
PYTHONPATH=./api
DEBUG=false
ALLOWED_HOSTS=.vercel.app,localhost,127.0.0.1

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=
```

3. Static file collection
4. Output structure verification

### Required Environment Variables
```env
# Vercel
VERCEL_PROJECT_ID=
VERCEL_ORG_ID=
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Django
DJANGO_SECRET_KEY=
DJANGO_SETTINGS_MODULE=
