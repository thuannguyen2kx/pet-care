
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
export const AppointmentLoadingState: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="rounded-md">
          <div className="p-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



// src/components/appointments/AppointmentErrorState.tsx

export const AppointmentErrorState: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Đã xảy ra lỗi
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">
          Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
        </p>
        <Button onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
      </CardContent>
    </Card>
  );
};

