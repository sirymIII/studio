'use server';

import type { Hotel } from '@/lib/types';

const API_BASE_URL = process.env.HOTEL_API_ENDPOINT || 'https://api.example.com'; // Replace with your actual API endpoint
const API_KEY = process.env.HOTEL_API_KEY; // Store your API key in environment variables

/**
 * Fetches hotel data from a third-party API.
 * This is an example function to demonstrate how to integrate with an external hotel API.
 *
 * @returns {Promise<Hotel[]>} A list of hotels.
 */
export async function fetchHotelsFromApi(): Promise<Hotel[]> {
  if (!API_KEY) {
    console.error('Hotel API key is not configured.');
    // In a real app, you might want to return a default value or throw a more specific error.
    return [];
  }

  const endpoint = `${API_BASE_URL}/hotel-content-api/1.0/hotels?fields=all&language=ENG&from=1&to=10`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // cache: 'no-store' // Use this if the data is highly dynamic
      next: { revalidate: 3600 } // Revalidate data every hour
    });

    if (!response.ok) {
      // Log the error for debugging purposes
      const errorBody = await response.text();
      console.error(`API request failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Failed to fetch hotel data. Status: ${response.status}`);
    }

    const data = await response.json();

    // The mapping logic below is a placeholder.
    // You will need to adapt it to the actual structure of your API's response.
    // For example, if the API returns an array of hotels in `data.hotels`.
    const hotels: Hotel[] = data.hotels.map((apiHotel: any) => {
      return {
        id: apiHotel.code,
        name: apiHotel.name.content,
        location: `${apiHotel.city.content}, ${apiHotel.country.content}`,
        // These fields are placeholders and need to be mapped from your API response
        price: apiHotel.minRate || 0,
        rating: apiHotel.categoryCode ? parseInt(apiHotel.categoryCode.replace('ST', '')) : 0,
        image: {
          id: `hotel-api-${apiHotel.code}`,
          hint: 'hotel exterior',
        },
      };
    });

    return hotels;

  } catch (error) {
    console.error('An error occurred while fetching from the hotel API:', error);
    // Depending on your error handling strategy, you could return an empty array,
    // or re-throw the error to be handled by the caller.
    return [];
  }
}
