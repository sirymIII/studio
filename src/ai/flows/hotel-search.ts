
'use server';
/**
 * @fileOverview A flow for searching for hotels using a live hotel API.
 *
 * - searchHotelsFlow - A function that handles the hotel search process.
 */

import { ai } from '@/ai/genkit';
import { fetchHotelsFromApi } from '@/services/hotel-api';
import {
  HotelApiSearchInputSchema,
  HotelApiSearchOutputSchema,
  HotelSearchInputSchema,
  HotelSearchOutputSchema,
  HotelSearchInput,
  HotelSearchOutput,
} from './hotel-schemas';


/**
 * A Genkit tool that calls a live hotel API to find hotels.
 */
const searchHotels = ai.defineTool(
  {
    name: 'searchHotels',
    description: 'Search for hotels in a specific city using a live API.',
    inputSchema: HotelApiSearchInputSchema,
    outputSchema: HotelApiSearchOutputSchema,
  },
  async ({ city }) => {
    console.log(`Calling live Hotel API for city: ${city}`);

    // Call the server action that fetches hotels from the third-party API.
    // This function securely uses the API key from environment variables.
    const hotelsFromApi = await fetchHotelsFromApi(city);

    // The fetchHotelsFromApi function already returns data in the format
    // our application expects, so we can return it directly.
    return { hotels: hotelsFromApi };
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
    });

    const toolCalls = llmResponse.toolCalls;

    if (toolCalls && toolCalls.length > 0) {
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
          ],
          model: 'googleai/gemini-2.5-flash',
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
