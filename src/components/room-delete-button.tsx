"use client";

import { useActionState } from "react";

import { deleteRoomFromFormAction } from "@/app/actions";

export function RoomDeleteButton({ roomId }: { roomId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return deleteRoomFromFormAction(formData);
    },
    null
  );

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="roomId" value={roomId} />
      {state?.error ? (
        <p className="mb-2 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/70"
      >
        {pending ? "Deleting…" : "Delete room"}
      </button>
    </form>
  );
}
