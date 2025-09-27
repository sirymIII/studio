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
    console.log('Simulating call to Wakanow API with input:', input);

    // In a real implementation, you would make the fetch request here.
    // This process might involve multiple steps:
    // 1. Get a locationId from an endpoint like 'Select2' based on input.Destination
    // 2. POST to 'SearchHotels' to initiate the search and get a searchKey
    // 3. GET from 'SearchHotels/{searchKey}/{currency}' to get the results.

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
        {
          id: 'hotel-789',
          name: 'The Grand Resort',
          location: input.Destination,
          price: 120000,
          rating: 5,
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
  },
  async (input) => {
    // Get today's date to provide context to the model.
    const today = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    const llmResponse = await ai.generate({
      prompt: `You are an AI assistant for a travel website. Your task is to help users find hotels.

      - You have access to a \`searchHotels\` tool.
      - Analyze the user's query to extract the necessary information: destination, check-in date, check-out date, and number of guests.
      - Today's date is ${today}.
      - If any information is missing, you MUST ask the user for it. Do not make assumptions about dates, guest counts, or destinations.
      - Once you have all the necessary information, call the \`searchHotels\` tool.
      - When you get the results from the tool, present them to the user in a clear and helpful summary. For example: "I found 3 great hotels for you in Lagos. The Example Hotel Suites is a 5-star hotel for ₦75,000 per night...".
      - If no hotels are found, inform the user gracefully.

      User Query: ${input.query}
      `,
      model: 'googleai/gemini-2.5-flash',
      tools: [searchHotels],
      toolConfig: {
        client: 'genkit' // Use Genkit's tool client
      }
    });

    // Check if the model decided to call the searchHotels tool.
    const toolCalls = llmResponse.toolCalls();

    if (toolCalls.length > 0) {
      const toolResults = [];
      for (const call of toolCalls) {
        // Execute the tool call (in this case, our mock API)
        const toolResult = await call.run();
        toolResults.push(toolResult);
      }

      // Send the tool results back to the model to generate a human-friendly summary.
      const finalResponse = await ai.generate({
          prompt: `Please summarize the results from the hotel search in a friendly and helpful way. List the hotel names, prices, and ratings.`,
          history: [
              { role: 'user', content: input.query },
              llmResponse.message, // The model's message that included the tool call
              { role: 'tool', content: toolResults.map(r => ({...r.output, tool: r.tool})) } // The results from running the tool
          ]
      });

      // The final output includes the raw hotel data and the AI-generated summary.
      return {
        hotels: toolResults[0]?.output?.hotels || [],
        searchSummary: finalResponse.text(),
      };
    }

    // If the model did not call a tool, it's likely asking for more information.
    // Return the model's question directly to the user.
    return {
      searchSummary: llmResponse.text(),
    };
  }
);
