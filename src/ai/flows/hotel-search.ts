
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

      Also, provide a short, friendly 'searchSummary' of the results.

      User Query: "${input.query}"
      `,
      model: 'googleai/gemini-2.5-flash',
      output: {
        schema: HotelSearchOutputSchema,
      }
    });

    const output = llmResponse.output;

    if (!output) {
        // If the model fails to return structured JSON, create a fallback response.
        return {
            hotels: [],
            searchSummary: "I couldn't find any specific hotels, but I can answer general questions about hotels in that area!"
        }
    }
    
    return output;
  }
);

export async function searchHotelsFlow(input: HotelSearchInput): Promise<HotelSearchOutput> {
    return hotelSearchAgent(input);
}
