import React from "react";
import { UseFormReturn } from "react-hook-form";
import { User, Calendar, CalendarRange } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetEmployeesForService } from "@/features/employee/hooks/queries/get-available-employee-for-service"; 
import { FormValues } from "@/features/appointment/utils/appointment-form-config";
import { specialtyTranslations } from "@/constants";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface EmployeeSelectionStepProps {
  form: UseFormReturn<FormValues>;
  serviceId: string;
  serviceType: string;
  selectedDate?: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedTimeSlotData?: any;
}

const EmployeeSelectionStep: React.FC<EmployeeSelectionStepProps> = ({
  form,
  serviceId,
  serviceType
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách nhân viên dựa trên dịch vụ
  const { data: employeesData, isLoading: isEmployeesLoading } = useGetEmployeesForService({
    serviceId,
    serviceType
  });

  // FIX: Đảm bảo form field có giá trị mặc định là empty string
  useEffect(() => {
    const currentValue = form.getValues("employeeId");
    if (currentValue === undefined || currentValue === null) {
      // Đặt giá trị mặc định là empty string (không chọn ai)
      form.setValue("employeeId", "", { shouldValidate: false });
    }
  }, [form]);

  // Lọc nhân viên theo từ khóa tìm kiếm
  const filteredEmployees = employeesData?.employees?.filter(employee => 
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.employeeInfo?.specialties?.some(specialty => 
      (specialtyTranslations[specialty] || specialty).toLowerCase().includes(searchTerm.toLowerCase())
    ))
  ) || [];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <FormField
      control={form.control}
      name="employeeId"
      render={({ field }) => (
        <FormItem>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <FormLabel className="text-lg font-medium mb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Chọn nhân viên
            </FormLabel>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-primary/5 p-4 rounded-lg border border-primary/20 mb-4"
          >
            <p className="text-sm">
              Chọn nhân viên trước sẽ giúp bạn dễ dàng tìm ngày và giờ phù hợp với lịch làm việc của họ. Bạn có thể bỏ qua bước này nếu muốn hệ thống tự động chọn nhân viên phù hợp.
            </p>
          </motion.div>

          <FormControl>
            <div className="space-y-4">
              {/* FIX: Nút "Để hệ thống tự chọn" đặt lên đầu và mặc định được chọn */}
              {!isEmployeesLoading && filteredEmployees.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="pb-4 border-b border-muted"
                >
                  <Button
                    type="button"
                    variant={!field.value || field.value === "" ? "default" : "outline"}
                    className={cn(
                      "w-full", 
                      !field.value || field.value === "" 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => {
                      field.onChange("");
                      console.log("Selected: Auto-assign employee");
                    }}
                  >
                    <CalendarRange className="h-4 w-4 mr-2" />
                    {!field.value || field.value === ""
                      ? "✓ Hệ thống sẽ tự chọn nhân viên phù hợp" 
                      : "Để hệ thống tự chọn nhân viên phù hợp"
                    }
                  </Button>
                </motion.div>
              )}

              {/* Tìm kiếm nhân viên */}
              {employeesData?.employees && employeesData.employees.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="relative mb-4">
                    <Input
                      placeholder="Tìm kiếm nhân viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              )}

              {isEmployeesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3 rounded-lg border p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEmployees.length > 0 ? (
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {/* FIX: Đặt value rõ ràng cho RadioGroup và không cho defaultValue */}
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      console.log("Selected employee:", value);
                    }}
                    className="space-y-4"
                    value={field.value || ""} // FIX: Đảm bảo value luôn có giá trị
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredEmployees.map((employee, index) => (
                        <motion.div
                          key={employee._id}
                          variants={item}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "relative flex items-center space-x-3 rounded-lg border p-4 transition-all hover:bg-muted/10 cursor-pointer",
                            field.value === employee._id
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border hover:border-primary/30"
                          )}
                          onClick={() => {
                            field.onChange(employee._id);
                            console.log("Selected employee:", employee._id, employee.fullName);
                          }}
                        >
                          <RadioGroupItem
                            value={employee._id}
                            id={`employee-${employee._id}`}
                            className="absolute right-4 top-4"
                          />
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={employee?.profilePicture?.url || ""}
                              alt={employee.fullName}
                            />
                            <AvatarFallback>
                              {employee.fullName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <label
                              htmlFor={`employee-${employee._id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {employee.fullName}
                            </label>
                            {employee.employeeInfo?.specialties && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {employee.employeeInfo.specialties.map(
                                  (specialty, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {specialtyTranslations[specialty] ||
                                        specialty}
                                    </Badge>
                                  )
                                )}
                              </div>
                            )}
                            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-3">
                              <span className="flex items-center">
                                <svg className="h-3 w-3 mr-1 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span>
                                  {employee.employeeInfo.performance.rating.toFixed(1)}/5
                                </span>
                              </span>
                              
                              {employee.employeeInfo?.schedule?.workDays?.length > 0 && (
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-primary" />
                                  <span>{employee.employeeInfo.schedule.workDays.length} ngày/tuần</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </RadioGroup>
                </motion.div>
              ) : searchTerm ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.3 }}
                  className="text-center p-6 border rounded-md bg-muted/20"
                >
                  <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p>Không tìm thấy nhân viên phù hợp với từ khóa "{searchTerm}"</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm("")}
                    className="mt-2"
                  >
                    Xóa tìm kiếm
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.3 }}
                  className="text-center p-6 border rounded-md bg-muted/20"
                >
                  <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p>Không có nhân viên nào khả dụng cho dịch vụ này.</p>
                </motion.div>
              )}
            </div>
          </FormControl>
          <FormDescription className="mt-3">
            {field.value && field.value !== "" 
              ? `Đã chọn nhân viên: ${filteredEmployees.find(emp => emp._id === field.value)?.fullName || "Không xác định"}`
              : "Hệ thống sẽ tự động chọn nhân viên phù hợp nhất cho bạn."
            }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmployeeSelectionStep;