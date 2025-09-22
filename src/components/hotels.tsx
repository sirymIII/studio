import Image from 'next/image';
import { Star } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import placeholderImages from '@/lib/placeholder-images.json';
import type { Hotel } from '@/lib/types';

export function Hotels({ hotels }: { hotels: Hotel[] }) {
  return (
    <section id="hotels" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Featured Hotels
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comfortable and affordable places to stay across Nigeria.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => {
            const img = placeholderImages.placeholderImages.find(
              (p) => p.id === hotel.image.id
            );
            return (
              <Card key={hotel.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  {img && (
                    <Image
                      src={img.imageUrl}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      data-ai-hint={img.imageHint}
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline text-lg font-bold">
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {hotel.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < hotel.rating ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold">
                      ₦{hotel.price.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                    <Button size="sm">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
