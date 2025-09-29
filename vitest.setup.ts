import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase Admin SDK for server-side tests
vi.mock('@/firebase/server', () => ({
  initializeFirebase: vi.fn(() => ({
    auth: {
      listUsers: vi.fn(() => Promise.resolve({ users: [] })),
    },
    firestore: {},
  })),
}));

// Mock AI Flows for testing server actions that call them
vi.mock('@/ai/flows/ai-itinerary-planner', () => ({
  aiItineraryPlanner: vi.fn(() =>
    Promise.resolve({
      itineraryTitle: 'Mocked Itinerary',
      dailyPlans: [],
      summary: 'This is a mocked summary.',
    })
  ),
}));
