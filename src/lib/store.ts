import { randomUUID } from "crypto";

import { intervalsOverlap, parseIsoRange } from "@/lib/booking-utils";
import type {
  Booking,
  CreateBookingInput,
  CreateRoomInput,
  Room,
  RoomStatus,
} from "@/lib/types";

const rooms = new Map<string, Room>();
const bookings = new Map<string, Booking>();

function seed() {
  const r1: Room = {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Focus Pod A",
    capacity: 4,
    status: "available",
  };
  const r2: Room = {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Town Hall",
    capacity: 24,
    status: "available",
  };
  const r3: Room = {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Phone Booth 2",
    capacity: 1,
    status: "maintenance",
  };
  rooms.set(r1.id, r1);
  rooms.set(r2.id, r2);
  rooms.set(r3.id, r3);

  const b1: Booking = {
    id: "10000000-0000-4000-8000-000000000001",
    roomId: r2.id,
    title: "Weekly sync",
    startISO: new Date(Date.now() + 86_400_000).toISOString(),
    endISO: new Date(Date.now() + 86_400_000 + 3_600_000).toISOString(),
    organizer: "team@example.com",
  };
  bookings.set(b1.id, b1);
}

seed();

export function listRooms(): Room[] {
  return [...rooms.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getRoom(id: string): Room | undefined {
  return rooms.get(id);
}

export function createRoom(input: CreateRoomInput): Room {
  const room: Room = {
    id: randomUUID(),
    name: input.name.trim(),
    capacity: input.capacity,
    status: input.status ?? "available",
  };
  rooms.set(room.id, room);
  return room;
}

export function updateRoom(
  id: string,
  patch: Partial<Pick<Room, "name" | "capacity" | "status">>
): Room | undefined {
  const existing = rooms.get(id);
  if (!existing) return undefined;
  const next: Room = {
    ...existing,
    ...patch,
    name: patch.name !== undefined ? patch.name.trim() : existing.name,
  };
  rooms.set(id, next);
  return next;
}

export function deleteRoom(id: string): boolean {
  const existed = rooms.delete(id);
  if (existed) {
    for (const [bid, b] of bookings) {
      if (b.roomId === id) bookings.delete(bid);
    }
  }
  return existed;
}

export function listBookings(filter?: {
  roomId?: string;
}): Booking[] {
  let list = [...bookings.values()];
  if (filter?.roomId) {
    list = list.filter((b) => b.roomId === filter.roomId);
  }
  return list.sort(
    (a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime()
  );
}

export function getBooking(id: string): Booking | undefined {
  return bookings.get(id);
}

function hasConflict(
  roomId: string,
  start: Date,
  end: Date,
  excludeBookingId?: string
): boolean {
  for (const b of bookings.values()) {
    if (b.roomId !== roomId) continue;
    if (excludeBookingId && b.id === excludeBookingId) continue;
    const other = parseIsoRange(b.startISO, b.endISO);
    if ("error" in other) continue;
    if (intervalsOverlap(start, end, other.start, other.end)) {
      return true;
    }
  }
  return false;
}

export type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string };

export function createBooking(input: CreateBookingInput): CreateBookingResult {
  const room = rooms.get(input.roomId);
  if (!room) {
    return { ok: false, error: "Room not found" };
  }
  if (room.status === "maintenance") {
    return { ok: false, error: "Room is in maintenance" };
  }
  const range = parseIsoRange(input.startISO, input.endISO);
  if ("error" in range) {
    return { ok: false, error: range.error };
  }
  if (hasConflict(input.roomId, range.start, range.end)) {
    return { ok: false, error: "Time slot overlaps an existing booking" };
  }
  const booking: Booking = {
    id: randomUUID(),
    roomId: input.roomId,
    title: input.title.trim(),
    startISO: input.startISO,
    endISO: input.endISO,
    organizer: input.organizer.trim(),
  };
  bookings.set(booking.id, booking);
  return { ok: true, booking };
}

export function deleteBooking(id: string): boolean {
  return bookings.delete(id);
}

/** Test helper: reset store to a deterministic seed (same room names, new ids). */
export function resetStoreForTests() {
  rooms.clear();
  bookings.clear();
  seed();
}

export function __dangerouslySetRoomStatusForTests(id: string, status: RoomStatus) {
  const r = rooms.get(id);
  if (r) rooms.set(id, { ...r, status });
}
