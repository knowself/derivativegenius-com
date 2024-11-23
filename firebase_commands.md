# Firebase and Vercel Command Reference

## Vercel Deployment Logs
```bash
# View recent logs
vercel logs [deployment-url]

# View build logs
vercel inspect --logs [deployment-url]

# Monitor logs in real-time (legacy)
vercel logs [deployment-url] --follow

# follow logs in separate terminal
vercel logs derivativegenius-b8h3aqnbn-derivativegenius.vercel.app
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
