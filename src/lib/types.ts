export type Room = {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  amenities: string[];
};

export type Booking = {
  id: string;
  roomId: string;
  title: string;
  start: string;
  end: string;
};

export type Person = {
  id: string;
  name: string;
  role: string;
  email: string;
};
