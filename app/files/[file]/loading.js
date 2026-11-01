import { RowListSkeleton } from "@/components/RowList";
import { Skeleton } from "@/components/ui/skeleton";

// A file's downloads take 1 to 10 s: HubCloud's pages, then 10Gbps's redirects.
export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-5 w-24" />
      <RowListSkeleton rows={4} />
      <p className="text-sm text-muted-foreground">Getting fresh download links… this can take up to 10 seconds.</p>
    </div>
  );
}
