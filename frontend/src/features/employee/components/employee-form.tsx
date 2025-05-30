import { useNavigate } from "react-router-dom";
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
import { ChevronLeft } from "lucide-react";
import { useCreateEmployee } from "../hooks/mutations/create-employee";
import { CreateEmployeeDTO } from "../types/api.types";
import { Specialty, specialtyTranslations, weekdays } from "@/constants";

// Schema biểu mẫu để tạo nhân viên
const createEmployeeSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ" }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  fullName: z.string().min(2, {
    message: "Họ tên phải có ít nhất 2 ký tự",
  }),
  phoneNumber: z.string().optional(),
  specialties: z.array(z.string()).min(1, {
    message: "Vui lòng chọn ít nhất một chuyên môn",
  }),
  workDays: z.array(z.string()).min(1, {
    message: "Vui lòng chọn ít nhất một ngày làm việc",
  }),
  workHoursStart: z.string().optional(),
  workHoursEnd: z.string().optional(),
});

// Tùy chọn giờ làm việc
const workHours = Array.from({ length: 24 }).map((_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function EmployeeForm() {
  const navigate = useNavigate();

  // Hook thêm nhân viên
  const createEmployee = useCreateEmployee();

  // Khởi tạo biểu mẫu
  const form = useForm<z.infer<typeof createEmployeeSchema>>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      specialties: [],
      workDays: [],
      workHoursStart: "09:00",
      workHoursEnd: "17:00",
    },
  });

  // Xử lý gửi biểu mẫu
  const onSubmit = (values: CreateEmployeeDTO) => {
    createEmployee.mutate(values as CreateEmployeeDTO, {
      onSuccess: (data) => {
        navigate(`/admin/employees/${data.employee._id}`);
      },
    });
  };

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
          Thêm nhân viên mới
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhân viên</CardTitle>
          <CardDescription>Nhập thông tin cho nhân viên mới.</CardDescription>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Tối thiểu 6 ký tự</FormDescription>
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
                                    <FormLabel className="font-normal capitalize">
                                      {specialtyTranslations[specialty] ||
                                        specialty}
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
                <Button type="submit" disabled={createEmployee.isPending}>
                  {createEmployee.isPending ? "Đang lưu..." : "Tạo nhân viên"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
