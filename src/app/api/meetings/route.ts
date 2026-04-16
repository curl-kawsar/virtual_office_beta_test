import {
  createMeeting,
  ensureSeed,
  listMeetings,
} from "@/lib/virtual-office/store";

export async function GET(request: Request) {
  ensureSeed();
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId") ?? undefined;
  return Response.json({ meetings: listMeetings(roomId ?? undefined) });
}

export async function POST(request: Request) {
  ensureSeed();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Expected JSON object" }, { status: 400 });
  }
  const b = body as {
    roomId?: unknown;
    title?: unknown;
    startsAt?: unknown;
    endsAt?: unknown;
  };
  if (typeof b.roomId !== "string" || typeof b.title !== "string") {
    return Response.json(
      { error: "roomId and title are required" },
      { status: 400 }
    );
  }
  if (typeof b.startsAt !== "string") {
    return Response.json({ error: "startsAt is required" }, { status: 400 });
  }
  let endsAt: string | null | undefined;
  if (b.endsAt === undefined) {
    endsAt = undefined;
  } else if (b.endsAt === null) {
    endsAt = null;
  } else if (typeof b.endsAt === "string") {
    endsAt = b.endsAt;
  } else {
    return Response.json({ error: "endsAt must be a string or null" }, {
      status: 400,
    });
  }
  try {
    const meeting = createMeeting({
      roomId: b.roomId,
      title: b.title,
      startsAt: b.startsAt,
      endsAt,
    });
    return Response.json({ meeting }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    const status = message === "Room not found" ? 404 : 400;
    return Response.json({ error: message }, { status });
  }
}
