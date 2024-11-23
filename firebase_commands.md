# Firebase and Vercel Command Reference

## Vercel Deployment Logs
```bash
# View logs for production URL - This works
vercel logs https://derivativegenius-com.vercel.app

# View logs for specific deployment
vercel logs derivativegenius-dhy7sedpa-derivativegenius.vercel.app

# View build logs (more detailed)
vercel inspect --logs derivativegenius-dhy7sedpa-derivativegenius.vercel.app

# Alternative: View logs by project name
vercel logs derivativegenius-com
```

## Environment Variables
```bash
# List all environment variables
vercel env ls

# Add new environment variable
vercel env add [name]

# Remove environment variable
vercel env rm [name]

# Pull environment variables locally
vercel env pull
```

## Firebase Admin SDK
```bash
# Format private key for Vercel
python3 format_key.py

# Verify environment variables
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
# Don't echo private key in terminal
```

## Deployment
```bash
# Deploy to production
vercel deploy --prod

# Deploy to preview
vercel deploy

# Remove deployment
vercel remove [deployment-name]
```

## Useful Flags
- `--prod`: Deploy to production
- `--force`: Force a new deployment
- `--yes`: Skip confirmation step
- `--debug`: Show debug information

## Common Issues
1. Private Key Format
   - Ensure proper PEM format
   - Check for correct newlines
   - Verify no extra quotes

2. Environment Variables
   - Must be set in all environments
   - Case sensitive
   - No spaces in values
