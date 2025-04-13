import React from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { User } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetAvailableEmployeesForService } from "@/features/employee/hooks/queries/get-available-employee-for-service";
import { TimeSlotType } from "@/features/appointment/types/api.types";
import { FormValues } from "@/features/appointment/utils/appointment-form-config";
import { specialtyTranslations } from "@/constants";

interface EmployeeSelectionStepProps {
  form: UseFormReturn<FormValues>;
  serviceId: string;
  serviceType: string;
  selectedDate: Date | undefined;
  selectedTimeSlotData: TimeSlotType | null;
}

const EmployeeSelectionStep: React.FC<EmployeeSelectionStepProps> = ({
  form,
  serviceId,
  serviceType,
  selectedDate,
  selectedTimeSlotData,
}) => {
  // Get employees
  const { data: employeesData, isLoading: isEmployeesLoading } = useGetAvailableEmployeesForService({
    serviceId,
    serviceType,
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
    timeSlot: selectedTimeSlotData
      ? [selectedTimeSlotData.startTime, selectedTimeSlotData.endTime].join("-")
      : undefined,
  });

  // Get available employees for selected time slot
  const getAvailableEmployeesForTimeSlot = () => {
    if (!selectedTimeSlotData || !employeesData) return [];

    // If we have employee availability data in the time slot
    if (selectedTimeSlotData.employeeAvailability) {
      const availableEmployeeIds = selectedTimeSlotData.employeeAvailability
        .filter((ea) => ea.isAvailable)
        .map((ea) => ea.employeeId);

      return (employeesData.employees || []).filter((emp) =>
        availableEmployeeIds.includes(emp._id)
      );
    }

    // Otherwise, use all employees returned from the API
    return employeesData.employees || [];
  };

  const availableEmployees = getAvailableEmployeesForTimeSlot();

  return (
    <FormField
      control={form.control}
      name="employeeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium mb-2">
            Chọn nhân viên (không bắt buộc)
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {isEmployeesLoading ? (
                <div className="text-center py-4">
                  Đang tải danh sách nhân viên...
                </div>
              ) : availableEmployees.length > 0 ? (
                <>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="space-y-4"
                    value={field.value}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableEmployees.map((employee) => (
                        <div
                          key={employee._id}
                          className={cn(
                            "relative flex items-center space-x-3 rounded-lg border p-4",
                            field.value === employee._id
                              ? "border-primary"
                              : "border-border"
                          )}
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
                              <div className="mt-1 flex flex-wrap gap-1">
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
                            <div className="mt-1 text-xs text-muted-foreground">
                              <span>
                                Đánh giá:{" "}
                                {employee.employeeInfo.performance.rating}
                                /5
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => field.onChange("")}
                    >
                      Để hệ thống tự chọn nhân viên phù hợp
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 border rounded-md bg-muted/20">
                  <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p>Không có nhân viên nào khả dụng cho khung giờ này.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hệ thống sẽ tự động chọn nhân viên phù hợp khi có sẵn.
                  </p>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Bạn có thể chọn nhân viên cụ thể hoặc để hệ thống tự phân bổ nhân
            viên phù hợp.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmployeeSelectionStep;