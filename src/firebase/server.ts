'use server';

import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import 'server-only';

let adminApp: App | null = null;
let adminAuth: ReturnType<typeof getAuth> | null = null;
let adminFirestore: ReturnType<typeof getFirestore> | null = null;

function initializeAdminApp() {
  if (getApps().length > 0) {
    adminApp = getApps()[0];
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  }

  if (adminApp) {
    adminAuth = getAuth(adminApp);
    adminFirestore = getFirestore(adminApp);
  }
}

initializeAdminApp();

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export async function initializeFirebase() {
  if (!adminApp || !adminAuth || !adminFirestore) {
    // This can happen if the service account key is not set.
    // Handle this case gracefully, perhaps by throwing a more specific error
    // or ensuring this function is only called where the admin app is guaranteed to be initialized.
    console.error("Firebase Admin SDK has not been initialized. Make sure FIREBASE_SERVICE_ACCOUNT_KEY is set.");
    // Returning nulls or throwing an error, depending on desired behavior.
    // For now, let's throw to make the issue explicit.
    throw new Error("Firebase Admin SDK not initialized.");
  }
  return {
    app: adminApp,
    auth: adminAuth,
    firestore: adminFirestore,
  };
}
