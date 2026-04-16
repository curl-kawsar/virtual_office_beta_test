import type { NextRequest } from "next/server";

import { jsonError, readJson } from "@/lib/json";
import { createBooking, listBookings } from "@/lib/store";
import type { CreateBookingInput } from "@/lib/types";

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get("roomId") ?? undefined;
  return Response.json({ bookings: listBookings({ roomId }) });
}

export async function POST(request: Request) {
  const body = await readJson<Partial<CreateBookingInput>>(request);
  if ("error" in body) {
    return jsonError(body.error, 400);
  }
  const roomId = typeof body.roomId === "string" ? body.roomId : "";
  const title = typeof body.title === "string" ? body.title : "";
  const startISO = typeof body.startISO === "string" ? body.startISO : "";
  const endISO = typeof body.endISO === "string" ? body.endISO : "";
  const organizer = typeof body.organizer === "string" ? body.organizer : "";
  if (!roomId.trim()) {
    return jsonError("roomId is required", 400);
  }
  if (!title.trim()) {
    return jsonError("title is required", 400);
  }
  if (!startISO || !endISO) {
    return jsonError("startISO and endISO are required", 400);
  }
  if (!organizer.trim()) {
    return jsonError("organizer is required", 400);
  }
  const result = createBooking({
    roomId,
    title,
    startISO,
    endISO,
    organizer,
  });
  if (!result.ok) {
    return jsonError(result.error, 409);
  }
  return Response.json({ booking: result.booking }, { status: 201 });
}
