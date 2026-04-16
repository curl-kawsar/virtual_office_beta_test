import type {
  CreateMeetingInput,
  CreateRoomInput,
  Meeting,
  Room,
  UpdateRoomInput,
} from "./types";

const rooms = new Map<string, Room>();
const meetings = new Map<string, Meeting>();

let seeded = false;

/** Demo data for first load (in-memory only). */
export function ensureSeed() {
  if (seeded || rooms.size > 0) return;
  seeded = true;
  const main = createRoom({
    name: "Main conference",
    description: "Default room for team syncs.",
  });
  const focus = createRoom({
    name: "Focus pod",
    description: "Quiet space for deep work check-ins.",
  });
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  createMeeting({
    roomId: main.id,
    title: "Weekly standup",
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
  });
  createMeeting({
    roomId: focus.id,
    title: "Design review",
    startsAt: new Date(start.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    endsAt: null,
  });
}

function nowIso() {
  return new Date().toISOString();
}

export function listRooms(): Room[] {
  return [...rooms.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

export function getRoom(id: string): Room | undefined {
  return rooms.get(id);
}

export function createRoom(input: CreateRoomInput): Room {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Room name is required");
  }
  const id = crypto.randomUUID();
  const ts = nowIso();
  const room: Room = {
    id,
    name,
    description: (input.description ?? "").trim(),
    createdAt: ts,
    updatedAt: ts,
  };
  rooms.set(id, room);
  return room;
}

export function updateRoom(id: string, input: UpdateRoomInput): Room | undefined {
  const existing = rooms.get(id);
  if (!existing) return undefined;
  const name =
    input.name !== undefined ? input.name.trim() : existing.name;
  if (!name) {
    throw new Error("Room name cannot be empty");
  }
  const description =
    input.description !== undefined
      ? input.description.trim()
      : existing.description;
  const updated: Room = {
    ...existing,
    name,
    description,
    updatedAt: nowIso(),
  };
  rooms.set(id, updated);
  return updated;
}

export function deleteRoom(id: string): boolean {
  const existed = rooms.delete(id);
  if (existed) {
    for (const [mid, m] of meetings) {
      if (m.roomId === id) meetings.delete(mid);
    }
  }
  return existed;
}

export function listMeetings(roomId?: string): Meeting[] {
  const all = [...meetings.values()];
  const filtered = roomId
    ? all.filter((m) => m.roomId === roomId)
    : all;
  return filtered.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
}

export function getMeeting(id: string): Meeting | undefined {
  return meetings.get(id);
}

export function createMeeting(input: CreateMeetingInput): Meeting {
  const room = rooms.get(input.roomId);
  if (!room) {
    throw new Error("Room not found");
  }
  const title = input.title.trim();
  if (!title) {
    throw new Error("Meeting title is required");
  }
  const starts = new Date(input.startsAt);
  if (Number.isNaN(starts.getTime())) {
    throw new Error("Invalid start time");
  }
  let endsAt: string | null = null;
  if (input.endsAt != null && input.endsAt !== "") {
    const ends = new Date(input.endsAt);
    if (Number.isNaN(ends.getTime())) {
      throw new Error("Invalid end time");
    }
    if (ends.getTime() <= starts.getTime()) {
      throw new Error("End time must be after start time");
    }
    endsAt = ends.toISOString();
  }
  const id = crypto.randomUUID();
  const meeting: Meeting = {
    id,
    roomId: input.roomId,
    title,
    startsAt: starts.toISOString(),
    endsAt,
    createdAt: nowIso(),
  };
  meetings.set(id, meeting);
  return meeting;
}

/** Test-only: reset store between tests */
export function __resetStoreForTests() {
  rooms.clear();
  meetings.clear();
  seeded = false;
}
