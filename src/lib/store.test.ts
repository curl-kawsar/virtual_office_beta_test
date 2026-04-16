import { afterEach, describe, expect, it } from "vitest";

import {
  createBooking,
  deleteBooking,
  listBookings,
  resetStoreForTests,
} from "@/lib/store";

afterEach(() => {
  resetStoreForTests();
});

describe("createBooking", () => {
  it("blocks overlapping bookings in the same room", () => {
    const roomId = "00000000-0000-4000-8000-000000000002";
    const first = createBooking({
      roomId,
      title: "A",
      startISO: "2026-06-01T14:00:00.000Z",
      endISO: "2026-06-01T15:00:00.000Z",
      organizer: "a@example.com",
    });
    expect(first.ok).toBe(true);

    const second = createBooking({
      roomId,
      title: "B",
      startISO: "2026-06-01T14:30:00.000Z",
      endISO: "2026-06-01T15:30:00.000Z",
      organizer: "b@example.com",
    });
    expect(second.ok).toBe(false);
    if (second.ok) throw new Error("unexpected");
    expect(second.error).toMatch(/overlap/i);
  });

  it("allows adjacent bookings that touch at the boundary", () => {
    const roomId = "00000000-0000-4000-8000-000000000001";
    const first = createBooking({
      roomId,
      title: "A",
      startISO: "2026-06-02T10:00:00.000Z",
      endISO: "2026-06-02T11:00:00.000Z",
      organizer: "a@example.com",
    });
    const second = createBooking({
      roomId,
      title: "B",
      startISO: "2026-06-02T11:00:00.000Z",
      endISO: "2026-06-02T12:00:00.000Z",
      organizer: "b@example.com",
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
  });

  it("rejects booking a maintenance room", () => {
    const roomId = "00000000-0000-4000-8000-000000000003";
    const r = createBooking({
      roomId,
      title: "X",
      startISO: "2026-07-01T09:00:00.000Z",
      endISO: "2026-07-01T10:00:00.000Z",
      organizer: "x@example.com",
    });
    expect(r.ok).toBe(false);
  });
});

describe("deleteBooking", () => {
  it("removes a booking", () => {
    const roomId = "00000000-0000-4000-8000-000000000001";
    const created = createBooking({
      roomId,
      title: "Temp",
      startISO: "2026-08-01T12:00:00.000Z",
      endISO: "2026-08-01T13:00:00.000Z",
      organizer: "z@example.com",
    });
    if (!created.ok) throw new Error("setup");
    expect(listBookings({ roomId }).some((b) => b.id === created.booking.id)).toBe(
      true
    );
    deleteBooking(created.booking.id);
    expect(listBookings({ roomId }).some((b) => b.id === created.booking.id)).toBe(
      false
    );
  });
});
