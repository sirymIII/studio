'use server';

import type { Destination, Hotel } from '@/lib/types';
import admin from '@/lib/firebase-admin';
import { featuredDestinations } from '@/data/destinations';
import { featuredHotels } from '@/data/hotels';

const db = admin.firestore();

export async function getDestinations(): Promise<Destination[]> {
  try {
    const destinationsRef = db.collection('destinations');
    const snapshot = await destinationsRef.get();

    if (snapshot.empty) {
      // If the collection is empty, seed it with initial data
      console.log('Destinations collection is empty. Seeding data...');
      const batch = db.batch();
      featuredDestinations.forEach(dest => {
        const docRef = db.collection('destinations').doc(dest.id);
        batch.set(docRef, dest);
      });
      await batch.commit();
      console.log('Destinations seeded successfully.');
      return featuredDestinations;
    }

    const destinations: Destination[] = [];
    snapshot.forEach(doc => {
      destinations.push(doc.data() as Destination);
    });
    return destinations;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    // Fallback to static data in case of an error
    return featuredDestinations;
  }
}

export async function getHotels(): Promise<Hotel[]> {
  try {
    const hotelsRef = db.collection('hotels');
    const snapshot = await hotelsRef.get();

     if (snapshot.empty) {
      // If the collection is empty, seed it with initial data
      console.log('Hotels collection is empty. Seeding data...');
      const batch = db.batch();
      featuredHotels.forEach(hotel => {
        const docRef = db.collection('hotels').doc(hotel.id);
        batch.set(docRef, hotel);
      });
      await batch.commit();
      console.log('Hotels seeded successfully.');
      return featuredHotels;
    }

    const hotels: Hotel[] = [];
    snapshot.forEach(doc => {
      hotels.push(doc.data() as Hotel);
    });
    return hotels;
  } catch (error) {
    console.error('Error fetching hotels:', error);
     // Fallback to static data in case of an error
    return featuredHotels;
  }
}

export async function getStats() {
    try {
        const destinationsSnap = await db.collection('destinations').count().get();
        const hotelsSnap = await db.collection('hotels').count().get();
        const usersSnap = await admin.auth().listUsers();

        return {
            destinations: destinationsSnap.data().count,
            hotels: hotelsSnap.data().count,
            users: usersSnap.users.length,
        }
    } catch (error) {
        console.error("Error fetching stats: ", error);
        return {
            destinations: 0,
            hotels: 0,
            users: 0,
        }
    }
}
