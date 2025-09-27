'use client';

import { HotelsTable } from '@/components/admin/hotels-table';
import { useHotels } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminHotelsPage() {
  const { data: hotels, isLoading } = useHotels();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Hotels</h1>
        <p className="text-muted-foreground">
          View and manage all hotel listings.
        </p>
      </div>

      {isLoading && <Skeleton className="h-96 w-full" />}
      {hotels && <HotelsTable data={hotels} />}
    </div>
  );
}
