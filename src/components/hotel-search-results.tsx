
'use client';

import { z } from 'zod';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HotelSearchOutputSchema } from '@/ai/flows/hotel-schemas';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type HotelSearchOutput = z.infer<typeof HotelSearchOutputSchema>;

export function HotelSearchResults({ results }: { results: HotelSearchOutput }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Search Results
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                {results.searchSummary}
            </p>
        </div>

        {results.hotels && results.hotels.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {results.hotels.map((hotel) => (
              <Card key={hotel.hotelId} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{hotel.hotelName}</CardTitle>
                  <CardDescription>Hotel ID: {hotel.hotelId}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                    <p className="font-semibold mb-2">Available Deals:</p>
                    <div className='space-y-4'>
                        {hotel.vendors.map((vendor, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center gap-4">
                                    <div>
                                        <p className="font-medium">{vendor.vendor}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Price: ${vendor.price?.toFixed(2)}
                                            {vendor.tax ? ` (+ $${vendor.tax.toFixed(2)} tax)` : ''}
                                        </p>
                                    </div>
                                    <Badge variant={vendor.price ? 'secondary' : 'outline'}>
                                        {vendor.price ? 'Available' : 'N/A'}
                                    </Badge>
                                </div>
                                {index < hotel.vendors.length - 1 && <Separator className="mt-4" />}
                           </div>
                        ))}
                    </div>
                     <Button asChild className="mt-6 w-full sm:w-auto">
                        <Link href={`/book/${hotel.hotelId}`}>
                            View Details & Book
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !results.searchSummary.toLowerCase().includes("ask for the city") && (
            <div className="text-center text-muted-foreground">
                <p>No hotels found for your search criteria.</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
