import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { FirebaseClientProvider } from '@/firebase';

// Mock the services and components that cause issues in a JSDOM environment
vi.mock('@/services/firestore', () => ({
  useHotels: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock('@/components/chatbot', () => ({
  Chatbot: () => <div>Chatbot Mock</div>,
}));

// A wrapper component to provide the Firebase context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <FirebaseClientProvider>{children}</FirebaseClientProvider>
);

describe('Home Page', () => {
  it('renders the main headline', () => {
    render(<Home />, { wrapper: TestWrapper });

    const heading = screen.getByRole('heading', {
      name: /Discover Nigeria's Hidden Gems/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
