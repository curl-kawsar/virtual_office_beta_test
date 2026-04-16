import Link from "next/link";
import { notFound } from "next/navigation";

import { MeetingForm } from "@/components/meeting-form";
import { RoomDeleteButton } from "@/components/room-delete-button";
import { RoomEditForm } from "@/components/room-edit-form";
import { ensureSeed, getRoom, listMeetings } from "@/lib/virtual-office/store";

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

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  ensureSeed();
  const { id } = await params;
  const room = getRoom(id);
  if (!room) notFound();

  const meetings = listMeetings(id);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10">
      <div>
        <Link
          href="/rooms"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← All rooms
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {room.name}
        </h1>
        {room.description ? (
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {room.description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Edit room
          </h2>
          <RoomEditForm
            roomId={room.id}
            initialName={room.name}
            initialDescription={room.description}
          />
          <RoomDeleteButton roomId={room.id} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Schedule a meeting
          </h2>
          <MeetingForm roomId={room.id} />
        </section>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Meetings in this room
        </h2>
        <ul className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {meetings.length === 0 ? (
            <li className="px-4 py-6 text-sm text-zinc-500">
              No meetings yet. Use the form above to add one.
            </li>
          ) : (
            meetings.map((m) => (
              <li key={m.id} className="px-4 py-4">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {m.title}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {formatWhen(m.startsAt)}
                  {m.endsAt ? ` – ${formatWhen(m.endsAt)}` : ""}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
