'use client';

import {
  PersonalizedDestinationRecommendationsOutput,
} from '@/ai/flows/personalized-destination-recommendations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar } from 'lucide-react';
import Image from 'next/image';

export function RecommendationResults({
  results,
}: {
  results: PersonalizedDestinationRecommendationsOutput;
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Your Personalized Recommendations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {results.recommendationSummary}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {results.recommendations.map((rec, index) => (
            <Card key={index} className="flex flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={`https://picsum.photos/seed/${rec.latitude}/600/400`}
                  alt={rec.destinationName}
                  fill
                  className="object-cover"
                  data-ai-hint={`${rec.type} landscape`}
                />
              </div>
              <CardHeader>
                <CardTitle>{rec.destinationName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {rec.cityTown}, {rec.state}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col">
                <p className="mb-4 text-sm text-muted-foreground">
                  {rec.description}
                </p>
                <div className="mt-auto space-y-3">
                   <div className="flex items-center gap-2 text-sm">
                     <Star className="h-4 w-4 text-primary" />
                     <span>Popularity: {rec.popularityRank}/10</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                     <Calendar className="h-4 w-4 text-primary" />
                     <span>Recommended Stay: {rec.recommendedStayDays} days</span>
                   </div>
                  <Button className="mt-2 w-full">Explore</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
