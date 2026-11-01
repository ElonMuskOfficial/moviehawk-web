import { GRID } from "@/components/PostGrid";
import { Skeleton } from "@/components/ui/skeleton";

// A post's whole title is under its poster: three bars stand for it, the last one short. One bar a
// line of text-sm leading-snug (14 px on 19 px).
const TITLE_LINES = ["w-full", "w-full", "w-3/5"];

// A listing's shape while it loads: a grid of posters and their titles.
export default function Loading() {
  return (
    <ul className={GRID} aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: 18 }, (_, index) => (
        <li key={index} className="flex flex-col gap-2">
          <Skeleton className="aspect-2/3 w-full rounded-lg" />
          <div className="flex flex-col gap-1.5 py-0.5">
            {TITLE_LINES.map((width, line) => (
              <Skeleton key={line} className={`h-3.5 ${width}`} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
