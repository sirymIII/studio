import { z } from 'zod';

export const VendorPriceSchema = z.object({
  price: z.number().nullable(),
  tax: z.number().nullable(),
  vendor: z.string().nullable(),
});

export const HotelSchema = z.object({
  hotelName: z.string(),
  hotelId: z.string(),
  vendors: z.array(VendorPriceSchema),
});

export const HotelApiSearchInputSchema = z.object({
  city: z.string().describe('The name of the city to search for hotels in.'),
});

export const HotelApiSearchOutputSchema = z.object({
  hotels: z.array(HotelSchema),
});

export const HotelSearchInputSchema = z.object({
  query: z.string().describe("The user's natural language query for finding hotels or hotel details."),
});
export type HotelSearchInput = z.infer<typeof HotelSearchInputSchema>;

export const HotelSearchOutputSchema = z.object({
  hotels: z.array(HotelSchema).optional(),
  searchSummary: z.string().describe('A summary of the search results or a message to the user.'),
});
export type HotelSearchOutput = z.infer<typeof HotelSearchOutputSchema>;
