
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the services and components that cause issues in a JEST environment
jest.mock('@/services/firestore', () => ({
  useHotels: jest.fn(() => ({ data: [], isLoading: false })),
}));

jest.mock('@/components/chatbot', () => ({
  Chatbot: () => <div>Chatbot Mock</div>,
}));

describe('Home Page', () => {
  it('renders the main headline', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /Discover Nigeria's Hidden Gems/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
