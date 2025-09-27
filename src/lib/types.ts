import { z } from 'zod';

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
  // image field is handled separately
});

export type Destination = z.infer<typeof DestinationSchema> & {
  id: string; // Ensure id is always present on the TS type
  image: {
    id: string;
    hint: string;
  };
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: {
    id: string;
    hint: string;
  };
};
