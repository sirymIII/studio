'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Destination, Hotel } from '@/lib/types';

export function useDestinations() {
  const firestore = useFirestore();
  const destinationsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'destinations') : null),
    [firestore]
  );
  return useCollection<Destination>(destinationsQuery);
}

export function useHotels() {
  const firestore = useFirestore();
  const hotelsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hotels') : null),
    [firestore]
  );
  return useCollection<Hotel>(hotelsQuery);
}

export function useStats() {
  const firestore = useFirestore();
  const [stats, setStats] = useState({
    destinations: 0,
    hotels: 0,
    users: 0, // Users count from auth is not directly available on client, needs a secure backend call.
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
        
        const destinationsSnap = await getCountFromServer(destinationsCol);
        const hotelsSnap = await getCountFromServer(hotelsCol);

        setStats({
          destinations: destinationsSnap.data().count,
          hotels: hotelsSnap.data().count,
          users: 0, // Placeholder
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
