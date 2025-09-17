import Image from 'next/image';
import {
  Heart,
  Route,
  Sparkles,
  Search,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { featuredDestinations } from '@/data/destinations';
import placeholderImages from '@/lib/placeholder-images.json';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hotels } from '@/components/hotels';
import { Chatbot } from '@/components/chatbot';

export default function Home() {
  const heroImage = placeholderImages.placeholderImages.find(
    (img) => img.id === 'hero-background'
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[400px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Discover Nigeria's Hidden Gems
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
              Your AI-powered guide to the unforgettable landscapes, cultures,
              and adventures across Nigeria.
            </p>
            <Button size="lg" className="mt-8">
              Explore Destinations
            </Button>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We make exploring Nigeria simple and personal.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-headline">
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get travel suggestions tailored to your interests and budget,
                    powered by our smart AI.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Route className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-headline">
                    Smart Route Finder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Find the best routes to your destination with detailed
                    transport options, prices, and schedules.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-headline">
                    Book with Ease
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Seamlessly book hotels and transportation for your trip, all
                    in one place.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="featured-destinations" className="bg-secondary py-16 md:py-24">
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
              {featuredDestinations.map((dest) => {
                const img = placeholderImages.placeholderImages.find(
                  (p) => p.id === dest.image.id
                );
                return (
                  <Card key={dest.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      {img && (
                        <Image
                          src={img.imageUrl}
                          alt={dest.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
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
                );
              })}
            </div>
          </div>
        </section>

        <Hotels />

        <section id="recommendations" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-secondary">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h2 className="font-headline text-3xl font-bold md:text-4xl">
                    Find Your Perfect Getaway
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Let our AI help you find the ideal destination based on your
                    preferences.
                  </p>
                  <form className="mt-8 space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="city">Your City</label>
                      <Input id="city" placeholder="e.g., Lagos" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label htmlFor="budget">Budget</label>
                        <Select>
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
                        <Select>
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
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      Get Recommendations
                    </Button>
                  </form>
                </div>
                <div className="relative hidden h-full min-h-[300px] w-full overflow-hidden rounded-r-lg md:block">
                  <Image
                    src="https://picsum.photos/seed/recommend/800/600"
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
        
        <Chatbot />

      </main>
      <Footer />
    </div>
  );
}
