import { describe, expect, it, beforeEach } from "vitest";

import {
  __resetStoreForTests,
  createMeeting,
  createRoom,
  deleteRoom,
  getRoom,
  listMeetings,
  listRooms,
  updateRoom,
} from "./store";

beforeEach(() => {
  __resetStoreForTests();
});

describe("virtual office store", () => {
  it("creates and lists rooms", () => {
    const r = createRoom({ name: "Alpha", description: "Test" });
    expect(r.name).toBe("Alpha");
    expect(listRooms()).toHaveLength(1);
  });

  it("updates a room", () => {
    const r = createRoom({ name: "Beta" });
    const u = updateRoom(r.id, { name: "Beta 2" });
    expect(u?.name).toBe("Beta 2");
    expect(getRoom(r.id)?.name).toBe("Beta 2");
  });

  it("creates meetings for a room and deletes room clears meetings", () => {
    const r = createRoom({ name: "Gamma" });
    const start = new Date("2026-04-16T14:00:00.000Z");
    const end = new Date("2026-04-16T15:00:00.000Z");
    createMeeting({
      roomId: r.id,
      title: "Sync",
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
    });
    expect(listMeetings(r.id)).toHaveLength(1);
    deleteRoom(r.id);
    expect(listMeetings()).toHaveLength(0);
  });

  it("rejects meeting when end is before start", () => {
    const r = createRoom({ name: "Delta" });
    expect(() =>
      createMeeting({
        roomId: r.id,
        title: "Bad",
        startsAt: "2026-04-16T16:00:00.000Z",
        endsAt: "2026-04-16T15:00:00.000Z",
      })
    ).toThrow(/after start/);
  });
});
