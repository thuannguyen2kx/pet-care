import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";

import { Calendar, Award } from "lucide-react";
import { useGetEmployeeSchedule } from "@/features/employee/hooks/queries/get-employee-schedule";
import { weekdays } from "@/constants";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/auth-provider";
import { EMPLOYEE_ROUTES } from "@/routes/common/routePaths";
import EmployeePerformanceDashboard from "@/features/employee/components/employee-dashboard";
import EnhancedEmployeeScheduleManager from "@/features/employee/components/employee-schedule-management";
import { useGetEmployee } from "@/features/employee/hooks/queries/get-employee";
import { Link } from "react-router-dom";

export default function EmployeeTimeSlotPage() {
  const { user } = useAuthContext();
  const employeeId = user?._id as string;

  const { data } = useGetEmployee(employeeId as string);

  // Fetch data using React Query hooks
  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useGetEmployeeSchedule(employeeId as string);

  const employee = data?.employee;

  return (
    <>
      <div className="space-y-6">
        <div>
          {/* Employee Details Tabs */}
          <Card className="md:col-span-2">
            <Tabs defaultValue="schedule">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thông tin nhân viên</CardTitle>
                  <TabsList>
                    <TabsTrigger
                      value="schedule"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" /> Lịch làm việc
                    </TabsTrigger>
                    <TabsTrigger
                      value="performance"
                      className="flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" /> Hiệu suất
                    </TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>
                  Xem và quản lý lịch trình và hiệu suất làm việc của bạn
                </CardDescription>
              </CardHeader>

              {/* Schedule Tab Content */}
              <TabsContent value="schedule" className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Lịch trình làm việc</h3>
                    <Link
                      className={cn(
                        buttonVariants({ size: "sm", variant: "outline" }),
                        "border-primary text-primary"
                      )}
                      to={EMPLOYEE_ROUTES.HOME}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                  {isLoadingSchedule ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Đang tải lịch làm việc...
                    </div>
                  ) : scheduleData ? (
                    <div className="space-y-4">
                      {/* Schedule data display logic */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Giờ làm việc</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Ngày làm việc
                                </p>
                                <p className="font-medium">
                                  {employee.employeeInfo?.schedule?.workDays
                                    .map(
                                      (day) =>
                                        weekdays.find((w) => w.id === day)
                                          ?.label
                                    )
                                    .join(", ") || "Chưa thiết lập"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Giờ làm việc
                                </p>
                                <p className="font-medium">
                                  {employee.employeeInfo?.schedule?.workHours
                                    ? `${employee.employeeInfo.schedule.workHours.start} - ${employee.employeeInfo.schedule.workHours.end}`
                                    : "Chưa thiết lập"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <EnhancedEmployeeScheduleManager />
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu lịch trình làm việc
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Performance Tab Content */}
              <TabsContent value="performance" className="p-6">
                <EmployeePerformanceDashboard />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
}
