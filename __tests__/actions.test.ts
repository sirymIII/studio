import { describe, it, expect, vi, afterEach } from 'vitest';
import { getUserCount } from '@/app/admin/actions';
import { initializeFirebase } from '@/firebase/server';

// Since initializeFirebase is mocked in setup, we can grab it to check its return value
const mockedFirebase = await vi.importMock('@/firebase/server');
const { auth } = await mockedFirebase.initializeFirebase();


describe('Admin Server Actions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getUserCount should return the total number of users', async () => {
    // Arrange: Mock the return value for listUsers
    auth.listUsers.mockResolvedValue({
      users: new Array(15), // Simulate 15 user records
    });

    // Act: Call the server action
    const count = await getUserCount();

    // Assert: Check if the count is correct
    expect(count).toBe(15);
    expect(auth.listUsers).toHaveBeenCalledWith(1); // We only fetch 1 user to get the total count
  });

  it('getUserCount should return 0 if there is an error', async () => {
    // Arrange: Mock the implementation to throw an error
    auth.listUsers.mockRejectedValue(new Error('Firebase auth error'));

    // Act: Call the server action
    const count = await getUserCount();

    // Assert: The action should handle the error and return 0
    expect(count).toBe(0);
  });
});
