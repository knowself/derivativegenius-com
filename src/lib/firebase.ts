import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

function initFirebaseAdmin() {
  if (admin.apps.length > 0) return admin;

  const credPath = process.env.FIREBASE_CREDENTIALS_PATH || path.join(process.cwd(), 'api', 'firebase-credentials.json');

  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp();
    } else if (fs.existsSync(/*turbopackIgnore: true*/ credPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ credPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    } else {
      // Fallback to default initialize (may throw later when used)
      admin.initializeApp();
    }
  } catch (e) {
    if (!admin.apps.length) throw e;
  }

  return admin;
}

export function getFirebaseAdmin() {
  return initFirebaseAdmin();
}

export function getFirestore() {
  return initFirebaseAdmin().firestore();
}

export function getAuth() {
  return initFirebaseAdmin().auth();
}

export default initFirebaseAdmin;
