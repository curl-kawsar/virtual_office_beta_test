export type RoomStatus = "available" | "occupied" | "maintenance";

export type Room = {
  id: string;
  name: string;
  capacity: number;
  status: RoomStatus;
};

export type Booking = {
  id: string;
  roomId: string;
  title: string;
  startISO: string;
  endISO: string;
  organizer: string;
};

export type CreateRoomInput = {
  name: string;
  capacity: number;
  status?: RoomStatus;
};

export type CreateBookingInput = {
  roomId: string;
  title: string;
  startISO: string;
  endISO: string;
  organizer: string;
};
