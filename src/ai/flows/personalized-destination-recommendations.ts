// src/ai/flows/personalized-destination-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized destination recommendations.
 *
 * It takes into account the user's city of origin, budget, and interests to suggest
 * travel destinations that best match their preferences.
 *
 * - personalizedDestinationRecommendations - A function that initiates the recommendation flow.
 * - PersonalizedDestinationRecommendationsInput - The input type for the personalizedDestinationRecommendations function.
 * - PersonalizedDestinationRecommendationsOutput - The return type for the personalizedDestinationRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const PersonalizedDestinationRecommendationsInputSchema = z.object({
  city: z.string().describe('The user\'s city of origin.'),
  budget: z.string().describe('The user\'s budget for the trip (e.g., \'low\', \'medium\', \'high\').'),
  preferences: z.string().describe('The user\'s interests (e.g., \'historical sites\', \'natural beauty\', \'cultural experiences\').'),
});

export type PersonalizedDestinationRecommendationsInput = z.infer<typeof PersonalizedDestinationRecommendationsInputSchema>;

// Define the output schema
const PersonalizedDestinationRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      destinationName: z.string().describe('The name of the recommended destination.'),
      state: z.string().describe('The state in Nigeria where the destination is located.'),
      type: z.string().describe('The type of destination (e.g., Natural, Historical, Cultural).'),
      description: z.string().describe('A brief description of the destination.'),
      cityTown: z.string().describe('The nearest city or town to the destination.'),
      latitude: z.number().describe('The latitude of the destination.'),
      longitude: z.number().describe('The longitude of the destination.'),
      recommendedStayDays: z.number().describe('The recommended duration of stay in days.'),
      popularityRank: z.number().describe('A rank indicating the destination\'s popularity.'),
    })
  ).describe('A list of personalized destination recommendations.'),
});

export type PersonalizedDestinationRecommendationsOutput = z.infer<typeof PersonalizedDestinationRecommendationsOutputSchema>;

// Exported function to initiate the flow
export async function personalizedDestinationRecommendations(input: PersonalizedDestinationRecommendationsInput): Promise<PersonalizedDestinationRecommendationsOutput> {
  return personalizedDestinationRecommendationsFlow(input);
}

// Define the prompt
const personalizedDestinationRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedDestinationRecommendationsPrompt',
  input: {schema: PersonalizedDestinationRecommendationsInputSchema},
  output: {schema: PersonalizedDestinationRecommendationsOutputSchema},
  prompt: `You are an AI travel assistant specializing in Nigerian tourism.

  Based on the user's city of origin, budget, and interests, provide a list of personalized destination recommendations in Nigeria.
  Consider the popularity of destinations among similar users, travel distance from the origin city, and alignment with the user's stated interests and budget.

  The output must be a JSON object conforming to the PersonalizedDestinationRecommendationsOutputSchema, containing an array of destination recommendations. Each destination must include the destinationName, state, type, description, cityTown, latitude, longitude, recommendedStayDays, and popularityRank.

  User's City: {{{city}}}
  User's Budget: {{{budget}}}
  User's Interests: {{{preferences}}}

  Ensure that the recommendations are diverse and cover different regions and types of attractions in Nigeria.
  `, // end of prompt
});

// Define the flow
const personalizedDestinationRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedDestinationRecommendationsFlow',
    inputSchema: PersonalizedDestinationRecommendationsInputSchema,
    outputSchema: PersonalizedDestinationRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedDestinationRecommendationsPrompt(input);
    return output!;
  }
);
