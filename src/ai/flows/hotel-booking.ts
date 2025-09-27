'use server';
/**
 * @fileOverview A flow for validating and booking a hotel reservation.
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
    // In a real implementation, you would make the POST request here to:
    // https://wakanow-api-hotels-production-preprod.azurewebsites.net/api/hotel/validate
    // with the `input` as the JSON body.

    // For now, we'll simulate a successful validation.
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


export const HotelBookingInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query for booking a hotel.'),
  // In a real app, you'd pass context from the search results, like the BookingData string.
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
    
    - Your goal is to collect all necessary passenger details to call the \`validateHotelBooking\` tool.
    - The required details are: First Name, Last Name, Date of Birth, Phone Number, Address, Email, Gender, Title, and Country.
    - If the user has provided a booking context (BookingData and BookingId), use it.
    - If any information is missing, you MUST ask the user for it. Do not make up details.
    - Once you have all the required information, call the \`validateHotelBooking\` tool.
    - After calling the tool, summarize the result for the user.

    User Query: ${input.query}
    `,
    model: 'googleai/gemini-2.5-flash',
    tools: [validateHotelBooking],
  });

  const toolCalls = llmResponse.toolCalls();

  if (toolCalls.length > 0) {
    const toolResults = [];
    for (const call of toolCalls) {
      const toolResult = await call.run();
      toolResults.push(toolResult);
    }

    // Send the results back to the model for a final summary
    const finalResponse = await ai.generate({
      prompt: `The booking validation is complete. Please present the final status to the user based on the tool's output.`,
      history: [
        { role: 'user', content: input.query },
        llmResponse.message,
        { role: 'tool', content: toolResults.map(r => ({...r.output, tool: r.tool})) },
      ],
    });

    return {
      bookingConfirmation: toolResults[0]?.output,
      responseText: finalResponse.text(),
    };
  }

  // If no tool was called, the model is likely asking for more information.
  return {
    responseText: llmResponse.text(),
  };
}
