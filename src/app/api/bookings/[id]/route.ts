import type { NextRequest } from "next/server";

import { jsonError } from "@/lib/json";
import { deleteBooking, getBooking } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/bookings/[id]">
) {
  const { id } = await ctx.params;
  const booking = getBooking(id);
  if (!booking) {
    return jsonError("Not found", 404);
  }
  return Response.json({ booking });
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/bookings/[id]">
) {
  const { id } = await ctx.params;
  const ok = deleteBooking(id);
  if (!ok) {
    return jsonError("Not found", 404);
  }
  return new Response(null, { status: 204 });
}
