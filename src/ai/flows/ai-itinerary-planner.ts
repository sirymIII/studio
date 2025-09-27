'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating a personalized travel itinerary.
 *
 * - aiItineraryPlanner - A function that handles the itinerary generation process.
 * - AIItineraryPlannerInput - The input type for the function.
 * - AIItineraryPlannerOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const AIItineraryPlannerInputSchema = z.object({
  destination: z.string().describe('The travel destination (e.g., city or region).'),
  durationDays: z.number().int().min(1).describe('The duration of the trip in days.'),
  interests: z.array(z.string()).describe('A list of user interests to tailor the itinerary (e.g., "history", "nature", "foodie", "relaxation").'),
});
export type AIItineraryPlannerInput = z.infer<typeof AIItineraryPlannerInputSchema>;

const ActivitySchema = z.object({
    time: z.string().describe("Suggested time for the activity (e.g., 'Morning', '9:00 AM - 11:00 AM', 'Afternoon')."),
    description: z.string().describe("A detailed description of the activity or sight to see."),
    activityName: z.string().describe("A short, descriptive name for the activity."),
});

const DailyPlanSchema = z.object({
  day: z.number().int().describe('The day number of the itinerary (e.g., 1, 2, 3).'),
  theme: z.string().describe('A theme for the day (e.g., "Historical Exploration", "Nature & Relaxation").'),
  activities: z.array(ActivitySchema).describe('A list of activities planned for the day.'),
});

export const AIItineraryPlannerOutputSchema = z.object({
  itineraryTitle: z.string().describe("A catchy title for the generated itinerary."),
  dailyPlans: z.array(DailyPlanSchema).describe('An array of day-by-day plans.'),
  summary: z.string().describe("A brief, encouraging summary of the trip ahead."),
});
export type AIItineraryPlannerOutput = z.infer<typeof AIItineraryPlannerOutputSchema>;

export async function aiItineraryPlanner(input: AIItineraryPlannerInput): Promise<AIItineraryPlannerOutput> {
  return aiItineraryPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiItineraryPlannerPrompt',
  input: { schema: AIItineraryPlannerInputSchema },
  output: { schema: AIItineraryPlannerOutputSchema },
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert travel planner for TourNaija, specializing in creating personalized itineraries for tourists visiting Nigeria.

  Create a detailed day-by-day itinerary based on the user's destination, trip duration, and interests.

  Destination: {{{destination}}}
  Duration: {{{durationDays}}} days
  Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  For each day, provide a theme and a list of activities. Each activity should have a suggested time, a name, and a detailed description.
  Make the itinerary practical, enjoyable, and reflective of the user's interests. Include a mix of popular attractions and hidden gems.
  
  The final output must be a JSON object. It should include a catchy 'itineraryTitle', a 'summary' of the trip, and an array of 'dailyPlans'.

  Example structure for a single day:
  {
    "day": 1,
    "theme": "Arrival and City Exploration",
    "activities": [
      {
        "time": "Afternoon",
        "activityName": "Check-in and Relax",
        "description": "Arrive at your hotel, check in, and take some time to settle down and relax after your journey."
      },
      {
        "time": "Evening",
        "activityName": "Dinner at a Local Restaurant",
        "description": "Enjoy your first taste of local cuisine at a highly-rated restaurant. We recommend trying the famous Jollof Rice."
      }
    ]
  }
  `,
});

const aiItineraryPlannerFlow = ai.defineFlow(
  {
    name: 'aiItineraryPlannerFlow',
    inputSchema: AIItineraryPlannerInputSchema,
    outputSchema: AIItineraryPlannerOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
