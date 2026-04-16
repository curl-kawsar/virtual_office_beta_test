import { NextResponse } from "next/server";

import { createBooking, listBookings } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId") ?? undefined;
  return NextResponse.json({ bookings: listBookings(roomId) });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected JSON object" }, { status: 400 });
  }
  const { roomId, title, start, end } = body as Record<string, unknown>;
  if (
    typeof roomId !== "string" ||
    typeof title !== "string" ||
    typeof start !== "string" ||
    typeof end !== "string"
  ) {
    return NextResponse.json(
      { error: "roomId, title, start, and end are required strings" },
      { status: 400 },
    );
  }
  const result = createBooking({ roomId, title, start, end });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ booking: result }, { status: 201 });
}
