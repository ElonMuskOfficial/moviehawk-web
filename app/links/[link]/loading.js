import { RowListSkeleton } from "@/components/RowList";
import { Skeleton } from "@/components/ui/skeleton";

// A link's files load in up to 3 s: the gateways on the way are read one after another.
export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-7 w-20" />
      <RowListSkeleton rows={2} />
      <p className="text-sm text-muted-foreground">Following the link to its files…</p>
    </div>
  );
}
