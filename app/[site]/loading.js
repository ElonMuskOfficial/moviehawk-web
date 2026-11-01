import { GRID } from "@/components/PostGrid";
import { Skeleton } from "@/components/ui/skeleton";

// A listing's shape while it loads: a grid of posters.
export default function Loading() {
  return (
    <ul className={GRID} aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: 18 }, (_, index) => (
        <li key={index} className="flex flex-col gap-2">
          <Skeleton className="aspect-2/3 w-full rounded-lg" />
          <Skeleton className="h-4 w-4/5" />
        </li>
      ))}
    </ul>
  );
}
