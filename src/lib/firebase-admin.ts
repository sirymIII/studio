import admin from 'firebase-admin';
import { config } from 'dotenv';

config();

const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(
          /\\n/g,
          '\n'
        ),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
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