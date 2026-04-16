import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Virtual Office
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
        Your team&apos;s place online
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        Browse shared rooms, see who is around, and book time without leaving
        this app. Data lives in memory for this demo.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/rooms"
          className="inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-900"
        >
          View rooms
        </Link>
        <Link
          href="/directory"
          className="inline-flex rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Open directory
        </Link>
        <Link
          href="/book"
          className="inline-flex rounded-full border border-transparent px-6 py-3 text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          Book a room
        </Link>
      </div>
    </div>
  );
}
