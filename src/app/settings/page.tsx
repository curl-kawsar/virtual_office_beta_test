import { PageShell } from "@/components/page-shell";

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Operational notes for this demo app. There is no persistent account system yet."
    >
      <div>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li>
            Data lives in server memory only; restarting the process clears rooms
            and bookings.
          </li>
          <li>
            API health check:{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              GET /api/health
            </code>
          </li>
          <li>
            REST endpoints:{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              /api/rooms
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              /api/bookings
            </code>
          </li>
        </ul>
      </div>
    </PageShell>
  );
}
