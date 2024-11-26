# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Build Failures

#### Build Times Out
**Symptoms:**
- Build process exceeds 60 seconds
- Vercel deployment fails with timeout error

**Solutions:**
1. Check build.sh for unnecessary steps
2. Ensure NODE_OPTIONS is set correctly:
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096
   ```
3. Verify build cache is working:
   ```bash
   .vercel/cache/
   ├── python/
   └── node/
   ```

#### Python Dependencies Fail
**Symptoms:**
- pip install errors
- Missing binary dependencies

**Solutions:**
1. Check Python version matches 3.8
2. Verify requirements.txt is in root
3. Add system packages to vercel.json:
   ```json
   {
     "build": {
       "env": {
         "PYTHONPATH": "."
       }
     }
   }
   ```

### 2. Runtime Errors

#### Firebase Admin SDK Issues
**Symptoms:**
- 500 errors in auth endpoints
- Firebase initialization fails

**Solutions:**
1. Verify environment variables:
   ```bash
   FIREBASE_ADMIN_PROJECT_ID
   FIREBASE_ADMIN_PRIVATE_KEY
   FIREBASE_ADMIN_CLIENT_EMAIL
   ```
2. Check private key formatting:
   - Must include BEGIN/END tags
   - Newlines must be preserved

#### Static Files Not Found
**Symptoms:**
- 404 errors for static assets
- Missing CSS/JS files

**Solutions:**
1. Check static file collection in build.sh
2. Verify static files in output:
   ```bash
   /vercel/path0/
   ├── static/
   └── dist/
   ```

### 3. Performance Issues

#### Slow Cold Starts
**Symptoms:**
- First request takes >2 seconds
- Subsequent requests are fast

**Solutions:**
1. Implement serverless function warming
2. Check function size:
   ```bash
   du -sh api/
   ```
3. Review import optimization

#### Memory Issues
**Symptoms:**
- 500 errors under load
- Process termination

**Solutions:**
1. Check memory limits in vercel.json
2. Monitor memory usage
3. Implement cleanup in handlers

### 4. Authentication Problems

#### Session Issues
**Symptoms:**
- Users logged out unexpectedly
- Session token validation fails

**Solutions:**
1. Check session cookie settings
2. Verify CORS configuration
3. Test token verification endpoint

### 5. Deployment Verification

If verify.sh fails, check:

1. **Environment Variables**
   ```bash
   vercel env ls
   ```

2. **Build Output**
   ```bash
   vercel build --debug
   ```

3. **Endpoint Health**
   ```bash
   python3 deployment/scripts/test_endpoints.py
   ```

### 6. Rollback Process

If deployment fails:

1. List deployments:
   ```bash
   vercel ls
   ```

2. Identify last working deployment:
   ```bash
   vercel logs [deployment-url]
   ```

3. Rollback:
   ```bash
   vercel rollback
   ```

## Getting Help

1. Check Vercel deployment logs
2. Review application logs
3. Run verify.sh with --debug
4. Check GitHub Actions logs

## Prevention

1. Always run verify.sh before deploying
2. Test in preview deployment
3. Document configuration changes
4. Monitor error rates after deployment
