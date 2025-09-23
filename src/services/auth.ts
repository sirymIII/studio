'use server';

import { getAuth } from '@/lib/firebase-admin';

export async function isUserAdmin(uid: string): Promise<boolean> {
  const auth = getAuth();
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord.customClaims?.['admin'] === true;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return false;
  }
}