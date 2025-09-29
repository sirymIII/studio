import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '@/app/contact/page';
import * as contactActions from '@/app/contact/actions';

// Mock the server action
const submitContactFormSpy = vi.spyOn(contactActions, 'submitContactForm');

// Mock the useToast hook
const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe('Contact Page Integration Test', () => {
  it('allows a user to fill out and submit the contact form', async () => {
    // Arrange: Mock the successful server response
    submitContactFormSpy.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<ContactPage />);

    // Act: Find form fields and fill them out
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageTextarea, 'This is a test message.');

    // Assert: Check that inputs have the correct values
    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
    expect(messageTextarea).toHaveValue('This is a test message.');

    // Act: Submit the form
    await user.click(submitButton);

    // Assert: Check if the server action was called with the correct data
    await waitFor(() => {
      expect(submitContactFormSpy).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message.',
      });
    });

    // Assert: Check if the success toast was displayed
    await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
            title: 'Message Sent!',
            description: "Thank you for contacting us. We'll get back to you shortly.",
        });
    });

     // Assert: Check if the form was reset
    expect(nameInput).toHaveValue('');
  });
});
