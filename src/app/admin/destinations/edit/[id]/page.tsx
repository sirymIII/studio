import { DestinationForm } from '@/components/admin/destination-form';
import { initializeFirebase } from '@/firebase/server';
import type { Destination } from '@/lib/types';
import { notFound } from 'next/navigation';

async function getDestination(id: string): Promise<Destination | null> {
  const { firestore } = initializeFirebase();
  const doc = await firestore.collection('destinations').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() } as Destination;
}

export default async function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const destination = await getDestination(params.id);

  if (!destination) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Edit Destination</h1>
        <p className="text-muted-foreground">
          Modify the details for {destination.name}.
        </p>
      </div>
      <DestinationForm destination={destination} />
    </div>
  );
}
