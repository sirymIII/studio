'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { initializeFirebase } from '@/firebase/server';
import { HotelSchema } from '@/lib/types';

export async function createOrUpdateHotel(formData: FormData) {
  const { firestore } = initializeFirebase();
  const id = formData.get('id') as string;
  const rawData = Object.fromEntries(formData.entries());

  const parseResult = HotelSchema.safeParse(rawData);

  if (!parseResult.success) {
    console.error(parseResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid data provided.' };
  }

  const data = parseResult.data;

  try {
    if (id) {
      // Update
      const docRef = firestore.collection('hotels').doc(id);
      await docRef.update(data);
    } else {
      // Create
      const docRef = await firestore.collection('hotels').add({
        ...data,
        // This is a placeholder for the image, you'd have a proper system for this
        image: { id: `hotel-new-${Date.now()}`, hint: `hotel exterior` },
      });
    }
  } catch (error) {
    console.error('Error saving hotel:', error);
    return { success: false, error: 'Failed to save hotel.' };
  }

  revalidatePath('/admin/hotels');
  redirect('/admin/hotels');
}


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
