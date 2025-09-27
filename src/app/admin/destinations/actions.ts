'use server';

import { revalidatePath } from 'next/cache';
import { initializeFirebase } from '@/firebase/server';

export async function deleteDestination(id: string) {
  const { firestore } = initializeFirebase();
  try {
    await firestore.collection('destinations').doc(id).delete();
    revalidatePath('/admin/destinations'); // Revalidate the page to show updated data
    return { success: true };
  } catch (error) {
    console.error('Error deleting destination:', error);
    return { success: false, error: 'Failed to delete destination' };
  }
}
