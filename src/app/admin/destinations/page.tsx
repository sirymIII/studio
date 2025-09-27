'use client';

import { DestinationsTable } from '@/components/admin/destinations-table';
import { useDestinations } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDestinationsPage() {
  const { data: destinations, isLoading } = useDestinations();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Destinations</h1>
        <p className="text-muted-foreground">
          View and manage all tourist destinations.
        </p>
      </div>

      {isLoading && <Skeleton className="h-96 w-full" />}
      {destinations && <DestinationsTable data={destinations} />}
    </div>
  );
}
