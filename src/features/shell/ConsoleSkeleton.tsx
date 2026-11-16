import { Skeleton } from "@/components/ui/Skeleton";

export function ConsoleSkeleton() {
  return (
    <div className="p-4" aria-busy="true" aria-label="Loading console">
      <Skeleton className="mb-4 h-12 w-full" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
