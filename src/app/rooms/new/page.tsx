import { RoomCreateForm } from "@/components/room-create-form";

export default function NewRoomPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          New room
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Give your virtual space a name and a short description.
        </p>
      </div>
      <RoomCreateForm />
    </main>
  );
}
