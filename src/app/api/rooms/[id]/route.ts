import { NextResponse } from "next/server";

import { getRoom } from "@/lib/store";

type Params = { id: string };

export async function GET(
  _request: Request,
  context: { params: Promise<Params> },
) {
  const { id } = await context.params;
  const room = getRoom(id);
  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ room });
}
