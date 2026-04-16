import { afterEach, describe, expect, it } from "vitest";

import { GET, POST } from "./route";
import { resetStore } from "@/lib/store";

afterEach(() => {
  resetStore();
});

describe("GET /api/bookings", () => {
  it("returns bookings", async () => {
    const res = await GET(new Request("http://localhost/api/bookings"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { bookings: { id: string }[] };
    expect(Array.isArray(body.bookings)).toBe(true);
    expect(body.bookings.some((b) => b.id === "b1")).toBe(true);
  });

  it("filters by roomId", async () => {
    const res = await GET(
      new Request("http://localhost/api/bookings?roomId=studio-2"),
    );
    const body = (await res.json()) as { bookings: { roomId: string }[] };
    expect(body.bookings.every((b) => b.roomId === "studio-2")).toBe(true);
  });
});

describe("POST /api/bookings", () => {
  it("creates a booking", async () => {
    const res = await POST(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: "focus-1",
          title: "Standup",
          start: "2026-08-01T08:00:00.000Z",
          end: "2026-08-01T08:15:00.000Z",
        }),
      }),
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as { booking: { title: string } };
    expect(body.booking.title).toBe("Standup");
  });

  it("returns 400 for invalid body", async () => {
    const res = await POST(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: "focus-1" }),
      }),
    );
    expect(res.status).toBe(400);
  });
});
