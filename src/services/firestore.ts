
'use client';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, getDocs, writeBatch, getCountFromServer } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import type { Destination, Hotel, UserProfile } from '@/lib/types';
import { destinationSeedData } from '@/data/destinations';
import { getUserCount } from '@/app/admin/actions';

/**
 * Seeds the destinations collection in Firestore if it's empty.
 * This is a one-time operation.
 */
async function seedDestinations(firestore: any) {
  const destinationsCol = collection(firestore, 'destinations');
  const snapshot = await getDocs(destinationsCol);

  if (snapshot.empty) {
    console.log('Destinations collection is empty. Seeding data...');
    const batch = writeBatch(firestore);
    destinationSeedData.forEach((destData) => {
      const docRef = doc(destinationsCol); // Create a new doc with a generated ID
      batch.set(docRef, destData);
    });
    await batch.commit();
    console.log('Destinations data seeded successfully.');
    return true; // Indicate that seeding happened and a refresh is needed.
  }
  return false;
}


export function useDestinations() {
  const firestore = useFirestore();
  const [refreshKey, setRefreshKey] = useState(0);
  const seedingRef = useRef(false);

  // Perform a one-time check to seed the database if necessary.
  useEffect(() => {
    if (firestore && !seedingRef.current) {
      seedingRef.current = true; // Prevents re-running
      seedDestinations(firestore).then((wasSeeded) => {
        if (wasSeeded) {
          // Force a re-fetch of the collection data after seeding.
          setRefreshKey(prev => prev + 1);
        }
      });
    }
  }, [firestore]);


  const destinationsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'destinations') : null),
    [firestore, refreshKey] // Depend on refreshKey to re-create the query
  );
  return useCollection<Destination>(destinationsQuery);
}

export function useDestination(id?: string) {
  const firestore = useFirestore();
  const destinationDoc = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'destinations', id) : null),
    [firestore, id]
  );
  return useDoc<Destination>(destinationDoc);
}


export function useHotels(destinationId?: string) {
  const firestore = useFirestore();
  const hotelsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hotels') : null), // In a real app, you might query where('destinationId', '==', destinationId)
    [firestore, destinationId]
  );
  return useCollection<Hotel>(hotelsQuery);
}

export function useUserProfile(uid?: string) {
  const firestore = useFirestore();
  const profileDoc = useMemoFirebase(
    () => (firestore && uid ? doc(firestore, 'users', uid) : null),
    [firestore, uid]
  );
  return useDoc<UserProfile>(profileDoc);
}


export function useStats() {
  const firestore = useFirestore();
  const [stats, setStats] = useState({
    destinations: 0,
    hotels: 0,
    users: 0, 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) return;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const destinationsCol = collection(firestore, 'destinations');
        const hotelsCol = collection(firestore, 'hotels');
        
        // Fetch counts from Firestore and the user count from the server action in parallel
        const [destinationsSnap, hotelsSnap, usersCount] = await Promise.all([
          getCountFromServer(destinationsCol),
          getCountFromServer(hotelsCol),
          getUserCount()
        ]);

        setStats({
          destinations: destinationsSnap.data().count,
          hotels: hotelsSnap.data().count,
          users: usersCount,
        });
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [firestore]);

  return { stats, isLoading, error };
}
