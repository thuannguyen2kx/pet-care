import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ServiceType } from "@/features/service/types/api.types";
import { PetType } from "@/features/pet/types/api.types";
import { FormValues, formatDuration } from "@/features/appointment/utils/appointment-form-config";
import { useGetAvailableEmployeesForService } from "@/features/employee/hooks/queries/get-available-employee-for-service";
import { EmployeeType } from "@/features/employee/types/api.types";
import { CreditCard, Building, Banknote } from "lucide-react";

interface ReviewStepProps {
  form: UseFormReturn<FormValues>;
  petsData: { pets: PetType[] } | undefined;
  serviceType: string; 
  service: ServiceType | undefined;
  selectedDate: Date | undefined;
  paymentMethod: string;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  form,
  petsData,
  serviceType,
  service,
  selectedDate,
  paymentMethod,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const selectedPet = petsData?.pets.find(
    (pet: PetType) => pet._id === form.watch("petId")
  );

  const employeeId = form.watch("employeeId");
  
  // Fetch employee details if needed
  const { data: fetchedEmployeesData } = useGetAvailableEmployeesForService(
    {
      serviceId: service?._id || "",
      serviceType: serviceType,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
      timeSlot: form.watch("timeSlot").start && form.watch("timeSlot").end
        ? `${form.watch("timeSlot").start}-${form.watch("timeSlot").end}`
        : undefined,
    },
  );

  // Update selected employee when data changes
  useEffect(() => {
    if (employeeId) {
      const employee = fetchedEmployeesData?.employees?.find(
        (emp) => emp._id === employeeId
      );
      if (employee) {
        setSelectedEmployee(employee);
      }
    }
  }, [employeeId, fetchedEmployeesData]);

  // Get payment method icon
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case "card":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "cash":
        return <Banknote className="h-5 w-5 text-green-500" />;
      case "bank_transfer":
        return <Building className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  // Get payment method name in Vietnamese
  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "card":
        return "Thanh toán thẻ";
      case "cash":
        return "Thanh toán tại cửa hàng";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Xác nhận thông tin đặt lịch</h3>
      <div className="space-y-4 rounded-md border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Thú cưng</p>
            <p className="font-medium">
              {selectedPet
                ? `${selectedPet.name} (${selectedPet.species}`
                : ""}
              {selectedPet?.breed ? ` - ${selectedPet.breed}` : ""})
              {selectedPet?.weight ? ` - ${selectedPet.weight}kg` : ""}
              {selectedPet?.gender ? ` - ${selectedPet.gender}` : ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dịch vụ</p>
            <p className="font-medium">{service?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày hẹn</p>
            <p className="font-medium">
              {selectedDate &&
                format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Khung giờ</p>
            <p className="font-medium">
              {form.watch("timeSlot").start} - {form.watch("timeSlot").end}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Giá</p>
            <p className="font-medium">
              {service?.price.toLocaleString()} VND
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Thời gian</p>
            <p className="font-medium">
              {service?.duration
                ? formatDuration(service.duration)
                : "N/A"}
            </p>
          </div>
        </div>

        {selectedEmployee && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Nhân viên đã chọn
            </p>
            <div className="flex items-center mt-1">
              <Avatar className="h-6 w-6 mr-2">
                {selectedEmployee.profilePicture ? (
                  <AvatarImage
                    src={selectedEmployee.profilePicture.url || ""}
                    alt={selectedEmployee.fullName}
                  />
                ) : (
                  <AvatarFallback>
                    {selectedEmployee.fullName
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span>{selectedEmployee.fullName}</span>
            </div>
          </div>
        )}

        {!selectedEmployee && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-sm text-muted-foreground">Nhân viên</p>
            <p>Hệ thống sẽ tự động phân bổ nhân viên phù hợp</p>
          </div>
        )}

        {form.watch("notes") && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-sm text-muted-foreground">Ghi chú</p>
            <p className="whitespace-pre-wrap">{form.watch("notes")}</p>
          </div>
        )}

        {/* Payment Information Section */}
        <div className="mt-2 pt-2 border-t">
          <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
          <div className="flex items-center space-x-2 mt-1">
            {getPaymentMethodIcon()}
            <span className="font-medium">{getPaymentMethodName()}</span>
          </div>
          
          {paymentMethod === "card" && (
            <div className="mt-1 text-sm">
              <p className="text-muted-foreground">Bạn sẽ được chuyển đến trang thanh toán an toàn của Stripe để hoàn tất thanh toán</p>
            </div>
          )}
          
          {paymentMethod === "bank_transfer" && (
            <div className="mt-1 text-sm">
              <p className="text-muted-foreground">Vui lòng chuyển khoản trước khi đến cửa hàng và mang theo bằng chứng chuyển khoản</p>
            </div>
          )}
          
          {paymentMethod === "cash" && (
            <div className="mt-1 text-sm">
              <p className="text-muted-foreground">Vui lòng thanh toán tại cửa hàng khi đến</p>
            </div>
          )}
          
          <div className="mt-4 bg-primary/10 p-3 rounded-md flex justify-between items-center">
            <span className="font-medium">Tổng thanh toán:</span>
            <span className="text-lg font-bold">{service?.price.toLocaleString()} VND</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;