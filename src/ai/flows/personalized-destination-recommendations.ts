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
  preferences: z.array(z.string()).describe('A list of user interests (e.g., \'historical sites\', \'natural beauty\', \'cultural experiences\').'),
});

export type PersonalizedDestinationRecommendationsInput = z.infer<typeof PersonalizedDestinationRecommendationsInputSchema>;

// Define the output schema
const DestinationRecommendationSchema = z.object({
  destinationName: z.string().describe('The name of the recommended destination.'),
  state: z.string().describe('The state in Nigeria where the destination is located.'),
  type: z.string().describe('The type of destination (e.g., Natural, Historical, Cultural).'),
  description: z.string().describe('A brief description of the destination.'),
  cityTown: z.string().describe('The nearest city or town to the destination.'),
  latitude: z.number().describe('The latitude of the destination.'),
  longitude: z.number().describe('The longitude of the destination.'),
  recommendedStayDays: z.number().describe('The recommended duration of stay in days.'),
  popularityRank: z.number().describe('A rank indicating the destination\'s popularity on a scale of 1 to 10.'),
});

const PersonalizedDestinationRecommendationsOutputSchema = z.object({
  recommendations: z.array(DestinationRecommendationSchema).describe('A list of personalized destination recommendations.'),
  recommendationSummary: z.string().describe('A friendly, one-sentence summary of the recommendations provided.')
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
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI travel assistant specializing in Nigerian tourism.

  Based on the user's city of origin, budget, and interests, provide a list of 3 personalized destination recommendations in Nigeria.
  Consider the popularity of destinations, travel distance from the origin city, and alignment with the user's stated interests and budget.

  The output must be a JSON object. Each destination must include the destinationName, state, type, description, cityTown, latitude, longitude, recommendedStayDays, and a popularityRank from 1 to 10.
  
  Also include a 'recommendationSummary', which is a single friendly and encouraging sentence summarizing the type of recommendations you've provided.

  User's City: {{{city}}}
  User's Budget: {{{budget}}}
  User's Interests: {{#each preferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Ensure that the recommendations are diverse and cover different regions and types of attractions in Nigeria.
  `, 
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
