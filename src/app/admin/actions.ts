'use server';

import { initializeFirebase } from '@/firebase/server';

/**
 * Gets the total number of registered users from Firebase Authentication.
 * This is a privileged operation and must only be run on the server.
 * @returns {Promise<number>} The total number of users.
 */
export async function getUserCount(): Promise<number> {
  try {
    const { auth } = await initializeFirebase();
    // listUsers() retrieves a page of users. We can get the total count
    // by fetching all users. We can set a limit up to 1000.
    const userRecords = await auth.listUsers(1000);
    // The total number of users is the length of the users array.
    return userRecords.users.length;
  } catch (error) {
    console.error('Error fetching user count:', error);
    // In case of an error, we return 0. A more robust implementation might
    // handle this differently, but for a dashboard stat, this is a safe fallback.
    return 0;
  }
}
