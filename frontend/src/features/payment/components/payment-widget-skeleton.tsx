import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PaymentWidgetSkeleton = () => {
  return (
      <Card className="col-span-1 md:col-span-2 border-0 shadow-sm mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="charts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="charts">Biểu đồ</TabsTrigger>
              <TabsTrigger value="summary">Tóm tắt</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart Skeletons */}
                <div className="rounded-lg p-4 border-0 bg-gray-50">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-64 w-full" />
                </div>

                <div className="rounded-lg p-4 border-0 bg-gray-50">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stats Card Skeletons */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg p-4 border-0 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-8 w-36" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t border-slate-200 pt-4">
          <Skeleton className="h-4 w-64" />
        </CardFooter>
      </Card> 
  );
};