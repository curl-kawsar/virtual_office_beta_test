import Link from "next/link";
import { notFound } from "next/navigation";

import { getRoom, listBookings } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export default async function RoomDetailPage({ params }: Props) {
  const { id } = await params;
  const room = getRoom(id);
  if (!room) {
    notFound();
  }
  const bookings = listBookings(room.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/rooms"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← All rooms
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {room.name}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Floor {room.floor} · up to {room.capacity} people
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {room.amenities.map((a) => (
          <span
            key={a}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {a}
          </span>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Upcoming bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            No bookings yet.{" "}
            <Link href="/book" className="font-medium underline">
              Reserve this room
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {b.title}
                </p>
                <p className="text-sm text-zinc-500">
                  {new Date(b.start).toLocaleString()} –{" "}
                  {new Date(b.end).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="mt-8">
        <Link
          href="/book"
          className="inline-flex rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Book this room
        </Link>
      </p>
    </div>
  );
}
