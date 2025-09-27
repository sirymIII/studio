'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { initializeFirebase } from '@/firebase/server';
import type { Destination } from '@/lib/types';
import { DestinationSchema } from '@/lib/types';

export async function createOrUpdateDestination(formData: FormData) {
  const { firestore } = initializeFirebase();
  const id = formData.get('id') as string;
  const rawData = Object.fromEntries(formData.entries());

  const parseResult = DestinationSchema.safeParse(rawData);

  if (!parseResult.success) {
    // You could return the errors here to display them in the form
    console.error(parseResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid data provided.' };
  }

  const data = parseResult.data;

  try {
    if (id) {
      // Update
      const docRef = firestore.collection('destinations').doc(id);
      await docRef.update(data);
    } else {
      // Create
      // In a real app, you would add createdBy, createdAt, and a proper image ID
      const docRef = await firestore.collection('destinations').add({
        ...data,
        // This is a placeholder for the image, you'd have a proper system for this
        image: { id: `dest-new-${Date.now()}`, hint: `${data.type} landscape` },
      });
    }
  } catch (error) {
    console.error('Error saving destination:', error);
    return { success: false, error: 'Failed to save destination.' };
  }

  revalidatePath('/admin/destinations');
  redirect('/admin/destinations');
}

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
