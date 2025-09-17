import type { Hotel } from '@/lib/types';

export const featuredHotels: Hotel[] = [
  {
    id: '1',
    name: 'Transcorp Hilton Abuja',
    location: 'Abuja, FCT',
    price: 75000,
    rating: 5,
    image: {
      id: 'hotel-transcorp',
      hint: 'luxury hotel exterior',
    },
  },
  {
    id: '2',
    name: 'Eko Hotel & Suites',
    location: 'Lagos, Lagos',
    price: 60000,
    rating: 4,
    image: {
      id: 'hotel-eko',
      hint: 'modern hotel building',
    },
  },
  {
    id: '3',
    name: 'Nike Lake Resort',
    location: 'Enugu, Enugu',
    price: 45000,
    rating: 4,
    image: {
      id: 'hotel-nike-lake',
      hint: 'resort by lake',
    },
  },
];
