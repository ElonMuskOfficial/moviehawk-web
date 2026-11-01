import { Skeleton } from "@/components/ui/skeleton";

// The rows of a post's links, a link's files and a file's downloads: one look for the three steps.
export const ROW = "flex min-h-14 items-center gap-3 rounded-lg border bg-card px-4 py-3";

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
