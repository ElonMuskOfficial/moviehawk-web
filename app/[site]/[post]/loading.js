import { Skeleton } from "@/components/ui/skeleton";

// A post's shape while it loads, as the page lays it out: its poster on the left, its title and a
// section of its links on the right (on a narrow screen, a small poster beside the title).
export default function Loading() {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-10 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12" aria-busy="true">
      <Skeleton className="aspect-2/3 w-full rounded-lg lg:row-span-2 lg:self-start" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="col-span-2 flex max-w-3xl flex-col gap-3 lg:col-span-1 lg:col-start-2">
        <Skeleton className="h-3 w-32" />
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}
