
import admin from 'firebase-admin';
import { config } from 'dotenv';

config();

let app: admin.app.App;

const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountString) {
      throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set. Please provide it as a base64 encoded string.');
    }

    const serviceAccount = JSON.parse(Buffer.from(serviceAccountString, 'base64').toString('utf8'));

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
    return app;

  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    throw new Error(`Firebase admin initialization failed: ${error.message}`);
  }
};

export const getFirestore = () => {
  const initializedApp = initializeAdminApp();
  if (!initializedApp) {
    throw new Error("Firebase app could not be initialized.");
  }
  return admin.firestore(initializedApp);
};

export const getAuth = () => {
  const initializedApp = initializeAdminApp();
  if (!initializedApp) {
    throw new Error("Firebase app could not be initialized.");
  }
  return admin.auth(initializedApp);
};

export default initializeAdminApp;
