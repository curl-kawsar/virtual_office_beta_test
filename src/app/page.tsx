import Link from "next/link";

import { ensureSeed, listMeetings, listRooms } from "@/lib/virtual-office/store";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Home() {
  ensureSeed();
  const rooms = listRooms();
  const roomById = new Map(rooms.map((r) => [r.id, r]));
  const meetings = listMeetings().slice(0, 5);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome to your virtual office
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Create rooms for recurring collaboration, then schedule meetings with
          clear start times. Data lives in memory on this server (for demos and
          development).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/rooms/new"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Create a room
          </Link>
          <Link
            href="/schedule"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            View schedule
          </Link>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Rooms
          </h2>
          <ul className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {rooms.length === 0 ? (
              <li className="px-4 py-6 text-sm text-zinc-500">
                No rooms yet.
              </li>
            ) : (
              rooms.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/rooms/${r.id}`}
                    className="block px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {r.name}
                    </span>
                    {r.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {r.description}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Upcoming meetings
          </h2>
          <ul className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {meetings.length === 0 ? (
              <li className="px-4 py-6 text-sm text-zinc-500">
                No meetings scheduled.
              </li>
            ) : (
              meetings.map((m) => {
                const room = roomById.get(m.roomId);
                return (
                  <li key={m.id} className="px-4 py-4">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {m.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatWhen(m.startsAt)}
                      {room ? ` · ${room.name}` : ""}
                    </p>
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
