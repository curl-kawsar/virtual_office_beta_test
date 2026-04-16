import { NextResponse } from "next/server";

import { listRooms } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ rooms: listRooms() });
}
