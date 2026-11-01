import { RowListSkeleton } from "@/components/RowList";
import { Skeleton } from "@/components/ui/skeleton";

// A post's shape while it loads: its poster and title, then its links.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-[7rem_1fr] gap-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
        <Skeleton className="aspect-2/3 w-full rounded-lg" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <RowListSkeleton rows={6} />
    </div>
  );
}
