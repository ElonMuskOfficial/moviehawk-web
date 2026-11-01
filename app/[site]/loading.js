import { GRID } from "@/components/PostGrid";
import { Skeleton } from "@/components/ui/skeleton";

// A post's whole title is under its poster: 2 to 6 lines live, so the cards' lines vary too, and a
// title's last line is short. One bar a line of text-sm leading-snug (14 px on 19 px).
const LINES = [3, 4, 2, 3, 4, 3];
const LAST = ["w-3/5", "w-2/5", "w-4/5", "w-1/2"];

// A listing's shape while it loads: a grid of posters and their titles.
export default function Loading() {
  return (
    <ul className={GRID} aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: 18 }, (_, index) => {
        const lines = LINES[index % LINES.length];
        return (
          <li key={index} className="flex flex-col gap-2">
            <Skeleton className="aspect-2/3 w-full rounded-lg" />
            <div className="flex flex-col gap-1.5 py-0.5">
              {Array.from({ length: lines }, (_, line) => (
                <Skeleton key={line} className={`h-3.5 ${line === lines - 1 ? LAST[index % LAST.length] : "w-full"}`} />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
