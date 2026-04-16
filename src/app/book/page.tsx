import { BookingForm } from "./booking-form";

import { listRooms } from "@/lib/store";

export default function BookPage() {
  const rooms = listRooms().map((r) => ({ id: r.id, name: r.name }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Book a room
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Pick a space and time. Reservations are stored in this demo workspace
          only.
        </p>
      </div>
      <BookingForm rooms={rooms} />
    </div>
  );
}
