
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  ChevronLeft,
  Edit,
  Upload,
  Key,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { useGetEmployee } from "../hooks/queries/get-employee";
import { useEmployeePerformance } from "../hooks/queries/get-employee-performance";
import { useGetEmployeeSchedule } from "../hooks/queries/get-employee-schedule";
import { useResetPassword } from "../hooks/mutations/reset-password";
import { useUploadProfilePicture } from "../hooks/mutations/upload-profile-picture";
import { specialtyTranslations, StatusUser, StatusUserType, weekdays } from "@/constants";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/auth-provider";
import { EMPLOYEE_ROUTES } from "@/routes/common/routePaths";
import EmployeeScheduleManagement from "./schedule";

export default function EmployeeProfile() {
  const {user} = useAuthContext()
  const employeeId = user?._id as string
  const navigate = useNavigate();

  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 

  // Fetch data using React Query hooks
  const { data, isLoading: isLoadingEmployee } = useGetEmployee(employeeId as string);
  const { data: performanceData, isLoading: isLoadingPerformance } = useEmployeePerformance(
    employeeId as  string
  );
  const { data: scheduleData, isLoading: isLoadingSchedule } = useGetEmployeeSchedule(employeeId as string);

  // Mutation hooks
  const resetPassword = useResetPassword(employeeId as string);
  const uploadProfilePicture = useUploadProfilePicture(employeeId as string);

  const employee = data?.employee;

  

  // Handle loading state and missing employee data
  if (isLoadingEmployee) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">Đang tải thông tin nhân viên...</h2>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">
          Không tìm thấy thông tin nhân viên
        </h2>
        <Button
          variant="link"
          onClick={() => navigate("/admin/employees")}
          className="mt-4"
        >
          Quay lại trang danh sách
        </Button>
      </div>
    );
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadProfilePicture.mutate(file);
    }
  };

  // Handle password reset
  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải ít nhất 6 ký tự.");
      return;
    }

    resetPassword.mutate(newPassword, {
      onSuccess: () => {
        setResetPasswordDialogOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      },
    });
  };

  // Get status badge color
  const getStatusBadge = (status: StatusUserType) => {
    switch (status) {
      case StatusUser.ACTIVE:
        return (
          <Badge variant="default" className="bg-green-500">
            Đang hoạt động
          </Badge>
        );
      case StatusUser.INACTIVE:
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case StatusUser.BLOCKED:
        return <Badge variant="destructive">Bị vô hiệu hoá</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/employees")}
              className="mr-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <h2 className="text-2xl font-bold tracking-tight">
              Thông tin chi tiết nhân viên
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => navigate(`/admin/employees/${employeeId}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" /> Chỉnh sửa
            </Button> 
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={employee.profilePicture?.url || ""}
                      alt={employee.fullName}
                    />
                    <AvatarFallback className="text-2xl">
                      {employee.fullName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0"
                  >
                    <div className="bg-primary text-primary-foreground p-1 rounded-full cursor-pointer">
                      <Upload className="h-4 w-4" />
                    </div>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <h3 className="text-xl font-bold">{employee.fullName}</h3>
                <p className="text-muted-foreground">{employee.email}</p>
                <div className="mt-2">{getStatusBadge(employee.status)}</div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4 text-left">
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">
                    {employee.phoneNumber || "Chưa cung cấp"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Chuyên môn</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {employee.employeeInfo?.specialties?.map(
                      (specialty, idx) => (
                        <Badge
                          key={idx}
                          variant="default"
                          className="capitalize"
                        >
                          {specialtyTranslations[specialty]}
                        </Badge>
                      )
                    ) || (
                      <span className="text-muted-foreground">
                        Chưa cung cấp
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Lịch làm việc</p>
                  <div className="mt-1">
                    {employee.employeeInfo?.schedule ? (
                      <>
                        <p className="font-medium">
                          {employee.employeeInfo.schedule.workDays
                            .map(
                              (day) =>
                                day.charAt(0).toUpperCase() + day.slice(1)
                            )
                            .join(", ")}
                        </p>
                        <p>
                          {employee.employeeInfo.schedule.workHours.start} -{" "}
                          {employee.employeeInfo.schedule.workHours.end}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Chưa cung cấp</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Ngày tạo tài khoản
                  </p>
                  <p className="font-medium">
                    {format(new Date(employee.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Lần cuối đăng nhập
                  </p>
                  <p className="font-medium">
                    {employee.lastLogin
                      ? format(new Date(employee.lastLogin), "dd/MM/yyyy HH:mm")
                      : "Chưa đăng nhập"}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <Dialog
                open={resetPasswordDialogOpen}
                onOpenChange={setResetPasswordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" /> Đặt lại mật khẩu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đặt lại mật khẩu</DialogTitle>
                    <DialogDescription>
                      Đặt mật khẩu mới cho nhân viên này. Nhân viên sẽ cần sử
                      dụng mật khẩu này cho lần đăng nhập tiếp theo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="new-password"
                        className="text-sm font-medium"
                      >
                        Mật khẩu mới
                      </label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium"
                      >
                        Nhập lại mật khẩu
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setResetPasswordDialogOpen(false)}
                    >
                      Huỷ
                    </Button>
                    <Button onClick={handleResetPassword}>
                      Đặt lại mật khẩu
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

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
                  Xem và quản lý lịch trình và hiệu suất làm việc của nhân viên
                  này.
                </CardDescription>
              </CardHeader>

              {/* Schedule Tab Content */}
              <TabsContent value="schedule" className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Lịch trình làm việc</h3>
                    <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "border-primary text-primary")} to={EMPLOYEE_ROUTES.HOME}>
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
                                       weekdays.find((w) => w.id === day)?.label 
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
                          <EmployeeScheduleManagement employeeId={employee._id} />
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
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hiệu suất làm việc</h3>
                  {isLoadingPerformance ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Đang tải số liệu hiệu suất...
                    </div>
                  ) : performanceData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-center">
                              Đánh giá trung bình
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="text-3xl font-bold">
                              {employee.employeeInfo?.performance?.rating?.toFixed(
                                1
                              ) || "N/A"}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              trong số 5.0
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-center">
                              Hiệu suất hàng tháng
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="text-3xl font-bold">
                              {performanceData?.monthlyPerformance &&
                              performanceData.monthlyPerformance.length > 0
                                ? performanceData.monthlyPerformance[
                                    performanceData.monthlyPerformance.length -
                                      1
                                  ].count
                                : 0}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              dịch vụ trong tháng này
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-center">
                              Tổng số dịch vụ
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="text-3xl font-bold">
                              {performanceData?.completedServices || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              đã hoàn thành
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {performanceData?.serviceBreakdown && (
                        <div>
                          <h4 className="font-medium mb-2">
                            Phân tích dịch vụ
                          </h4>
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                {Object.entries(
                                  performanceData.serviceBreakdown
                                ).map(([serviceId, count], idx) => (
                                  <div
                                    key={serviceId}
                                    className="flex justify-between items-center"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{idx + 1}</Badge>
                                      <span>{serviceId}</span>
                                    </div>
                                    <div>
                                      <Badge variant="secondary">
                                        {count} hoàn thành
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {performanceData?.monthlyPerformance &&
                        performanceData.monthlyPerformance.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">
                              Hiệu suất hàng tháng
                            </h4>
                            <Card>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  {performanceData.monthlyPerformance
                                    .slice()
                                    .reverse()
                                    .map((item) => (
                                      <div
                                        key={`${item.year}-${item.month}`}
                                        className="flex justify-between items-center"
                                      >
                                        <span>
                                          {format(
                                            new Date(item.year, item.month - 1),
                                            "MMMM yyyy"
                                          )}
                                        </span>
                                        <Badge>{item.count} dịch vụ</Badge>
                                      </div>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu hiệu suất
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
}