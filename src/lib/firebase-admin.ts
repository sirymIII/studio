
import admin from 'firebase-admin';
import { config } from 'dotenv';

config();

const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(
        /\\n/g,
        '\n'
      ),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!serviceAccount.project_id) {
      throw new Error('Firebase project ID is not defined in environment variables.');
    }

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    throw error;
  }
};

export const getFirestore = () => {
  initializeAdminApp();
  return admin.firestore();
};

export const getAuth = () => {
  initializeAdminApp();
  return admin.auth();
};

export default initializeAdminApp;
