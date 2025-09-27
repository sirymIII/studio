'use server';

import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { revalidatePath } from 'next/cache';
import { initializeFirebase } from '@/firebase/server';
import { UserProfileFormSchema } from '@/lib/types';

// This server action needs to get the user's UID to update the correct document.
// In a real application, this would come from a secure, server-side session.
// For this example, we will pass it from the client, although this is not a secure pattern
// for production without server-side validation of the UID.
export async function updateUserProfile(
  data: z.infer<typeof UserProfileFormSchema>,
  uid: string
) {
  const { firestore, auth } = await initializeFirebase();

  if (!uid) {
    return { success: false, error: 'User is not authenticated.' };
  }

  const parseResult = UserProfileFormSchema.safeParse(data);

  if (!parseResult.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { fullName, ...basicInfo } = parseResult.data;

  try {
    // Update Firebase Auth profile
    await auth.updateUser(uid, {
      displayName: fullName,
    });

    // Update Firestore profile document
    const userDocRef = firestore.collection('users').doc(uid);
    await userDocRef.set({
      userId: uid,
      basicInfo: {
        ...basicInfo,
        fullName: fullName,
        email: basicInfo.email, // Ensure email is passed through
      },
    }, { merge: true }); // Use merge to avoid overwriting travelPreferences

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}
