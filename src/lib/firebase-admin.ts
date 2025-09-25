
import admin from 'firebase-admin';
import { config } from 'dotenv';

config();

const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId) {
      throw new Error('Firebase project ID is not defined in environment variables.');
    }
    if (!privateKey) {
        throw new Error('Firebase private key is not defined in environment variables.');
    }
    if (!clientEmail) {
        throw new Error('Firebase client email is not defined in environment variables.');
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        project_id: projectId,
        private_key: privateKey.replace(/\\n/g, '\n'),
        client_email: clientEmail,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
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
