import Link from "next/link";

import { CreateRoomForm } from "@/components/create-room-form";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { listRooms } from "@/lib/store";

export default function RoomsPage() {
  const rooms = listRooms();

  return (
    <PageShell
      title="Rooms"
      description="Create spaces your team can book. Status helps everyone see what is usable at a glance."
    >
      <CreateRoomForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          All rooms
        </h2>
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  href={`/rooms/${room.id}`}
                  className="text-base font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  {room.name}
                </Link>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Fits up to {room.capacity} people
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={room.status} />
                <Link
                  href={`/rooms/${room.id}`}
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Open →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
