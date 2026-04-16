"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs font-medium text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
    >
      {pending ? "Canceling…" : "Cancel"}
    </button>
  );
}
