import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Schedule } from "../types/schedule.types";

interface ScheduleStatsProps {
  schedules: Schedule[];
  monthlyWorkingHours: number;
  monthlyAvailability: number;
}

export const ScheduleStats: React.FC<ScheduleStatsProps> = ({
  schedules,
  monthlyWorkingHours,
}) => {
  const workingDays = schedules.filter((s) => s.isWorking).length;
  const restDays = schedules.filter((s) => !s.isWorking).length;
  const avgHoursPerDay = workingDays > 0 ? monthlyWorkingHours / workingDays : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Ngày làm việc</dt>
            <dd className="mt-1 text-2xl font-semibold">{workingDays}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Ngày nghỉ</dt>
            <dd className="mt-1 text-2xl font-semibold">{restDays}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Tổng giờ</dt>
            <dd className="mt-1 text-2xl font-semibold">
              {monthlyWorkingHours.toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">TB giờ/ngày</dt>
            <dd className="mt-1 text-2xl font-semibold">
              {avgHoursPerDay.toFixed(1)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

// components/schedule-header-stats.tsx
export const ScheduleHeaderStats: React.FC<ScheduleStatsProps> = ({
  monthlyAvailability,
  monthlyWorkingHours,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Khả dụng:</span>
        <Badge variant="outline" className="bg-blue-50">
          {monthlyAvailability.toFixed(0)}% số ngày
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Giờ làm việc:</span>
        <span className="text-sm">
          {monthlyWorkingHours.toFixed(1)} giờ trong tháng
        </span>
      </div>
    </div>
  );
};