'use client';

import { DestinationsTable } from '@/components/admin/destinations-table';
import { useDestinations } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function AdminDestinationsPage() {
  const { data: destinations, isLoading } = useDestinations();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline">Destinations</h1>
          <p className="text-muted-foreground">
            View and manage all tourist destinations.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      {isLoading && <Skeleton className="h-96 w-full" />}
      {destinations && <DestinationsTable data={destinations} />}
    </div>
  );
}
