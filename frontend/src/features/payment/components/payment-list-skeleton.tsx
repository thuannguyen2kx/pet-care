import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export const PaymentListSkeleton = () => {
  return (
    <Card className="border-0 shadow-sm">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Tab Headers */}
            <div className="flex justify-between items-center">
              <div className="bg-muted rounded-md p-1 h-10 flex items-center">
                <Skeleton className="h-8 w-32 rounded-sm mx-1" />
                <Skeleton className="h-8 w-32 rounded-sm mx-1" />
                <Skeleton className="h-8 w-32 rounded-sm mx-1" />
              </div>

              <Skeleton className="h-9 w-28" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <Skeleton className="h-10 flex-1" />

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-[130px]" />
                <Skeleton className="h-10 w-[130px]" />
                <Skeleton className="h-10 w-[140px]" />
                <Skeleton className="h-10 w-[140px]" />
              </div>
            </div>

            {/* Table skeleton */}
            <div className="rounded-lg overflow-hidden border border-slate-200">
              {/* Table header */}
              <div className="grid grid-cols-7 bg-slate-50 p-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-5 w-4/5" />
                ))}
              </div>

              {/* Table rows */}
              {[1, 2, 3, 4, 5].map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-7 p-4 border-t border-slate-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                    <div key={col} className="space-y-2">
                      <Skeleton className="h-5 w-4/5" />
                      {col !== 7 && <Skeleton className="h-3 w-2/3" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-5 w-40" />

              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>

              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
  )
}