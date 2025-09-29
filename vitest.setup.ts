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

// Mock client-side Firebase initialization
vi.mock('@/firebase/client-provider', async (importOriginal) => {
  const original = await importOriginal<any>();
  return {
    ...original,
    // Mock the provider to just render children
    FirebaseClientProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock the `useUser` hook which is used in many components
vi.mock('@/firebase/provider', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/firebase/provider')>();
    return {
        ...original,
        useUser: vi.fn(() => ({ user: null, isUserLoading: false })),
    };
});


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

// Mock 'server-only' package for Vitest environment
vi.mock('server-only', () => ({}));
