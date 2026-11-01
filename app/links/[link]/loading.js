import { RowListSkeleton } from "@/components/RowList";
import { Skeleton } from "@/components/ui/skeleton";

// A link opens in 1 to 10 s: the pages on the way, then a file's download servers.
export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-3/4" />
      <RowListSkeleton rows={3} />
      <p className="text-sm text-muted-foreground">Opening the link… this can take up to 10 seconds.</p>
    </div>
  );
}
