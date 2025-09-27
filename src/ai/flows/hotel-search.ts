'use server';
/**
 * @fileOverview A flow for searching for hotels and retrieving hotel details.
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
  id: z.string().describe('Unique identifier for the hotel, also known as wakanowId.'),
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
 */
const searchHotels = ai.defineTool(
  {
    name: 'searchHotels',
    description: 'Search for hotels based on destination, dates, and guests.',
    inputSchema: HotelApiSearchInputSchema,
    outputSchema: HotelApiSearchOutputSchema,
  },
  async (input) => {
    console.log('Simulating call to Wakanow SearchHotels API with input:', input);
    // In a real implementation, you would:
    // 1. Get a locationId from 'Select2' based on input.Destination
    // 2. POST to 'SearchHotels' to get a searchKey
    // 3. GET from 'SearchHotels/{searchKey}/{currency}' to get results.
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


const HotelStaticDataInputSchema = z.object({
    location: z.string().describe("The location code or city of the hotel."),
    wakanowId: z.string().describe("The Wakanow ID of the hotel.")
});

const HotelStaticDataOutputSchema = z.object({
    name: z.string(),
    description: z.string(),
    amenities: z.array(z.string()),
    address: z.string(),
    phone: z.string().optional(),
});

/**
 * A Genkit tool to get detailed static data for a single hotel.
 */
const getHotelStaticData = ai.defineTool({
    name: 'getHotelStaticData',
    description: 'Retrieves detailed static information for a specific hotel, such as description and amenities.',
    inputSchema: HotelStaticDataInputSchema,
    outputSchema: HotelStaticDataOutputSchema,
}, async ({ wakanowId, location }) => {
    console.log(`Simulating call to HotelStaticData API for hotel ${wakanowId} in ${location}`);
    // In a real app, you would fetch from:
    // https://wakanow-api-hotels-production-preprod.azurewebsites.net/api/hotels/HotelStaticData/${location}/${wakanowId}
    
    // Returning mock data for demonstration.
    if (wakanowId === 'hotel-123') {
        return {
            name: 'Example Hotel Suites',
            description: 'A luxurious 5-star hotel offering world-class services and comfort.',
            amenities: ['Free WiFi', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant'],
            address: `123 Luxury Avenue, ${location}`,
            phone: '123-456-7890'
        }
    }
    return {
        name: 'Unknown Hotel',
        description: 'No details available for this hotel.',
        amenities: [],
        address: 'Unknown Address',
    }
});

export const HotelSearchInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query for finding hotels or hotel details.'),
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
    tools: [searchHotels, getHotelStaticData],
  },
  async (input) => {
    // Get today's date to provide context to the model.
    const today = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    const llmResponse = await ai.generate({
      prompt: `You are an AI assistant for a travel website. Your task is to help users find hotels and get details about them.

      - You have access to two tools: \`searchHotels\` and \`getHotelStaticData\`.
      - Use \`searchHotels\` when the user wants to find a list of hotels.
      - Use \`getHotelStaticData\` when the user asks for specific details (like amenities or description) about a particular hotel.
      - To use \`getHotelStaticData\`, you need the hotel's ID (wakanowId) and location, which you can get from the \`searchHotels\` result.
      - Analyze the user's query to extract the necessary information for the tools.
      - Today's date is ${today}.
      - If any information is missing to call a tool, you MUST ask the user for it. Do not make assumptions.
      - When you get results from a tool, present them to the user in a clear and helpful summary.

      User Query: ${input.query}
      `,
      model: 'googleai/gemini-2.5-flash',
      tools: [searchHotels, getHotelStaticData],
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
          prompt: `Please summarize the results from the tool call(s) in a friendly and helpful way.`,
          history: [
              { role: 'user', content: input.query },
              llmResponse.message, 
              { role: 'tool', content: toolResults.map(r => ({...r.output, tool: r.tool})) }
          ]
      });

      return {
        hotels: toolResults.find(r => r.tool === 'searchHotels')?.output?.hotels || [],
        searchSummary: finalResponse.text(),
      };
    }

    return {
      searchSummary: llmResponse.text(),
    };
  }
);
