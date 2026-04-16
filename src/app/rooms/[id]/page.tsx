import Link from "next/link";
import { notFound } from "next/navigation";

import { CancelBookingButton } from "@/components/cancel-booking-button";
import { PageShell } from "@/components/page-shell";
import { RoomBookingForm } from "@/components/room-booking-form";
import { StatusBadge } from "@/components/status-badge";
import { getRoom, listBookings } from "@/lib/store";

type RoomPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomDetailPage({ params }: RoomPageProps) {
  const { id } = await params;
  const room = getRoom(id);
  if (!room) {
    notFound();
  }
  const bookings = listBookings({ roomId: id });

  const canBook = room.status !== "maintenance";

  return (
    <PageShell
      title={room.name}
      description="View status and upcoming reservations, or book a new slot."
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={room.status} />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Capacity {room.capacity}
        </span>
        <Link
          href="/rooms"
          className="ml-auto text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          ← All rooms
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Bookings for this room
          </h2>
          {bookings.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No bookings yet.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {b.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(b.startISO).toLocaleString()} –{" "}
                      {new Date(b.endISO).toLocaleString()}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {b.organizer}
                    </p>
                  </div>
                  <CancelBookingButton bookingId={b.id} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <RoomBookingForm
          roomId={room.id}
          roomName={room.name}
          disabled={!canBook}
        />
      </div>
    </PageShell>
  );
}
