'use server';
/**
 * @fileOverview A flow for searching for hotels using the Makcorps Hotel API.
 *
 * - searchHotelsFlow - A function that handles the hotel search process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  HotelApiSearchInputSchema,
  HotelApiSearchOutputSchema,
  HotelSearchInputSchema,
  HotelSearchOutputSchema,
  HotelSearchInput,
  HotelSearchOutput,
  VendorPriceSchema
} from './hotel-schemas';


/**
 * A Genkit tool that simulates calling the Makcorps Free Hotel API.
 * This tool internally handles the 2-step process:
 * 1. Get an auth token.
 * 2. Search for hotels with that token.
 */
const searchHotels = ai.defineTool(
  {
    name: 'searchHotels',
    description: 'Search for hotels in a specific city.',
    inputSchema: HotelApiSearchInputSchema,
    outputSchema: HotelApiSearchOutputSchema,
  },
  async ({ city }) => {
    console.log(`Simulating call to Makcorps API for city: ${city}`);
    
    // Step 1: Simulate Authentication to get JWT Token
    // In a real app, replace with your actual username and password,
    // and store the token securely.
    const authPayload = {
      username: "your_username", // IMPORTANT: Replace with your actual username
      password: "your_password", // IMPORTANT: Replace with your actual password
    };

    // This is a placeholder for the auth call. In a real scenario, you'd fetch() this.
    const mockAuthResponse = {
        access_token: 'dummy-jwt-token-for-simulation-purposes-only',
    };
    const accessToken = mockAuthResponse.access_token;


    // Step 2: Simulate Hotel Search with the JWT Token
    console.log(`Simulating GET request to https://api.makcorps.com/free/${city}`);
    // In a real implementation, you would use fetch() with the Authorization header:
    // const response = await fetch(`https://api.makcorps.com/free/${city}`, {
    //   headers: {
    //     'Authorization': `JWT ${accessToken}`
    //   }
    // });
    // const data = await response.json();
    
    // Using mock data that matches the provided API response structure
    const mockApiResponse = [
      [
        { "hotelName": "ITC Grand Central, Mumbai", "hotelId": "503409" },
        [
          { "price1": "180", "tax1": "27", "vendor1": "Booking.com" },
          { "price2": "180", "tax2": "27", "vendor2": "Hotels.com" },
          { "price4": "153", "tax4": "0", "vendor4": "Priceline" }
        ]
      ],
      [
        { "hotelName": "Bloom Hotel - Juhu", "hotelId": "23337279" },
        [
          { "price1": "72", "tax1": "8", "vendor1": "Booking.com" },
          { "price2": "90", "tax2": "10", "vendor2": "Hotels.com" }
        ]
      ]
    ];

    // Helper function to parse the strange vendor price format
    const parseVendors = (vendorArray: any[]) => {
      const vendors: z.infer<typeof VendorPriceSchema>[] = [];
      vendorArray.forEach(vendorObj => {
        // Find all price/tax/vendor keys in the object
        const keys = Object.keys(vendorObj);
        const priceKeys = keys.filter(k => k.startsWith('price'));
        priceKeys.forEach(priceKey => {
            const index = priceKey.substring(5);
            vendors.push({
                price: vendorObj[priceKey] ? parseFloat(vendorObj[priceKey]) : null,
                tax: vendorObj[`tax${index}`] ? parseFloat(vendorObj[`tax${index}`]) : null,
                vendor: vendorObj[`vendor${index}`] || null,
            });
        });
      });
      return vendors;
    };

    const hotels = mockApiResponse.map(hotelEntry => {
      const hotelInfo = hotelEntry[0] as { hotelName: string; hotelId: string; };
      const vendorInfo = hotelEntry[1] as any[];
      return {
        hotelName: hotelInfo.hotelName,
        hotelId: hotelInfo.hotelId,
        vendors: parseVendors(vendorInfo),
      };
    });

    return { hotels };
  }
);

const hotelSearchAgent = ai.defineFlow(
  {
    name: 'hotelSearchAgent',
    inputSchema: HotelSearchInputSchema,
    outputSchema: HotelSearchOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are an AI assistant for a travel website. Your task is to help users find hotels.

      - You have access to one tool: \`searchHotels\`.
      - Use \`searchHotels\` when the user wants to find a list of hotels in a city.
      - To use the tool, you need the city name.
      - If the city is missing from the user's query, you MUST ask for it. Do not make assumptions or call the tool without it.
      - When you get results from the tool, present them to the user in a clear and helpful summary. List the hotel names and the prices available from different vendors.

      User Query: ${input.query}
      `,
      model: 'googleai/gemini-2.5-flash',
      tools: [searchHotels],
      toolConfig: {
        client: 'genkit'
      }
    });

    const toolCalls = llmResponse.toolCalls;

    if (toolCalls.length > 0) {
      const toolResults = [];
      for (const call of toolCalls) {
        const toolResult = await call.run();
        toolResults.push(toolResult);
      }

      const finalResponse = await ai.generate({
          prompt: `Please summarize the results from the tool call(s) in a friendly and helpful way. For each hotel, list its name and the different price options from the vendors.`,
          history: [
              { role: 'user', content: input.query },
              llmResponse.message, 
              { role: 'tool', content: toolResults.map(r => ({...r.output, tool: r.tool})) }
          ]
      });

      return {
        hotels: toolResults.find(r => r.tool === 'searchHotels')?.output?.hotels || [],
        searchSummary: finalResponse.text,
      };
    }

    return {
      searchSummary: llmResponse.text,
    };
  }
);

export async function searchHotelsFlow(input: HotelSearchInput): Promise<HotelSearchOutput> {
    return hotelSearchAgent(input);
}
