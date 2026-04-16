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

export default function SchedulePage() {
  ensureSeed();
  const meetings = listMeetings();
  const rooms = listRooms();
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? "Room";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Schedule
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          All meetings across rooms, ordered by start time.
        </p>
      </div>

      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {meetings.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-zinc-500">
            No meetings yet. Open a{" "}
            <Link href="/rooms" className="font-medium underline">
              room
            </Link>{" "}
            to schedule one.
          </li>
        ) : (
          meetings.map((m) => (
            <li key={m.id} className="px-4 py-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {m.title}
                </p>
                <Link
                  href={`/rooms/${m.roomId}`}
                  className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                >
                  {roomName(m.roomId)}
                </Link>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {formatWhen(m.startsAt)}
                {m.endsAt ? ` – ${formatWhen(m.endsAt)}` : ""}
              </p>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
