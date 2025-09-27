'use client';

import { AIItineraryPlannerOutput } from '@/ai/flows/ai-itinerary-planner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function ItineraryResults({ results }: { results: AIItineraryPlannerOutput }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            {results.itineraryTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {results.summary}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible defaultValue="day-1" className="w-full">
            {results.dailyPlans.map((dayPlan) => (
              <AccordionItem key={dayPlan.day} value={`day-${dayPlan.day}`}>
                <AccordionTrigger className="text-xl font-bold font-headline">
                  Day {dayPlan.day}: {dayPlan.theme}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                    {dayPlan.activities.map((activity, index) => (
                      <div key={index} className="relative">
                         <div className="absolute -left-[2.1rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle className="h-5 w-5 text-primary" />
                         </div>
                         <div className="ml-4">
                            <h4 className="font-semibold">{activity.activityName}</h4>
                            <p className="text-sm text-muted-foreground font-medium">{activity.time}</p>
                            <p className="mt-1 text-sm">{activity.description}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
