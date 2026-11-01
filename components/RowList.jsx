import { Skeleton } from "@/components/ui/skeleton";

// The rows of a post's links, a link's files and a file's downloads: one look for every step.
export const ROW = "flex min-h-14 items-center gap-3 rounded-lg border bg-card px-4 py-3";

// A row that is a link to the next step.
export const ROW_LINK = `${ROW} transition hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none`;

/** @param {{ children: React.ReactNode, label: string, className?: string }} props className: the list's layout, a column by default */
export function RowList({ children, label, className = "flex flex-col" }) {
  return (
    <ul className={`${className} gap-2`} aria-label={label}>
      {children}
    </ul>
  );
}

/** @param {{ rows?: number, className?: string }} props className: as RowList's */
export function RowListSkeleton({ rows = 4, className = "flex flex-col" }) {
  return (
    <ul className={`${className} gap-2`} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index}>
          <Skeleton className="h-14 w-full rounded-lg" />
        </li>
      ))}
    </ul>
  );
}
