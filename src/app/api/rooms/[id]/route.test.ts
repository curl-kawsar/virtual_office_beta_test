import { afterEach, describe, expect, it } from "vitest";

import { GET } from "./route";
import { resetStore } from "@/lib/store";

afterEach(() => {
  resetStore();
});

describe("GET /api/rooms/[id]", () => {
  it("returns a room", async () => {
    const res = await GET(new Request("http://localhost/api/rooms/studio-2"), {
      params: Promise.resolve({ id: "studio-2" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { room: { name: string } };
    expect(body.room.name).toBe("Studio B");
  });

  it("returns 404 for unknown id", async () => {
    const res = await GET(new Request("http://localhost/api/rooms/x"), {
      params: Promise.resolve({ id: "unknown" }),
    });
    expect(res.status).toBe(404);
  });
});
