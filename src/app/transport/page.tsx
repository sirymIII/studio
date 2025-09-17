'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  aiRoutePlanning,
  AIRoutePlanningOutput,
} from '@/ai/flows/ai-route-planning';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Loader2, Bus, Train, Plane, Car } from 'lucide-react';

export default function TransportPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [routes, setRoutes] = useState<AIRoutePlanningOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRoutes(null);
    try {
      const result = await aiRoutePlanning({
        origin,
        destination,
        budget: budget ? parseInt(budget) : undefined,
      });
      setRoutes(result);
    } catch (error) {
      console.error('Error planning route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'bus':
        return <Bus className="h-6 w-6 text-primary" />;
      case 'train':
        return <Train className="h-6 w-6 text-primary" />;
      case 'flight':
        return <Plane className="h-6 w-6 text-primary" />;
      case 'driving':
        return <Car className="h-6 w-6 text-primary" />;
      default:
        return <Car className="h-6 w-6 text-primary" />;
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
                <CardTitle className="font-headline text-3xl">
                  Find Your Route
                </CardTitle>
                <CardDescription>
                  Enter your travel details to find the best transport options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="origin">Origin</Label>
                      <Input
                        id="origin"
                        placeholder="e.g., Lagos"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Abuja"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 10000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Search Routes'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {routes && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-center font-headline text-3xl font-bold">
                Available Routes
              </h2>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {routes.routes.map((route, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        {getIcon(route.mode)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {route.provider}
                        </CardTitle>
                        <CardDescription>
                          {route.departurePoint} to {route.arrivalPoint}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{route.routeDetail}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold">Duration</p>
                          <p>{route.durationMinutes} mins</p>
                        </div>
                        <div>
                          <p className="font-semibold">Price</p>
                          <p>₦{route.priceEstimate.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Schedule</p>
                          <p>{route.schedule}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Contact</p>
                          <p>{route.contact}</p>
                        </div>
                      </div>
                      {route.notes && (
                        <p className="text-xs text-muted-foreground">
                          Note: {route.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
