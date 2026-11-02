import { Skeleton } from "@/components/ui/skeleton";

// A link opens in 1 to 10 s: the pages on the way, then a file's download servers. Its shape while
// it loads, as a page of files and a file's downloads lay it out: a title and its source, then lines.
export default function Loading() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-40" />
        <p className="text-sm text-muted-foreground">Opening the link… this can take up to 10 seconds.</p>
      </header>
      <ul className="divide-y divide-border/60" aria-label="Loading">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index} className="flex min-h-11 items-center justify-between gap-6 py-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </li>
        ))}
      </ul>
    </section>
  );
}
