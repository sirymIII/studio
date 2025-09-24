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
import Link from 'next/link';

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
            <Button size="lg" className="mt-8" asChild>
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
