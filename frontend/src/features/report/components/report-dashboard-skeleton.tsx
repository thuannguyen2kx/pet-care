import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  RefreshCw,
  Download,
} from "lucide-react";
import { PERIOD_OPTIONS } from "./dashboard/dashboard-utils";

const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>

        <div className="flex items-center gap-2">
          <Select defaultValue="month" disabled>
            <SelectTrigger className="w-[180px] bg-white border-0">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="bg-white border-0 min-w-[220px] justify-start"
            disabled
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="opacity-50">Chọn ngày</span>
          </Button>

          <Button size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm mới
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-white border-0"
            disabled
          >
            <Download className="h-4 w-4 mr-1" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="p-4 border-0 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </Card>
          ))}
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Dịch vụ
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Lịch hẹn
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Báo cáo
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Skeleton */}
        <TabsContent value="overview">
          <Card className="border-0 shadow-sm p-4">
            <div className="space-y-8">
              {/* Revenue Chart Skeleton */}
              <div>
                <Skeleton className="h-5 w-40 mb-4" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
              
              {/* Services Distribution Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Skeleton className="h-5 w-40 mb-4" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-40 mb-4" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Services Tab Skeleton */}
        <TabsContent value="services">
          <Card className="border-0 shadow-sm p-4">
            <div className="space-y-6">
              <Skeleton className="h-5 w-40 mb-2" />
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
              </div>
              
              <Skeleton className="h-5 w-40 mt-6 mb-2" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </Card>
        </TabsContent>

        {/* Appointments Tab Skeleton */}
        <TabsContent value="appointments">
          <Card className="border-0 shadow-sm p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Skeleton className="h-5 w-40 mb-4" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-40 mb-4" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>
              </div>
              
              <Skeleton className="h-5 w-40 mt-6 mb-2" />
              <div className="space-y-3">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Reports Tab Skeleton */}
        <TabsContent value="reports">
          <Card className="border-0 shadow-sm p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-24" />
              </div>
              
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSkeleton;