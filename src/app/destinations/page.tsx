'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { useDestinations } from '@/services/firestore';
import placeholderImages from '@/lib/placeholder-images.json';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function DestinationsPage() {
  const { data: featuredDestinations, isLoading } = useDestinations();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section id="featured-destinations" className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Featured Destinations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get inspired by some of Nigeria's most breathtaking spots.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
              {featuredDestinations?.map((dest) => {
                const img = placeholderImages.placeholderImages.find(
                  (p) => p.id === dest.image.id
                );
                return (
                   <Link key={dest.id} href={`/destinations/${dest.id}`} className="group">
                    <Card className="overflow-hidden h-full">
                      <div className="relative h-48 w-full">
                        {img && (
                          <Image
                            src={img.imageUrl}
                            alt={dest.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={img.imageHint}
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-headline text-lg font-bold">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dest.state}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
