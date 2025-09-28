
'use server';

import { HotelSchema, VendorPriceSchema } from '@/ai/flows/hotel-schemas';
import { z } from 'zod';

const API_BASE_URL = 'https://api.makcorps.com';
const USERNAME = 'mjavason'; // As per the API documentation/example

/**
 * Fetches hotel data from the Makcorps Free Hotel API.
 * This function handles the two-step process of getting a token and then fetching hotels.
 *
 * @param {string} city - The city to search for hotels in.
 * @returns {Promise<z.infer<typeof HotelSchema>[]>} A list of hotels.
 */
export async function fetchHotelsFromApi(city: string): Promise<z.infer<typeof HotelSchema>[]> {
  const apiKey = process.env.HOTEL_API_KEY;

  if (!apiKey) {
    console.error('Hotel API key is not configured in .env file.');
    throw new Error('Hotel API key is missing.');
  }

  try {
    // Step 1: Get Authentication Token
    const authResponse = await fetch(`${API_BASE_URL}/security/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: USERNAME,
        password: apiKey,
      }),
    });

    if (!authResponse.ok) {
      console.error(`API auth failed with status ${authResponse.status}`);
      throw new Error(`Failed to authenticate with hotel API. Status: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      throw new Error('Access token not found in API response.');
    }

    // Step 2: Search for Hotels with the Token
    const hotelResponse = await fetch(`${API_BASE_URL}/free/${city}`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${accessToken}`,
      },
      next: { revalidate: 3600 }, // Revalidate data every hour
    });

    if (!hotelResponse.ok) {
      console.error(`Hotel search API request failed with status ${hotelResponse.status}`);
      throw new Error(`Failed to fetch hotel data. Status: ${hotelResponse.status}`);
    }

    const rawHotelData = await hotelResponse.json();

    // Helper function to parse the vendor price format from the API
    const parseVendors = (vendorArray: any[]): z.infer<typeof VendorPriceSchema>[] => {
      const vendors: z.infer<typeof VendorPriceSchema>[] = [];
      vendorArray.forEach(vendorObj => {
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

    // Map the raw API data to our application's Hotel schema
    const hotels: z.infer<typeof HotelSchema>[] = rawHotelData.map((hotelEntry: any) => {
      const hotelInfo = hotelEntry[0] as { hotelName: string; hotelId: string; };
      const vendorInfo = hotelEntry[1] as any[];
      return {
        hotelName: hotelInfo.hotelName,
        hotelId: hotelInfo.hotelId,
        vendors: parseVendors(vendorInfo),
      };
    });

    return hotels;

  } catch (error) {
    console.error('An error occurred while fetching from the hotel API:', error);
    // Return empty array on failure so the app doesn't crash
    return [];
  }
}
