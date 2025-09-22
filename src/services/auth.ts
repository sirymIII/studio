// src/services/auth.ts
'use server';

import admin from '@/lib/firebase-admin';

export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord.customClaims?.['admin'] === true;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return false;
  }
}
