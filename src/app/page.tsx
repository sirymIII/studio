'use client';
import Image from 'next/image';
import { Heart, Route, Sparkles, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hotels } from '@/components/hotels';
import Link from 'next/link';
import { useHotels } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Chatbot } from '@/components/chatbot';

export default function Home() {
  const { data: hotels, isLoading } = useHotels();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 h-[50vh] min-h-[350px] flex flex-col items-center justify-center text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Discover Nigeria's Hidden Gems
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
              Your AI-powered guide to the unforgettable landscapes, cultures,
              and adventures across Nigeria.
            </p>
            <Button size="lg" className="mt-8" variant="secondary" asChild>
              <Link href="/destinations">Explore Destinations</Link>
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

        {isLoading && (
          <section className="py-16 md:py-24">
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
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="mt-2 h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        {hotels && <Hotels hotels={hotels} />}

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Discover Nigeria – The Heartbeat of Africa
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From golden beaches and breathtaking waterfalls to colorful festivals and vibrant cities, Nigeria offers an unforgettable blend of adventure, culture, and natural beauty. Whether you’re exploring ancient heritage sites, enjoying rich cuisine, or experiencing warm hospitality, Nigeria is a destination that stays with you forever.
              </p>
            </div>
          </div>
        </section>

        <Chatbot />

      </main>
      <Footer />
    </div>
  );
}
