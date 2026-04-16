import Link from "next/link";

import { ensureSeed, listRooms } from "@/lib/virtual-office/store";

export default function RoomsPage() {
  ensureSeed();
  const rooms = listRooms();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Rooms
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Spaces where your team meets. Open a room to edit details or
            schedule time.
          </p>
        </div>
        <Link
          href="/rooms/new"
          className="self-start rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          New room
        </Link>
      </div>

      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {rooms.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-zinc-500">
            No rooms yet.{" "}
            <Link href="/rooms/new" className="font-medium text-zinc-900 underline dark:text-zinc-200">
              Create one
            </Link>
            .
          </li>
        ) : (
          rooms.map((r) => (
            <li key={r.id}>
              <Link
                href={`/rooms/${r.id}`}
                className="block px-4 py-5 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {r.name}
                </span>
                {r.description ? (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {r.description}
                  </p>
                ) : null}
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
