import { Skeleton } from "@/components/ui/skeleton";

// The rows of a post's links, a link's files and a file's downloads: one look for the three steps.
export const ROW = "flex min-h-14 items-center gap-3 rounded-lg border bg-card px-4 py-3";

/** @param {{ children: React.ReactNode, label: string }} props */
export function RowList({ children, label }) {
  return (
    <ul className="flex flex-col gap-2" aria-label={label}>
      {children}
    </ul>
  );
}

/** @param {{ rows?: number }} props */
export function RowListSkeleton({ rows = 4 }) {
  return (
    <ul className="flex flex-col gap-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index}>
          <Skeleton className="h-14 w-full rounded-lg" />
        </li>
      ))}
    </ul>
  );
}
