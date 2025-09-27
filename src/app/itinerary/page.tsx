'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  aiItineraryPlanner,
  AIItineraryPlannerOutput,
} from '@/ai/flows/ai-itinerary-planner';
import { ItineraryResults } from '@/components/itinerary-results';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function ItineraryPlannerPage() {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIItineraryPlannerOutput | null>(null);
  const { toast } = useToast();

  const handleInterestChange = (value: string) => {
    setInterests(prev =>
      prev.includes(value)
        ? prev.filter(i => i !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !duration || interests.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields to generate an itinerary.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResults(null);
    try {
      const response = await aiItineraryPlanner({
        destination,
        durationDays: parseInt(duration, 10),
        interests,
      });
      setResults(response);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Error',
        description:
          'There was a problem generating your itinerary. Please try again.',
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
        <section id="planner" className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-3xl">
              <CardHeader className="text-center">
                <Wand2 className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="font-headline text-3xl font-bold md:text-4xl mt-4">
                  AI Itinerary Planner
                </CardTitle>
                <CardDescription className="text-lg">
                  Tell us about your dream trip, and we'll craft the perfect plan for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Where are you going?</Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Calabar"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                       <Label htmlFor="duration">How many days?</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="e.g., 3"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>What are your interests?</Label>
                      <Select onValueChange={handleInterestChange} disabled={isLoading}>
                         <SelectTrigger id="interests">
                            <SelectValue placeholder="Select interests" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="history">Historical Sites</SelectItem>
                           <SelectItem value="nature">Natural Beauty</SelectItem>
                           <SelectItem value="culture">Cultural Experiences</SelectItem>
                           <SelectItem value="beaches">Beaches & Relaxation</SelectItem>
                           <SelectItem value="wildlife">Wildlife & Safari</SelectItem>
                           <SelectItem value="foodie">Food & Cuisine</SelectItem>
                         </SelectContent>
                      </Select>
                       <div className="flex flex-wrap gap-2 pt-2">
                        {interests.map(interest => (
                            <span key={interest} className="text-xs bg-primary/10 text-primary-foreground p-1 px-2 rounded-full">{interest}</span>
                        ))}
                        </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Your Adventure...
                      </>
                    ) : (
                       <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate Itinerary
                       </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {isLoading && (
          <div className="container mx-auto px-4 py-16 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Our AI is crafting your personalized journey. This might take a moment...
            </p>
          </div>
        )}

        {results && <ItineraryResults results={results} />}
      </main>
      <Footer />
    </div>
  );
}
