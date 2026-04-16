import {
  deleteRoom,
  ensureSeed,
  getRoom,
  updateRoom,
} from "@/lib/virtual-office/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  ensureSeed();
  const { id } = await context.params;
  const room = getRoom(id);
  if (!room) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ room });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  ensureSeed();
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Expected JSON object" }, { status: 400 });
  }
  const name = (body as { name?: unknown }).name;
  const description = (body as { description?: unknown }).description;
  try {
    const room = updateRoom(id, {
      ...(typeof name === "string" ? { name } : {}),
      ...(typeof description === "string" ? { description } : {}),
    });
    if (!room) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ room });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  ensureSeed();
  const { id } = await context.params;
  const ok = deleteRoom(id);
  if (!ok) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
