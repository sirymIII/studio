
'use server';
/**
 * @fileOverview A flow for booking a hotel.
 *
 * - hotelBookingAgent - An AI agent that handles the hotel booking process.
 * - HotelBookingInput - The input type for the hotel booking agent.
 * - HotelBookingOutput - The return type for the hotel booking agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

const GuestDetailsSchema = z.object({
  fullName: z.string().describe('The full name of the guest.'),
  email: z.string().email().describe('The email address of the guest.'),
});

const HotelBookingToolInputSchema = z.object({
  hotelId: z.string().describe('The ID of the hotel to book.'),
  guestDetails: GuestDetailsSchema,
});

const HotelBookingToolOutputSchema = z.object({
  success: z.boolean(),
  confirmationId: z.string().optional(),
  message: z.string(),
});

/**
 * A Genkit tool that simulates booking a hotel.
 */
const bookHotel = ai.defineTool(
  {
    name: 'bookHotel',
    description: 'Books a hotel for the given hotel ID and guest details.',
    inputSchema: HotelBookingToolInputSchema,
    outputSchema: HotelBookingToolOutputSchema,
  },
  async (input) => {
    console.log('Simulating hotel booking with input:', input);
    // In a real implementation, you would call an external booking API here.
    if (input.hotelId && input.guestDetails.fullName && input.guestDetails.email) {
      // Simulate a successful booking
      return {
        success: true,
        confirmationId: `TOURNAIJA-${uuidv4().substring(0, 8).toUpperCase()}`,
        message: 'Your hotel booking has been successfully confirmed!',
      };
    } else {
      return {
        success: false,
        message: 'Booking failed. Missing required information.',
      };
    }
  }
);


export const HotelBookingInputSchema = z.object({
  hotelId: z.string().describe('The ID of the hotel to be booked.'),
  query: z.string().describe("The user's natural language query for booking the hotel."),
  chatHistory: z.string().describe("The history of the conversation so far.").optional(),
});
export type HotelBookingInput = z.infer<typeof HotelBookingInputSchema>;

export const HotelBookingOutputSchema = z.object({
  bookingConfirmation: HotelBookingToolOutputSchema.optional(),
  responseText: z.string().describe('A summary of the booking status or a question to the user.'),
});
export type HotelBookingOutput = z.infer<typeof HotelBookingOutputSchema>;


export async function hotelBookingAgent(input: HotelBookingInput): Promise<HotelBookingOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a hotel booking assistant for TourNaija.

    Your goal is to help the user book the hotel with ID: ${input.hotelId}.

    - You have one tool: \`bookHotel\`.
    - To call the tool, you need the user's full name and email address.
    - If the user provides the necessary information, call the \`bookHotel\` tool with the hotelId and the collected guest details.
    - If any information is missing, you MUST ask the user for it clearly. Do not make up details.
    - Once you have called the tool, summarize the result for the user.
    - Be friendly and conversational.

    Conversation History:
    ${input.chatHistory || 'No history yet.'}
    
    User's Latest Message: "${input.query}"
    `,
    model: 'googleai/gemini-2.5-flash',
    tools: [bookHotel],
  });

  const toolCalls = llmResponse.toolCalls;

  if (toolCalls && toolCalls.length > 0) {
    const toolResults = [];
    for (const call of toolCalls) {
      const toolResult = await call.run();
      toolResults.push(toolResult);
    }

    const finalResponse = await ai.generate({
      prompt: `The booking tool has been executed. Please present the final status to the user based on the tool's output. If successful, congratulate them and provide the confirmation details. If not, explain the issue.`,
      history: [
        { role: 'user', content: input.query },
        llmResponse.message,
        { role: 'tool', content: toolResults.map(r => ({...r.output, tool: r.tool})) },
      ],
      model: 'googleai/gemini-2.5-flash',
    });

    return {
      bookingConfirmation: toolResults.find(r => r.tool === 'bookHotel')?.output,
      responseText: finalResponse.text,
    };
  }

  // If no tool was called, the model is likely asking for more information.
  return {
    responseText: llmResponse.text,
  };
}
