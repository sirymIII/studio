import { describe, it, expect, vi } from 'vitest';
import { aiItineraryPlanner, AIItineraryPlannerInput } from '@/ai/flows/ai-itinerary-planner';

// The actual flow is mocked in vitest.setup.ts
const mockedAiItineraryPlanner = await vi.importMock('@/ai/flows/ai-itinerary-planner');

describe('AI Flow Server Actions (Boundaries)', () => {
  it('aiItineraryPlanner action calls the underlying flow with correct arguments', async () => {
    const input: AIItineraryPlannerInput = {
      destination: 'Lagos',
      durationDays: 5,
      interests: ['music', 'beaches'],
    };

    // Act: Call the server action that wraps the flow
    await aiItineraryPlanner(input);

    // Assert: Check if the mocked flow was called with the right data
    expect(mockedAiItineraryPlanner.aiItineraryPlanner).toHaveBeenCalledWith(input);
  });

  it('aiItineraryPlanner action returns the mocked response', async () => {
     const input: AIItineraryPlannerInput = {
      destination: 'Abuja',
      durationDays: 2,
      interests: ['history'],
    };

    // Act
    const result = await aiItineraryPlanner(input);

    // Assert: Ensure the component gets back the data it expects from the mock
    expect(result.itineraryTitle).toBe('Mocked Itinerary');
    expect(result.summary).toContain('mocked summary');
  });
});
