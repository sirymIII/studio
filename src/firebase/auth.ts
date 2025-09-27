'use client';
import { Auth, sendPasswordResetEmail } from 'firebase/auth';

/**
 * Sends a password reset email to the given email address.
 * @param authInstance The Firebase Auth instance.
 * @param email The user's email address.
 */
export async function handlePasswordReset(authInstance: Auth, email: string) {
  await sendPasswordResetEmail(authInstance, email);
}
