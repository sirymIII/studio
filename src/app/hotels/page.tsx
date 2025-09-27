'use client';

import { useState } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { searchHotelsFlow, HotelSearchOutputSchema } from '@/ai/flows/hotel-search';
import { HotelSearchResults } from '@/components/hotel-search-results';
import { z } from 'zod';

type HotelSearchOutput = z.infer<typeof HotelSearchOutputSchema>;

export default function HotelsPage() {
  const [city, setCity] = useState('');
  const [searchResults, setSearchResults] = useState<HotelSearchOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;

    setIsLoading(true);
    setSearchResults(null);
    setError(null);

    try {
      const results = await searchHotelsFlow({ query: `Find hotels in ${city}` });
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching for hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-3xl">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Search for Hotels</CardTitle>
                <CardDescription>
                  Enter a city to find the best hotel deals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    id="city"
                    placeholder="e.g., Lagos"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="sr-only sm:not-sr-only sm:ml-2">Search</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {isLoading && (
           <div className="container mx-auto px-4 py-16 text-center">
             <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
             <p className="mt-4 text-muted-foreground">Searching for hotels in {city}...</p>
           </div>
        )}

        {error && (
          <div className="container mx-auto px-4 py-16 text-center text-destructive">
            <p>{error}</p>
          </div>
        )}

        {searchResults && (
            <HotelSearchResults results={searchResults} />
        )}

      </main>
      <Footer />
    </div>
  );
}
