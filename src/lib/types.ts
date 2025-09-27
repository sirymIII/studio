import { z } from 'zod';

// Base schema for destination data validation
export const DestinationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.string().min(3, 'Type must be at least 3 characters'),
  cityTown: z.string().min(2, 'City/Town must be at least 2 characters'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  recommendedStayDays: z.coerce.number().min(1, 'Must be at least 1 day'),
  popularityRank: z.coerce.number().min(1).max(10),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  // hotelIds and mediaIds are handled as subcollections, not direct properties
});

// TypeScript type for a destination, including fields not in the form
export type Destination = z.infer<typeof DestinationSchema> & {
  id: string; // Ensure id is always present on the TS type
  image: {
    id: string;
    hint: string;
  };
  hotelIds?: string[];
  mediaIds?: string[];
};

// Base schema for hotel data validation
export const HotelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5'),
  destinationId: z.string().optional(), // Hotels can be linked to destinations
});

// TypeScript type for a hotel
export type Hotel = z.infer<typeof HotelSchema> & {
  id: string;
  image: {
    id: string;
    hint: string;
  };
};

// Schema for user profile data
export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  createdAt: z.any().optional(), // Firestore timestamp
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
