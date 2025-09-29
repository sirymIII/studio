import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ItineraryResults } from '@/components/itinerary-results';
import type { AIItineraryPlannerOutput } from '@/ai/flows/ai-itinerary-planner';

// Mock data that matches the component's expected props
const mockResults: AIItineraryPlannerOutput = {
  itineraryTitle: 'A Wonderful Trip to Lagos',
  summary: 'Enjoy the vibrant culture and beautiful beaches of Lagos.',
  dailyPlans: [
    {
      day: 1,
      theme: 'Arrival and Beach Fun',
      activities: [
        {
          activityName: 'Check into Hotel',
          time: 'Afternoon',
          description: 'Settle into your hotel and relax.',
        },
        {
          activityName: 'Visit Elegushi Beach',
          time: 'Evening',
          description: 'Experience the lively atmosphere of a local beach.',
        },
      ],
    },
    {
      day: 2,
      theme: 'Cultural Exploration',
      activities: [
        {
          activityName: 'Lekki Conservation Centre',
          time: 'Morning',
          description: 'Walk the famous canopy walkway.',
        },
      ],
    },
  ],
};

describe('ItineraryResults Component', () => {
  it('renders the main title and summary', () => {
    // Arrange
    render(<ItineraryResults results={mockResults} />);

    // Act & Assert
    const title = screen.getByRole('heading', { name: /A Wonderful Trip to Lagos/i });
    const summary = screen.getByText(/Enjoy the vibrant culture and beautiful beaches/i);

    expect(title).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
  });

  it('renders accordion triggers for each day', () => {
    // Arrange
    render(<ItineraryResults results={mockResults} />);

    // Act & Assert
    const day1Trigger = screen.getByRole('button', { name: /Day 1: Arrival and Beach Fun/i });
    const day2Trigger = screen.getByRole('button', { name: /Day 2: Cultural Exploration/i });

    expect(day1Trigger).toBeInTheDocument();
    expect(day2Trigger).toBeInTheDocument();
  });

  it('renders activity details within the accordion content', () => {
     // Arrange
    render(<ItineraryResults results={mockResults} />);

    // Act & Assert
    // Note: Accordion content might not be visible by default. 
    // For a more advanced test, you could use user-event to click the trigger first.
    // However, for a basic component test, we can just check for the text.
    const activityName = screen.getByText('Check into Hotel');
    const activityTime = screen.getByText('Afternoon');
    const activityDescription = screen.getByText('Settle into your hotel and relax.');

    expect(activityName).toBeInTheDocument();
    expect(activityTime).toBeInTheDocument();
    expect(activityDescription).toBeInTheDocument();
  });
});
