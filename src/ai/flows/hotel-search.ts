
'use server';
/**
 * @fileOverview A flow for searching for hotels using the Gemini AI model.
 *
 * - searchHotelsFlow - A function that handles the hotel search process.
 */

import { ai } from '@/ai/genkit';
import {
  HotelSearchInputSchema,
  HotelSearchOutputSchema,
  HotelSearchInput,
  HotelSearchOutput,
} from './hotel-schemas';


const hotelSearchAgent = ai.defineFlow(
  {
    name: 'hotelSearchAgent',
    inputSchema: HotelSearchInputSchema,
    outputSchema: HotelSearchOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are an AI assistant for TourNaija, a Nigerian tourism website. Your task is to provide helpful hotel recommendations based on a user's query.

      Based on the user's request, suggest 3 to 5 hotels in the specified location.

      For each hotel, provide:
      - hotelName: The name of the hotel.
      - location: The city and state.
      - description: A brief, helpful description of the hotel.

      Also, provide a short, friendly 'searchSummary' of the results. If no specific city is provided, ask the user for one in the 'searchSummary'.

      User Query: "${input.query}"
      
      IMPORTANT: You must always return a valid JSON object that conforms to the specified output schema. If you cannot find specific hotels, return an empty "hotels" array and explain why in the "searchSummary".
      `,
      model: 'googleai/gemini-2.5-flash',
      output: {
        schema: HotelSearchOutputSchema,
      }
    });

    return llmResponse.output!;
  }
);

export async function searchHotelsFlow(input: HotelSearchInput): Promise<HotelSearchOutput> {
    return hotelSearchAgent(input);
}
