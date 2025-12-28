import { Skeleton } from '@/shared/ui/skeleton';

function PetCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-2xl border">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="h-full w-full" />

        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 space-y-2 p-4">
          <Skeleton className="h-6 w-32 bg-white/20" />
          <Skeleton className="h-4 w-24 bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export default PetCardSkeleton;
