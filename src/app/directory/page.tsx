import { listPeople } from "@/lib/store";

export default function DirectoryPage() {
  const people = listPeople();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Directory
      </h1>
      <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
        Who is in this workspace. Demo data only.
      </p>
      <ul className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
        {people.map((person) => (
          <li
            key={person.id}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {person.name}
              </p>
              <p className="text-sm text-zinc-500">{person.role}</p>
            </div>
            <a
              href={`mailto:${person.email}`}
              className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
            >
              {person.email}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
