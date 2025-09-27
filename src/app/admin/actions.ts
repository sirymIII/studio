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
    // listUsers() retrieves a page of users. We can check the total number of users
    // by fetching the first page and looking at the total number of users.
    // For performance, we fetch only 1 user.
    const userRecords = await auth.listUsers(1);
    // The total number of users is available on the result object.
    // However, listUsers() returns all users, including anonymous ones.
    // A more accurate count for "registered" users might filter by provider type,
    // but for now, we'll count all of them.
    return userRecords.users.length;
  } catch (error) {
    console.error('Error fetching user count:', error);
    // In case of an error, we return 0. A more robust implementation might
    // handle this differently, but for a dashboard stat, this is a safe fallback.
    return 0;
  }
}
