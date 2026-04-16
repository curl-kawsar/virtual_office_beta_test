import Link from "next/link";

import { CancelBookingButton } from "@/components/cancel-booking-button";
import { PageShell } from "@/components/page-shell";
import { listBookings, listRooms } from "@/lib/store";

export default function BookingsPage() {
  const bookings = listBookings();
  const rooms = listRooms();
  const byId = new Map(rooms.map((r) => [r.id, r]));

  return (
    <PageShell
      title="Bookings"
      description="Every reservation across rooms. Cancel frees the slot for others immediately."
    >
      {bookings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No bookings yet.{" "}
          <Link
            href="/rooms"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 dark:text-zinc-100"
          >
            Pick a room
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {bookings.map((b) => {
            const room = byId.get(b.roomId);
            return (
              <li
                key={b.id}
                className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {b.title}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {room ? (
                      <Link
                        href={`/rooms/${room.id}`}
                        className="hover:underline"
                      >
                        {room.name}
                      </Link>
                    ) : (
                      "Unknown room"
                    )}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(b.startISO).toLocaleString()} –{" "}
                    {new Date(b.endISO).toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {b.organizer}
                  </p>
                </div>
                <CancelBookingButton bookingId={b.id} />
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
