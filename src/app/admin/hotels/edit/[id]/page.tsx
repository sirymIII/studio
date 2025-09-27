import { HotelForm } from '@/components/admin/hotel-form';
import { initializeFirebase } from '@/firebase/server';
import type { Hotel } from '@/lib/types';
import { notFound } from 'next/navigation';

async function getHotel(id: string): Promise<Hotel | null> {
  const { firestore } = initializeFirebase();
  const doc = await firestore.collection('hotels').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() } as Hotel;
}

export default async function EditHotelPage({
  params,
}: {
  params: { id: string };
}) {
  const hotel = await getHotel(params.id);

  if (!hotel) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Edit Hotel</h1>
        <p className="text-muted-foreground">
          Modify the details for {hotel.name}.
        </p>
      </div>
      <HotelForm hotel={hotel} />
    </div>
  );
}
