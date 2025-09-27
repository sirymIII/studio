'use server';
/**
 * @fileOverview A flow for searching for hotels using an external API.
 *
 * - searchHotelsFlow - A function that handles the hotel search process.
 * - HotelSearchInput - The input type for the hotel search.
 * - HotelSearchOutput - The return type for the hotel search.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for the input of the hotel search tool, based on the provided sample
const HotelApiSearchInputSchema = z.object({
  CheckinDate: z.string().describe('Check-in date in MM/DD/YYYY format.'),
  CheckoutDate: z.string().describe('Checkout-out date in MM/DD/YYYY format.'),
  Destination: z.string().describe('The city or area to search for hotels in.'),
  Room1: z.string().describe('Number of adults in the room.'),
  totalGuests: z.number().describe('Total number of guests.'),
  TargetCurrency: z.string().default('NGN'),
});

// Schema for the output of a single hotel from the tool
const HotelSchema = z.object({
  id: z.string().describe('Unique identifier for the hotel.'),
  name: z.string().describe('Name of the hotel.'),
  location: z.string().describe('General location or address of the hotel.'),
  price: z.number().describe('Average price per night.'),
  rating: z.number().describe('Star rating of the hotel.'),
});

// Schema for the output of the hotel search tool
const HotelApiSearchOutputSchema = z.object({
  hotels: z.array(HotelSchema),
});

/**
 * A Genkit tool that simulates calling an external hotel search API.
 * In a real application, this is where you would make the `fetch` call.
 */
const searchHotels = ai.defineTool(
  {
    name: 'searchHotels',
    description: 'Search for hotels based on destination, dates, and guests.',
    inputSchema: HotelApiSearchInputSchema,
    outputSchema: HotelApiSearchOutputSchema,
  },
  async (input) => {
    console.log('Calling external hotel search API with input:', input);

    // In a real implementation, you would make the fetch request here.
    // const response = await fetch('https://wakanow-api-hotels-production-preprod.azurewebsites.net/api/hotels/SearchHotels/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${process.env.WAKANOW_API_KEY}` // Example of using an API key
    //   },
    //   body: JSON.stringify(input),
    // });
    // const data = await response.json();
    //
    // // You would then map the response data to the HotelApiSearchOutputSchema
    // return data;

    // For now, we return mock data that matches the output schema.
    return {
      hotels: [
        {
          id: 'hotel-123',
          name: 'Example Hotel Suites',
          location: input.Destination,
          price: 75000,
          rating: 5,
        },
        {
          id: 'hotel-456',
          name: 'Budget Friendly Inn',
          location: input.Destination,
          price: 30000,
          rating: 3,
        },
      ],
    };
  }
);

export const HotelSearchInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query for finding hotels.'),
});
export type HotelSearchInput = z.infer<typeof HotelSearchInputSchema>;

export const HotelSearchOutputSchema = z.object({
  hotels: z.array(HotelSchema).optional(),
  searchSummary: z.string().describe('A summary of the search results or a message to the user.'),
});
export type HotelSearchOutput = z.infer<typeof HotelSearchOutputSchema>;

export async function searchHotelsFlow(input: HotelSearchInput): Promise<HotelSearchOutput> {
    return hotelSearchAgent(input);
}


const hotelSearchAgent = ai.defineFlow(
  {
    name: 'hotelSearchAgent',
    inputSchema: HotelSearchInputSchema,
    outputSchema: HotelSearchOutputSchema,
    tools: [searchHotels],
    prompt: `You are an AI assistant for a travel website. Your task is to help users find hotels.

    - You have access to a \`searchHotels\` tool.
    - Analyze the user's query to extract the necessary information: destination, check-in date, check-out date, and number of guests.
    - Today's date is ${new Date().toLocaleDateString()}.
    - If any information is missing, you MUST ask the user for it. Do not make up dates or guest counts.
    - If you have all the information, call the \`searchHotels\` tool.
    - When you get the results, present them to the user in a clear and helpful summary.
    - If no hotels are found, inform the user gracefully.

    User Query: {{{query}}}
    `,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: input.query,
      model: 'googleai/gemini-2.5-flash',
      tools: [searchHotels],
      toolConfig: {
          client: 'genkit'
      }
    });

    const toolCalls = llmResponse.toolCalls();

    if (toolCalls.length > 0) {
        const toolResults = [];
        for (const call of toolCalls) {
            const toolResult = await call.run();
            toolResults.push(toolResult);
        }

        const finalResponse = await ai.generate({
            prompt: `Summarize the results from the hotel search.`,
            history: [
                { role: 'user', content: input.query },
                llmResponse.message,
                { role: 'tool', content: toolResults.map(r => ({...r.output, tool: r.tool})) }
            ]
        });
        return { searchSummary: finalResponse.text() };
    }


    // If the model did not call a tool, it's likely asking for more information.
    return { searchSummary: llmResponse.text() };
  }
);
