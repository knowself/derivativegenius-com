# Firebase Cloud Functions Setup Guide

## Setting up Firebase Functions with Secret Manager

This guide documents our learnings from implementing Firebase Cloud Functions (v2) with Google Cloud Secret Manager.

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project initialized
- Google Cloud project linked to Firebase project
- `firebase-admin` and `firebase-functions` packages installed

### Important Notes About Secret Manager

1. **Service Account Permissions**
   - The Cloud Function's service account MUST have the "Secret Manager Secret Accessor" role
   - Grant this at: Google Cloud Console -> IAM & Admin -> IAM
   - Role name: `roles/secretmanager.secretAccessor`

2. **Creating Secrets**
   ```bash
   # Create a secret
   gcloud secrets create SECRET_NAME
   
   # Add a version to the secret
   echo -n "secret-value" | gcloud secrets versions add SECRET_NAME --data-file=-
   ```

3. **⚠️ Critical Gmail App Password Requirements**
   - When using Gmail SMTP, the App Password MUST NOT contain any spaces
   - If copying from Gmail's generated App Password, remove ALL spaces
   - Failing to remove spaces will cause authentication failures without clear error messages

### Firebase Function V2 Implementation

1. **Import Statements**
   ```javascript
   const { onRequest } = require('firebase-functions/v2/https');
   const { defineSecret } = require('firebase-functions/params');
   ```

2. **Define Secrets**
   ```javascript
   // Always specify the version ('v1' is default)
   const MY_SECRET = defineSecret('MY_SECRET', 'v1');
   ```

3. **Function Configuration**
   ```javascript
   exports.myFunction = onRequest({
     region: 'us-west1',
     memory: '256MiB',
     timeoutSeconds: 60,
     secrets: [MY_SECRET1, MY_SECRET2]  // List all required secrets
   }, async (req, res) => {
     // Access secrets using .value()
     const secretValue = MY_SECRET1.value();
   });
   ```

### Deployment Steps

1. **Deploy Function**
   ```bash
   firebase deploy --only functions:functionName
   ```

2. **View Logs**
   ```bash
   firebase functions:log
   ```

### Troubleshooting

1. **Secret Access Issues**
   - Error: "Permission denied on secret"
   - Solution: Check service account permissions in IAM

2. **SMTP Authentication Failures**
   - Check for spaces in App Password
   - Verify correct email and App Password combination
   - Ensure 2FA is enabled on Gmail account

3. **Deployment Failures**
   - Verify all secrets exist in Secret Manager
   - Check function has access to all required secrets
   - Confirm region settings match project configuration

### Best Practices

1. **Error Handling**
   ```javascript
   try {
     // Your code
   } catch (error) {
     logger.error('Descriptive error message:', error);
     throw new Error('User-friendly error message');
   }
   ```

2. **Logging**
   ```javascript
   const { logger } = require('firebase-functions');
   logger.info('Operation successful', { additionalData });
   ```

3. **Rate Limiting**
   - Implement rate limiting using Firestore timestamps
   - Example: Limit requests per IP or email within time window

### Resources

- [Firebase Functions V2 Documentation](https://firebase.google.com/docs/functions)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
