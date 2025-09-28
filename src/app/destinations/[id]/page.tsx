import { initializeFirebase } from '@/firebase/server';
import type { Destination, Hotel } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Sun,
  Mountain,
  Building2,
  Landmark,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { Hotels } from '@/components/hotels';
import { Chatbot } from '@/components/chatbot';

async function getDestination(id: string): Promise<Destination | null> {
  const { firestore } = initializeFirebase();
  try {
    const doc = await firestore.collection('destinations').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as Destination;
  } catch (error) {
    console.error(`Failed to fetch destination ${id}:`, error);
    return null;
  }
}

async function getNearbyHotels(
  destination: Destination
): Promise<Hotel[]> {
  const { firestore } = initializeFirebase();
  try {
     // In a real app, you would have a more sophisticated query,
     // perhaps based on location or an explicit link.
     // For now, we fetch a few hotels and pretend they are nearby.
    const snapshot = await firestore.collection('hotels').limit(3).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Hotel[];
  } catch (error) {
    console.error(`Failed to fetch hotels for destination ${destination.id}:`, error);
    return [];
  }
}


const TypeIcon = ({ type }: { type: string }) => {
  const lcType = type.toLowerCase();
  if (lcType.includes('natural'))
    return <Mountain className="h-5 w-5 text-primary" />;
  if (lcType.includes('historical'))
    return <Landmark className="h-5 w-5 text-primary" />;
  if (lcType.includes('cultural'))
    return <Building2 className="h-5 w-5 text-primary" />;
  return <Sun className="h-5 w-5 text-primary" />;
};

export default async function DestinationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const destination = await getDestination(params.id);

  if (!destination) {
    notFound();
  }

  const nearbyHotels = await getNearbyHotels(destination);

  const heroImage = placeholderImages.placeholderImages.find(
    (p) => p.id === destination.image.id
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[50vh] min-h-[300px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={destination.name}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
              {destination.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-lg text-primary-foreground/90">
              <MapPin className="h-5 w-5" />
              {destination.cityTown}, {destination.state}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="md:col-span-2">
                <h2 className="font-headline text-3xl font-bold">
                  About {destination.name}
                </h2>
                <div className="prose prose-lg mt-4 max-w-none text-muted-foreground">
                  <p>{destination.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-headline text-xl font-bold">
                      Trip Details
                    </h3>
                    <div className="mt-4 space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <TypeIcon type={destination.type} />
                        <span>Type: {destination.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>Stay: {destination.recommendedStayDays} Days Recommended</span>
                      </div>
                       <div className="flex items-center gap-3">
                        <Sun className="h-5 w-5 text-primary" />
                        <span>Popularity: {destination.popularityRank}/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                 <Button className="w-full" size="lg" asChild>
                    <Link href="/itinerary">Plan My Trip</Link>
                 </Button>
              </div>
            </div>
          </div>
        </section>

        {nearbyHotels.length > 0 && <Hotels hotels={nearbyHotels} />}

        <Chatbot
          destinationContext={destination.name}
          promptPlaceholder={`Ask about ${destination.name}...`}
        />
      </main>
      <Footer />
    </div>
  );
}
