import type { Destination } from '@/lib/types';

export const featuredDestinations: Destination[] = [
  {
    id: '1',
    name: 'Yankari National Park',
    state: 'Bauchi',
    image: {
      id: 'dest-yankari',
      hint: 'national park safari',
    },
  },
  {
    id: '2',
    name: 'Obudu Mountain Resort',
    state: 'Cross River',
    image: {
      id: 'dest-obudu',
      hint: 'mountain resort cablecar',
    },
  },
  {
    id: '3',
    name: 'Zuma Rock',
    state: 'Niger',
    image: {
      id: 'dest-zuma',
      hint: 'large monolith rock',
    },
  },
  {
    id: '4',
    name: 'Idanre Hills',
    state: 'Ondo',
    image: {
      id: 'dest-idanre',
      hint: 'ancient hills settlement',
    },
  },
];
