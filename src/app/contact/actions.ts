'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase/server';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function submitContactForm(data: z.infer<typeof contactFormSchema>) {
  const parseResult = contactFormSchema.safeParse(data);

  if (!parseResult.success) {
    console.error(parseResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid data provided.' };
  }

  const { firestore } = initializeFirebase();

  try {
    await firestore.collection('contact_messages').add({
      ...parseResult.data,
      createdAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return { success: false, error: 'Failed to save message to the database.' };
  }
}
