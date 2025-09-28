
'use client';

import { z } from 'zod';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HotelSearchOutputSchema } from '@/ai/flows/hotel-schemas';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

type HotelSearchOutput = z.infer<typeof HotelSearchOutputSchema>;

export function HotelSearchResults({ results }: { results: HotelSearchOutput }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Hotel Recommendations
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                {results.searchSummary}
            </p>
        </div>

        {results.hotels && results.hotels.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.hotels.map((hotel) => (
              <Card key={hotel.hotelName} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{hotel.hotelName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {hotel.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                   <p className="text-sm text-muted-foreground flex-grow">{hotel.description}</p>
                   <Button asChild className="mt-6 w-full">
                      {/* Encode the hotel name to handle special characters in the URL */}
                      <Link href={`/book/${encodeURIComponent(hotel.hotelName)}`}>
                          Book Now
                      </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !results.searchSummary.toLowerCase().includes("ask for the city") && (
            <div className="text-center text-muted-foreground">
                <p>No hotels found for your search criteria. Try being more specific!</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
