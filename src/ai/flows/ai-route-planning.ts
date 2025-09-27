
'use server';

/**
 * @fileOverview This file defines a Genkit flow for planning the best routes to a destination using multiple transport modes.
 *
 * - aiRoutePlanning - A function that handles the route planning process.
 * - AIRoutePlanningInput - The input type for the aiRoutePlanning function.
 * - AIRoutePlanningOutput - The return type for the aiRoutePlanning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIRoutePlanningInputSchema = z.object({
  destination: z.string().describe('The name of the destination.'),
  origin: z.string().describe('The name of the origin.'),
  transportModes: z
    .array(z.string())
    .describe(
      'An array of preferred transport modes (e.g., driving, bus, train, flight).'
    )
    .optional(),
  budget: z.number().describe('The maximum budget for the trip in Naira.').optional(),
  departureTime: z
    .string()
    .describe('The desired departure time in ISO format.')
    .optional(),
});
export type AIRoutePlanningInput = z.infer<typeof AIRoutePlanningInputSchema>;

const RouteSchema = z.object({
  mode: z.string().describe('The transport mode for this route.'),
  provider: z.string().describe('The transport provider.'),
  departurePoint: z.string().describe('The departure point.'),
  arrivalPoint: z.string().describe('The arrival point.'),
  routeDetail: z.string().describe('Detailed route information.'),
  durationMinutes: z.number().describe('The duration of the route in minutes.'),
  priceEstimate: z.number().describe('The estimated price for this route in Naira.'),
  schedule: z.string().describe('The schedule for this route (if applicable).'),
  contact: z.string().describe('Contact information for the transport provider.'),
  notes: z.string().describe('Additional notes or information about the route.'),
});
export type Route = z.infer<typeof RouteSchema>;

const AIRoutePlanningOutputSchema = z.object({
  routes: z.array(RouteSchema),
});
export type AIRoutePlanningOutput = z.infer<typeof AIRoutePlanningOutputSchema>;

export async function aiRoutePlanning(input: AIRoutePlanningInput): Promise<AIRoutePlanningOutput> {
  return aiRoutePlanningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRoutePlanningPrompt',
  input: {schema: AIRoutePlanningInputSchema},
  output: {schema: AIRoutePlanningOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are a travel planning expert specializing in routes within Nigeria.

Based on the user's origin, destination, preferred transport modes, budget, and desired departure time, provide a detailed route plan.

Origin: {{{origin}}}
Destination: {{{destination}}}
Preferred Transport Modes: {{#if transportModes}}{{#each transportModes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Any{{/if}}
Budget: {{#if budget}}₦{{{budget}}}{{else}}No budget specified{{/if}}
Departure Time: {{#if departureTime}}{{{departureTime}}}{{else}}Any{{/if}}

Provide a list of possible routes, including the transport mode, provider, departure and arrival points, route details, duration, price estimate, schedule, contact information, and any relevant notes.

Ensure that the routes are optimized for both cost and time efficiency, considering the user's preferences.

Return a JSON object.

Example:
{
  "routes": [
    {
      "mode": "bus",
      "provider": "ABC Transport",
      "departurePoint": "Lagos, Jibowu",
      "arrivalPoint": "Abuja, Utako",
      "routeDetail": "Direct bus from Lagos to Abuja",
      "durationMinutes": 480,
      "priceEstimate": 8000,
      "schedule": "8:00 AM, 10:00 AM, 6:00 PM",
      "contact": "090-123-4567",
      "notes": "Reclining seats, AC, and onboard entertainment available."
    },
   {
      "mode": "flight",
      "provider": "Arik Air",
      "departurePoint": "Lagos, Murtala Muhammed Airport",
      "arrivalPoint": "Abuja, Nnamdi Azikiwe Airport",
      "routeDetail": "Direct flight from Lagos to Abuja",
      "durationMinutes": 60,
      "priceEstimate": 25000,
      "schedule": "9:00 AM, 1:00 PM, 5:00 PM",
      "contact": "080-987-6543",
      "notes": "Check-in 2 hours before departure. Baggage allowance: 20kg."
    }
  ]
}
`,
});

const aiRoutePlanningFlow = ai.defineFlow(
  {
    name: 'aiRoutePlanningFlow',
    inputSchema: AIRoutePlanningInputSchema,
    outputSchema: AIRoutePlanningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
