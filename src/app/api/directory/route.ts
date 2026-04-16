import { NextResponse } from "next/server";

import { listPeople } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ people: listPeople() });
}
