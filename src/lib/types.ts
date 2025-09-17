export type Destination = {
  id: string;
  name: string;
  state: string;
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
