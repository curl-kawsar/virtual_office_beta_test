import { afterEach, describe, expect, it } from "vitest";

import {
  createBooking,
  getRoom,
  listBookings,
  listPeople,
  listRooms,
  resetStore,
} from "./store";

afterEach(() => {
  resetStore();
});

describe("listRooms", () => {
  it("returns seeded rooms", () => {
    const rooms = listRooms();
    expect(rooms.length).toBeGreaterThan(0);
    expect(rooms.some((r) => r.id === "studio-2")).toBe(true);
  });
});

describe("createBooking", () => {
  it("creates a booking when the slot is free", () => {
    const room = getRoom("focus-1");
    expect(room).toBeDefined();
    const result = createBooking({
      roomId: "focus-1",
      title: "1:1",
      start: "2026-05-01T10:00:00.000Z",
      end: "2026-05-01T10:30:00.000Z",
    });
    expect("id" in result).toBe(true);
    if ("id" in result) {
      expect(result.title).toBe("1:1");
    }
    const forRoom = listBookings("focus-1");
    expect(forRoom.some((b) => b.title === "1:1")).toBe(true);
  });

  it("rejects overlap on the same room", () => {
    const first = createBooking({
      roomId: "focus-1",
      title: "A",
      start: "2026-06-01T12:00:00.000Z",
      end: "2026-06-01T13:00:00.000Z",
    });
    expect("id" in first).toBe(true);
    const second = createBooking({
      roomId: "focus-1",
      title: "B",
      start: "2026-06-01T12:30:00.000Z",
      end: "2026-06-01T14:00:00.000Z",
    });
    expect(second).toEqual({
      error: "Time overlaps an existing booking for this room",
    });
  });

  it("rejects unknown room", () => {
    const result = createBooking({
      roomId: "nope",
      title: "X",
      start: "2026-07-01T09:00:00.000Z",
      end: "2026-07-01T10:00:00.000Z",
    });
    expect(result).toEqual({ error: "Room not found" });
  });
});

describe("listPeople", () => {
  it("returns directory entries", () => {
    expect(listPeople().length).toBeGreaterThan(0);
  });
});
