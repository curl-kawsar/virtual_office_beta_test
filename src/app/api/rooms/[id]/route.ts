import type { NextRequest } from "next/server";

import { jsonError, readJson } from "@/lib/json";
import { deleteRoom, getRoom, updateRoom } from "@/lib/store";
import type { RoomStatus } from "@/lib/types";

const statusSet: Set<RoomStatus> = new Set([
  "available",
  "occupied",
  "maintenance",
]);

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/rooms/[id]">
) {
  const { id } = await ctx.params;
  const room = getRoom(id);
  if (!room) {
    return jsonError("Not found", 404);
  }
  return Response.json({ room });
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/rooms/[id]">
) {
  const { id } = await ctx.params;
  const body = await readJson<{
    name?: string;
    capacity?: number;
    status?: string;
  }>(request);
  if ("error" in body) {
    return jsonError(body.error, 400);
  }
  const patch: {
    name?: string;
    capacity?: number;
    status?: RoomStatus;
  } = {};
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return jsonError("name must be a non-empty string", 400);
    }
    patch.name = body.name;
  }
  if (body.capacity !== undefined) {
    if (
      typeof body.capacity !== "number" ||
      !Number.isInteger(body.capacity) ||
      body.capacity < 1
    ) {
      return jsonError("capacity must be a positive integer", 400);
    }
    patch.capacity = body.capacity;
  }
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !statusSet.has(body.status as RoomStatus)) {
      return jsonError("invalid status", 400);
    }
    patch.status = body.status as RoomStatus;
  }
  const room = updateRoom(id, patch);
  if (!room) {
    return jsonError("Not found", 404);
  }
  return Response.json({ room });
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/rooms/[id]">
) {
  const { id } = await ctx.params;
  const ok = deleteRoom(id);
  if (!ok) {
    return jsonError("Not found", 404);
  }
  return new Response(null, { status: 204 });
}
