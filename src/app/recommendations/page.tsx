'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function RecommendationsPage() {
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] =
    useState<PersonalizedDestinationRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const handlePreferenceChange = (value: string) => {
    setPreferences(prev =>
      prev.includes(value)
        ? prev.filter(i => i !== value)
        : [...prev, value]
    );
  };

  const removePreference = (preferenceToRemove: string) => {
    setPreferences(prev => prev.filter(p => p !== preferenceToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !budget) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your city and budget to get recommendations.',
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
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
                        <label htmlFor="interests">Interests (Optional)</label>
                         <Select onValueChange={handlePreferenceChange} value="" disabled={isLoading}>
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

                    {preferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {preferences.map(preference => (
                          <Badge key={preference} variant="secondary" className="pl-3 pr-1">
                            {preference}
                            <button
                              onClick={() => removePreference(preference)}
                              className="ml-1 rounded-full hover:bg-black/10 p-0.5"
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

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
