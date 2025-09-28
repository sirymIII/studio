
'use client';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, getCountFromServer } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Destination, Hotel, UserProfile } from '@/lib/types';
import { getUserCount } from '@/app/admin/actions';


export function useDestinations() {
  const firestore = useFirestore();
  const destinationsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'destinations') : null),
    [firestore]
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
