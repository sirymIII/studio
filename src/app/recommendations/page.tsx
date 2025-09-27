'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  personalizedDestinationRecommendations,
  PersonalizedDestinationRecommendationsOutput,
} from '@/ai/flows/personalized-destination-recommendations';
import { RecommendationResults } from '@/components/recommendation-results';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RecommendationsPage() {
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] =
    useState<PersonalizedDestinationRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !budget || !preferences) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields to get recommendations.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResults(null);
    try {
      const response = await personalizedDestinationRecommendations({
        city,
        budget,
        preferences,
      });
      setResults(response);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: 'Error',
        description:
          'There was a problem getting your recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section id="recommendations" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-muted">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h2 className="font-headline text-3xl font-bold md:text-4xl">
                    Find Your Perfect Getaway
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Let our AI help you find the ideal destination based on your
                    preferences.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="city">Your City</label>
                      <Input
                        id="city"
                        placeholder="e.g., Lagos"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label htmlFor="budget">Budget</label>
                        <Select
                          onValueChange={setBudget}
                          value={budget}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="budget">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="interests">Interests</label>
                        <Select
                          onValueChange={setPreferences}
                          value={preferences}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="interests">
                            <SelectValue placeholder="Select interests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="history">
                              Historical Sites
                            </SelectItem>
                            <SelectItem value="nature">
                              Natural Beauty
                            </SelectItem>
                            <SelectItem value="culture">
                              Cultural Experiences
                            </SelectItem>
                             <SelectItem value="beaches">
                              Beaches
                            </SelectItem>
                             <SelectItem value="wildlife">
                              Wildlife
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        'Get Recommendations'
                      )}
                    </Button>
                  </form>
                </div>
                <div className="relative hidden h-full min-h-[300px] w-full overflow-hidden rounded-r-lg md:block">
                  <Image
                    src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=800&auto=format&fit=crop"
                    alt="Map of Nigeria"
                    fill
                    className="object-cover"
                    data-ai-hint="nigeria map"
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {isLoading && (
          <div className="container mx-auto px-4 py-16 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Our AI is crafting your personalized recommendations...
            </p>
          </div>
        )}

        {results && <RecommendationResults results={results} />}
      </main>
      <Footer />
    </div>
  );
}
