/**
 * Two half-open intervals [start, end) overlap iff startA < endB && startB < endA.
 */
export function intervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && startB < endA;
}

export function parseIsoRange(startISO: string, endISO: string): {
  start: Date;
  end: Date;
} | { error: string } {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: "Invalid date" };
  }
  if (end <= start) {
    return { error: "End must be after start" };
  }
  return { start, end };
}
