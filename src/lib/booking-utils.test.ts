import { describe, expect, it } from "vitest";

import { intervalsOverlap, parseIsoRange } from "@/lib/booking-utils";

describe("intervalsOverlap", () => {
  it("detects overlap on shared boundary as non-overlap for half-open intervals", () => {
    const a0 = new Date("2026-01-01T10:00:00.000Z");
    const a1 = new Date("2026-01-01T11:00:00.000Z");
    const b0 = new Date("2026-01-01T11:00:00.000Z");
    const b1 = new Date("2026-01-01T12:00:00.000Z");
    expect(intervalsOverlap(a0, a1, b0, b1)).toBe(false);
  });

  it("detects overlap when one interval is fully inside another", () => {
    const outer0 = new Date("2026-01-01T09:00:00.000Z");
    const outer1 = new Date("2026-01-01T12:00:00.000Z");
    const inner0 = new Date("2026-01-01T10:00:00.000Z");
    const inner1 = new Date("2026-01-01T11:00:00.000Z");
    expect(intervalsOverlap(outer0, outer1, inner0, inner1)).toBe(true);
  });
});

describe("parseIsoRange", () => {
  it("rejects end before start", () => {
    const r = parseIsoRange(
      "2026-01-01T12:00:00.000Z",
      "2026-01-01T11:00:00.000Z"
    );
    expect("error" in r).toBe(true);
  });
});
