import Link from "next/link";

import { listBookings, listRooms } from "@/lib/store";

export default function RoomsPage() {
  const rooms = listRooms();
  const bookings = listBookings();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Rooms
      </h1>
      <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
        Shared spaces you can reserve. Open a room for details and amenities.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => {
          const count = bookings.filter((b) => b.roomId === room.id).length;
          return (
            <li key={room.id}>
              <Link
                href={`/rooms/${room.id}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {room.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Floor {room.floor} · up to {room.capacity} people · {count}{" "}
                  booking{count === 1 ? "" : "s"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
