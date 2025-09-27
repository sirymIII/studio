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


// User Profile Schemas based on the new detailed structure
const BasicInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.').optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(), // Using string for date input
  nationality: z.string().optional(),
  profilePictureUrl: z.string().url().optional().nullable(),
});

export const UserProfileSchema = z.object({
  userId: z.string(),
  basicInfo: BasicInfoSchema,
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// This schema will be used for the form to edit the basic info
export const UserProfileFormSchema = BasicInfoSchema;
export type UserProfileFormData = z.infer<typeof UserProfileFormSchema>;
