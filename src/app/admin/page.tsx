'use client';
import { useStats } from '@/services/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

export default function AdminDashboard() {
  const { stats, isLoading } = useStats();

  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-8">Admin Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Destinations</CardTitle>
            <CardDescription>Number of locations managed</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-10 w-20" /> : <p className="text-4xl font-bold">{stats.destinations}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Hotels</CardTitle>
            <CardDescription>Number of hotels listed</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-10 w-20" /> : <p className="text-4xl font-bold">{stats.hotels}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">
                Registered Users
              </CardTitle>
              <CardDescription>Total users in the system</CardDescription>
            </div>
             <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-10 w-20" /> : <p className="text-4xl font-bold">{stats.users}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
