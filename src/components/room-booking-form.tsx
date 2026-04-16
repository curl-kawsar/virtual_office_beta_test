"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type RoomBookingFormProps = {
  roomId: string;
  roomName: string;
  disabled?: boolean;
};

function defaultRange() {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return { start, end };
}

export function RoomBookingForm({
  roomId,
  roomName,
  disabled,
}: RoomBookingFormProps) {
  const router = useRouter();
  const initial = useMemo(() => defaultRange(), []);
  const [title, setTitle] = useState(`${roomName} — session`);
  const [startLocal, setStartLocal] = useState(
    initial.start.toISOString().slice(0, 16)
  );
  const [endLocal, setEndLocal] = useState(
    initial.end.toISOString().slice(0, 16)
  );
  const [organizer, setOrganizer] = useState("you@company.com");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setError(null);
    setPending(true);
    const startISO = new Date(startLocal).toISOString();
    const endISO = new Date(endLocal).toISOString();
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          title,
          startISO,
          endISO,
          organizer,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not book");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Book this room
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Times are saved in UTC; overlap with existing bookings is blocked.
        </p>
      </div>
      <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
        Title
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Start
          <input
            required
            type="datetime-local"
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
            disabled={disabled}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          End
          <input
            required
            type="datetime-local"
            value={endLocal}
            onChange={(e) => setEndLocal(e.target.value)}
            disabled={disabled}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
        Organizer email
        <input
          required
          type="email"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          disabled={disabled}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Booking…" : disabled ? "Unavailable" : "Reserve slot"}
      </button>
    </form>
  );
}
