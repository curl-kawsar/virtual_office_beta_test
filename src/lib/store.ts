import type { Booking, Person, Room } from "./types";

const seedRooms: Room[] = [
  {
    id: "focus-1",
    name: "Focus Pod A",
    capacity: 2,
    floor: "3",
    amenities: ["Display", "Whiteboard"],
  },
  {
    id: "studio-2",
    name: "Studio B",
    capacity: 8,
    floor: "2",
    amenities: ["VC", "Display", "Whiteboard"],
  },
  {
    id: "lounge-3",
    name: "Lounge North",
    capacity: 12,
    floor: "4",
    amenities: ["Sofas", "Coffee"],
  },
];

const seedPeople: Person[] = [
  {
    id: "p1",
    name: "Alex Rivera",
    role: "Product",
    email: "alex@example.com",
  },
  {
    id: "p2",
    name: "Jordan Lee",
    role: "Engineering",
    email: "jordan@example.com",
  },
  {
    id: "p3",
    name: "Sam Okonkwo",
    role: "Design",
    email: "sam@example.com",
  },
];

const seedBookings: Booking[] = [
  {
    id: "b1",
    roomId: "studio-2",
    title: "Sprint planning",
    start: "2026-04-20T14:00:00.000Z",
    end: "2026-04-20T15:00:00.000Z",
  },
];

let rooms: Room[] = [...seedRooms];
let people: Person[] = [...seedPeople];
let bookings: Booking[] = [...seedBookings];

/** Test-only: restore deterministic seed state */
export function resetStore(): void {
  rooms = [...seedRooms];
  people = [...seedPeople];
  bookings = [...seedBookings];
}

export function listRooms(): Room[] {
  return [...rooms];
}

export function getRoom(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}

export function listBookings(roomId?: string): Booking[] {
  const list = [...bookings].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
  return roomId ? list.filter((b) => b.roomId === roomId) : list;
}

export function listPeople(): Person[] {
  return [...people];
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function createBooking(input: Omit<Booking, "id">): Booking | { error: string } {
  const room = getRoom(input.roomId);
  if (!room) {
    return { error: "Room not found" };
  }
  const start = new Date(input.start);
  const end = new Date(input.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: "Invalid start or end time" };
  }
  if (start >= end) {
    return { error: "End must be after start" };
  }
  const conflict = bookings.some(
    (b) =>
      b.roomId === input.roomId &&
      overlaps(start, end, new Date(b.start), new Date(b.end)),
  );
  if (conflict) {
    return { error: "Time overlaps an existing booking for this room" };
  }
  const booking: Booking = {
    ...input,
    id: `b-${crypto.randomUUID()}`,
  };
  bookings = [...bookings, booking];
  return booking;
}
