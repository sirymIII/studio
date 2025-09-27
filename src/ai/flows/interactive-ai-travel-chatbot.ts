// InteractiveAITravelChatbot flow
'use server';
/**
 * @fileOverview An AI chatbot for answering questions about destinations and travel.
 *
 * - interactiveAITravelChatbot - A function that handles the chatbot interaction.
 * - InteractiveAITravelChatbotInput - The input type for the interactiveAITravelChatbot function.
 * - InteractiveAITravelChatbotOutput - The return type for the interactiveAITravelChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveAITravelChatbotInputSchema = z.object({
  query: z.string().describe('The user query.'),
  destinationContext: z.string().optional().describe('The ID of the destination the user is currently viewing, if any.'),
});
export type InteractiveAITravelChatbotInput = z.infer<typeof InteractiveAITravelChatbotInputSchema>;

const InteractiveAITravelChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type InteractiveAITravelChatbotOutput = z.infer<typeof InteractiveAITravelChatbotOutputSchema>;

export async function interactiveAITravelChatbot(input: InteractiveAITravelChatbotInput): Promise<InteractiveAITravelChatbotOutput> {
  return interactiveAITravelChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveAITravelChatbotPrompt',
  input: {schema: InteractiveAITravelChatbotInputSchema},
  output: {schema: InteractiveAITravelChatbotOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are a helpful AI travel chatbot for a tourism website in Nigeria called TourNaija.

You will answer questions about destinations in Nigeria.

{{#if destinationContext}}
You have information about the current destination the user is viewing.
Destination ID: {{{destinationContext}}}
Use this context to provide more relevant answers.
{{/if}}

User Query: {{{query}}}
`,
});

const interactiveAITravelChatbotFlow = ai.defineFlow(
  {
    name: 'interactiveAITravelChatbotFlow',
    inputSchema: InteractiveAITravelChatbotInputSchema,
    outputSchema: InteractiveAITravelChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
