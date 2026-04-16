import {
  createRoom,
  ensureSeed,
  listRooms,
} from "@/lib/virtual-office/store";

export async function GET() {
  ensureSeed();
  return Response.json({ rooms: listRooms() });
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
  const name = (body as { name?: unknown }).name;
  const description = (body as { description?: unknown }).description;
  if (typeof name !== "string") {
    return Response.json({ error: "name is required" }, { status: 400 });
  }
  try {
    const room = createRoom({
      name,
      description: typeof description === "string" ? description : undefined,
    });
    return Response.json({ room }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return Response.json({ error: message }, { status: 400 });
  }
}
