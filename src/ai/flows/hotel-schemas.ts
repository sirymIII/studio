import { z } from 'zod';

export const HotelSchema = z.object({
  hotelName: z.string().describe('The full name of the hotel.'),
  location: z.string().describe('The city and state where the hotel is located.'),
  description: z.string().describe('A short, engaging description of the hotel, including its main features and what makes it special.'),
});

export const HotelSearchInputSchema = z.object({
  query: z.string().describe("The user's natural language query for finding hotels or hotel details, e.g., 'Find hotels in Lagos' or 'Suggest a luxury hotel in Abuja'"),
});
export type HotelSearchInput = z.infer<typeof HotelSearchInputSchema>;

export const HotelSearchOutputSchema = z.object({
  hotels: z.array(HotelSchema).describe('A list of recommended hotels based on the user query.'),
  searchSummary: z.string().describe('A friendly, one-sentence summary of the search results provided.'),
});
export type HotelSearchOutput = z.infer<typeof HotelSearchOutputSchema>;
