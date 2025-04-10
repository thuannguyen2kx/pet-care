/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useGetEmployee } from "../hooks/queries/get-employee";
import { useUpdateEmployee } from "../hooks/mutations/update-employee";
import { UpdateEmployeeDTO } from "../types/api.types";
import { Specialty, specialtyTranslations, statusTranslations, StatusUser, weekdays } from "@/constants";

// Sơ đồ biểu mẫu để cập nhật nhân viên
const updateEmployeeSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ" }),
  fullName: z.string().min(2, {
    message: "Họ tên phải có ít nhất 2 ký tự",
  }),
  phoneNumber: z.string().optional(),
  specialties: z.array(z.nativeEnum(Specialty)).min(1, {
    message: "Vui lòng chọn ít nhất một chuyên môn",
  }),
  workDays: z.array(z.string()).min(1, {
    message: "Vui lòng chọn ít nhất một ngày làm việc",
  }),
  workHoursStart: z.string().optional(),
  workHoursEnd: z.string().optional(),
  status: z.nativeEnum(StatusUser).optional(),
});


// Các tùy chọn giờ làm việc
const workHours = Array.from({ length: 24 }).map((_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function EmployeeEditForm() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  // Kiểm tra xem đây có phải là chế độ chỉnh sửa không
  const isEditing = Boolean(employeeId);
  
  // Lấy dữ liệu nhân viên nếu đang ở chế độ chỉnh sửa
  const { data: employeeData, isLoading, isError } = useGetEmployee(
    employeeId as string, 
  );
  
  const updateEmployee = useUpdateEmployee(employeeId as string);
  
  // Khởi tạo biểu mẫu
  const form = useForm<z.infer<typeof updateEmployeeSchema>>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
      specialties: [],
      workDays: [],
      workHoursStart: "09:00",
      workHoursEnd: "17:00",
      status: StatusUser.ACTIVE
    },
  });
  
  // Cập nhật giá trị mặc định của biểu mẫu khi dữ liệu nhân viên được tải
  useEffect(() => {
    if (employeeData && isEditing) {
      const employee = employeeData.employee;
      
      form.reset({
        email: employee.email || "",
        fullName: employee.fullName || "",
        phoneNumber: employee.phoneNumber || "",
        specialties: employee.employeeInfo?.specialties || [],
        workDays: employee.employeeInfo?.schedule?.workDays || [],
        workHoursStart: employee.employeeInfo?.schedule?.workHours?.start || "09:00",
        workHoursEnd: employee.employeeInfo?.schedule?.workHours?.end || "17:00",
        status: employee.status || StatusUser.ACTIVE,
      });
    }
  }, [employeeData, form, isEditing]);
  
  // Xử lý gửi biểu mẫu
  const onSubmit = (values: z.infer<typeof updateEmployeeSchema>) => {
    // Chuyển đổi dữ liệu để phù hợp với API
    const formattedValues: UpdateEmployeeDTO = {
      ...values,
    };
    
    // Xóa các trường không cần thiết
    delete formattedValues.workDays;
    delete formattedValues.workHoursStart;
    delete formattedValues.workHoursEnd;
    
    updateEmployee.mutate(formattedValues, {
      onSuccess: () => {
        navigate(`/admin/employees/${employeeId}`);
      },
    });
  };
  
  // Hiển thị thông báo đang tải
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Đang tải thông tin nhân viên...</p>
      </div>
    );
  }
  
  // Hiển thị thông báo lỗi
  if (isError && isEditing) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-500">
          Không thể tải thông tin nhân viên. Vui lòng thử lại sau.
        </h2>
        <Button
          variant="link"
          onClick={() => navigate("/admin/employees")}
          className="mt-4"
        >
          Quay lại danh sách nhân viên
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/employees")}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Cập nhật thông tin và cài đặt của nhân viên."
              : "Nhập thông tin cho nhân viên mới."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Thông tin cơ bản */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
                    <p className="text-sm text-muted-foreground">
                      Thông tin cá nhân và liên hệ của nhân viên.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="nguyenvana@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                             
                              {Object.entries(StatusUser).map(([_, value]) => (
                                <SelectItem key={value} value={value}>
                                  {statusTranslations[value] || value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Chuyên môn và lịch làm việc */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Chi tiết công việc</h3>
                    <p className="text-sm text-muted-foreground">
                      Thiết lập chuyên môn và lịch làm việc của nhân viên.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="specialties"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Chuyên môn</FormLabel>
                          <FormDescription>
                            Chọn các dịch vụ nhân viên này có thể thực hiện.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(Specialty).map((specialty) => (
                            <FormField
                              key={specialty}
                              control={form.control}
                              name="specialties"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={specialty}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          specialty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                specialty,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== specialty
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {specialtyTranslations[specialty] || specialty}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <FormField
                    control={form.control}
                    name="workDays"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Ngày làm việc</FormLabel>
                          <FormDescription>
                            Chọn những ngày nhân viên này làm việc.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {weekdays.map((day) => (
                            <FormField
                              key={day.id}
                              control={form.control}
                              name="workDays"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={day.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                day.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== day.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {day.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workHoursStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ bắt đầu</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Giờ bắt đầu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workHours.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workHoursEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ kết thúc</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Giờ kết thúc" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workHours.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end space-x-4 px-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/admin/employees")}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={updateEmployee.isPending}
                >
                  {updateEmployee.isPending
                    ? "Đang lưu..."
                    : isEditing ? "Cập nhật nhân viên" : "Thêm nhân viên"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}