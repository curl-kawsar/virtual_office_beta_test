import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { listBookings, listRooms } from "@/lib/store";

export default function Home() {
  const rooms = listRooms();
  const bookings = listBookings();
  const available = rooms.filter((r) => r.status === "available").length;
  const maintenance = rooms.filter((r) => r.status === "maintenance").length;

  const upcoming = bookings
    .filter((b) => new Date(b.startISO) >= new Date())
    .slice(0, 4);

  return (
    <PageShell
      title="Dashboard"
      description="A quick snapshot of rooms and what is booked next. Everything here is stored in memory for this demo."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Rooms
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {rooms.length}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {available} available · {maintenance} in maintenance
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Bookings
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {bookings.length}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Includes the seeded sample reservation
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Next step
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            Add a room or book time in{" "}
            <Link
              href="/rooms"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600"
            >
              Rooms
            </Link>
            .
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Rooms overview
        </h2>
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  href={`/rooms/${room.id}`}
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  {room.name}
                </Link>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Capacity {room.capacity}
                </p>
              </div>
              <StatusBadge status={room.status} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Upcoming bookings
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No upcoming bookings. Create one from a room page.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {upcoming.map((b) => {
              const room = rooms.find((r) => r.id === b.roomId);
              return (
                <li key={b.id} className="px-4 py-3">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {b.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {room?.name ?? "Room"} ·{" "}
                    {new Date(b.startISO).toLocaleString()} –{" "}
                    {new Date(b.endISO).toLocaleTimeString()}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
