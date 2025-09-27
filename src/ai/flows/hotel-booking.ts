'use server';
/**
 * @fileOverview A flow for validating and booking a hotel reservation and retrieving booking details.
 *
 * - hotelBookingAgent - An AI agent that handles the hotel booking process.
 * - HotelBookingInput - The input type for the hotel booking agent.
 * - HotelBookingOutput - The return type for the hotel booking agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for Passenger Details based on the provided sample
const PassengerDetailSchema = z.object({
  PassengerType: z.string().default('Adult'),
  FirstName: z.string(),
  MiddleName: z.string().optional(),
  LastName: z.string(),
  DateOfBirth: z.string().describe('Date of birth in DD/MM/YYYY format.'),
  Age: z.number(),
  RoomNumber: z.number().default(1),
  PhoneNumber: z.string(),
  Address: z.string(),
  PassportNumber: z.string().optional(),
  ExpiryDate: z.string().nullable().optional(),
  Email: z.string().email(),
  Gender: z.string(),
  Title: z.string().describe('e.g., Mr, Mrs, Ms'),
  City: z.string().optional(),
  Country: z.string(),
  CountryCode: z.string(),
  PostalCode: z.string().optional(),
});

// Schema for Booking Item Models
const BookingItemModelSchema = z.object({
  ProductType: z.string().default('Hotel'),
  BookingData: z.string().describe('The encoded booking data string for the hotel.'),
  BookingId: z.string(),
});

// Schema for the input of the booking validation tool
const HotelBookingValidationInputSchema = z.object({
  PassengerDetails: z.array(PassengerDetailSchema),
  bookingItemModels: z.array(BookingItemModelSchema),
  BookingId: z.string(),
  GeographyId: z.string(),
});

// Schema for the output of the booking validation tool
const HotelBookingValidationOutputSchema = z.object({
  success: z.boolean(),
  confirmationId: z.string().optional(),
  message: z.string(),
});

/**
 * A Genkit tool that simulates calling an external hotel booking/validation API.
 */
const validateHotelBooking = ai.defineTool(
  {
    name: 'validateHotelBooking',
    description: 'Validates and finalizes a hotel booking with passenger details.',
    inputSchema: HotelBookingValidationInputSchema,
    outputSchema: HotelBookingValidationOutputSchema,
  },
  async (input) => {
    console.log('Simulating call to Wakanow booking validation API with input:', input);
    // In a real implementation, you would POST to:
    // https://wakanow-api-hotels-production-preprod.azurewebsites.net/api/hotel/validate
    if (input.PassengerDetails.length > 0 && input.bookingItemModels.length > 0) {
      return {
        success: true,
        confirmationId: `CONF-${Date.now()}`,
        message: 'Your booking has been successfully validated and confirmed!',
      };
    } else {
      return {
        success: false,
        message: 'Validation failed. Please ensure all passenger and booking details are correct.',
      };
    }
  }
);


const BookingDetailsInputSchema = z.object({
    bookingId: z.string().describe("The ID of the booking to retrieve.")
});

const BookingDetailsOutputSchema = z.object({
    status: z.string(),
    hotelName: z.string(),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    totalAmount: z.number()
});


/**
 * A Genkit tool to get details for an existing booking.
 */
const getBookingDetails = ai.defineTool({
    name: 'getBookingDetails',
    description: 'Retrieves the status and details of a specific hotel booking by its ID.',
    inputSchema: BookingDetailsInputSchema,
    outputSchema: BookingDetailsOutputSchema,
}, async ({ bookingId }) => {
    console.log(`Simulating API call to get details for booking ID: ${bookingId}`);
    // In a real app, you would fetch from an endpoint like:
    // http://<host>/api/hotel/Booking/id/${bookingId}

    // Returning mock data.
    return {
        status: 'Confirmed',
        hotelName: 'Example Hotel Suites',
        checkInDate: '2023-11-05',
        checkOutDate: '2023-11-08',
        totalAmount: 225000
    }
});


export const HotelBookingInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query for booking a hotel or checking a booking status.'),
  bookingContext: z.object({
    BookingData: z.string(),
    BookingId: z.string(),
  }).optional(),
});
export type HotelBookingInput = z.infer<typeof HotelBookingInputSchema>;

export const HotelBookingOutputSchema = z.object({
  bookingConfirmation: HotelBookingValidationOutputSchema.optional(),
  responseText: z.string().describe('A summary of the booking status or a question to the user.'),
});
export type HotelBookingOutput = z.infer<typeof HotelBookingOutputSchema>;


export async function hotelBookingAgent(input: HotelBookingInput): Promise<HotelBookingOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a hotel booking assistant.
    
    - Your goal is to help users book a hotel or check the status of an existing booking.
    - You have two tools: \`validateHotelBooking\` and \`getBookingDetails\`.
    - Use \`validateHotelBooking\` to create a new booking. To call it, you need passenger details: First Name, Last Name, DOB, Phone, Address, Email, Gender, Title, and Country.
    - Use \`getBookingDetails\` to check the status of an existing booking. You need a \`bookingId\`.
    - If any information is missing for a tool, you MUST ask the user for it. Do not make up details.
    - Once you have the required information, call the appropriate tool.
    - After calling a tool, summarize the result for the user.

    User Query: ${input.query}
    `,
    model: 'googleai/gemini-2.5-flash',
    tools: [validateHotelBooking, getBookingDetails],
  });

  const toolCalls = llmResponse.toolCalls;

  if (toolCalls.length > 0) {
    const toolResults = [];
    for (const call of toolCalls) {
      const toolResult = await call.run();
      toolResults.push(toolResult);
    }

    // Send the results back to the model for a final summary
    const finalResponse = await ai.generate({
      prompt: `The operation is complete. Please present the final status to the user based on the tool's output.`,
      history: [
        { role: 'user', content: input.query },
        llmResponse.message,
        { role: 'tool', content: toolResults.map(r => ({...r.output, tool: r.tool})) },
      ],
    });

    return {
      bookingConfirmation: toolResults.find(r => r.tool === 'validateHotelBooking')?.output,
      responseText: finalResponse.text,
    };
  }

  // If no tool was called, the model is likely asking for more information.
  return {
    responseText: llmResponse.text,
  };
}
