'use server';

import { revalidatePath } from 'next/cache';
import { initializeFirebase } from '@/firebase/server';

export async function deleteHotel(id: string) {
  const { firestore } = initializeFirebase();
  try {
    await firestore.collection('hotels').doc(id).delete();
    revalidatePath('/admin/hotels');
    return { success: true };
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return { success: false, error: 'Failed to delete hotel' };
  }
}
