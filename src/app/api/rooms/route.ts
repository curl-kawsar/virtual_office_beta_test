import { jsonError, readJson } from "@/lib/json";
import { createRoom, listRooms } from "@/lib/store";
import type { CreateRoomInput } from "@/lib/types";

export async function GET() {
  return Response.json({ rooms: listRooms() });
}

export async function POST(request: Request) {
  const body = await readJson<Partial<CreateRoomInput>>(request);
  if ("error" in body) {
    return jsonError(body.error, 400);
  }
  const name = typeof body.name === "string" ? body.name : "";
  const capacity =
    typeof body.capacity === "number" && Number.isFinite(body.capacity)
      ? body.capacity
      : NaN;
  if (!name.trim()) {
    return jsonError("name is required", 400);
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    return jsonError("capacity must be a positive integer", 400);
  }
  const room = createRoom({
    name,
    capacity,
    status: body.status,
  });
  return Response.json({ room }, { status: 201 });
}
