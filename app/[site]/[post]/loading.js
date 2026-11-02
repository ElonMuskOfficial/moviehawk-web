import { Skeleton } from "@/components/ui/skeleton";

// A post's shape while it loads, as the page lays it out: on a phone, one column (the title, its
// details, the poster, the links); from lg, the poster on the left of the rest.
export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12" aria-busy="true">
      <div className="flex flex-col gap-2 lg:col-start-2 lg:row-start-1">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-2/3" />
      </div>
      <Skeleton className="mt-3 h-4 w-64 lg:col-start-2 lg:row-start-2" />
      <Skeleton className="mt-4 aspect-2/3 w-full max-w-64 rounded-lg lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:max-w-none lg:self-start" />
      <div className="mt-8 flex max-w-3xl flex-col gap-3 lg:col-start-2 lg:row-start-3 lg:mt-10">
        <Skeleton className="h-3 w-32" />
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}
