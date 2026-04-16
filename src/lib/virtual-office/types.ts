export type Room = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Meeting = {
  id: string;
  roomId: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
};

export type CreateRoomInput = {
  name: string;
  description?: string;
};

export type UpdateRoomInput = {
  name?: string;
  description?: string;
};

export type CreateMeetingInput = {
  roomId: string;
  title: string;
  startsAt: string;
  endsAt?: string | null;
};
