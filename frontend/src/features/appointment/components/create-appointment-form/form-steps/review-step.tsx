"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ServiceType } from "@/features/service/types/api.types"
import type { PetType } from "@/features/pet/types/api.types"
import { type FormValues, formatDuration } from "@/features/appointment/utils/appointment-form-config"
import { useGetAvailableEmployeesForService } from "@/features/employee/hooks/queries/get-available-employee-for-service"
import type { EmployeeType } from "@/features/employee/types/api.types"
import { CreditCard, Building, Banknote, CalendarDays, Clock, User, Pencil, DollarSign, PawPrint } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

interface ReviewStepProps {
  form: UseFormReturn<FormValues>
  petsData: { pets: PetType[] } | undefined
  serviceType: string
  service: ServiceType | undefined
  selectedDate: Date | undefined
  paymentMethod: string
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  form,
  petsData,
  serviceType,
  service,
  selectedDate,
  paymentMethod,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null)
  const selectedPet = petsData?.pets.find((pet: PetType) => pet._id === form.watch("petId"))

  const employeeId = form.watch("employeeId")

  // Fetch employee details if needed
  const { data: fetchedEmployeesData } = useGetAvailableEmployeesForService({
    serviceId: service?._id || "",
    serviceType: serviceType,
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
    timeSlot:
      form.watch("timeSlot").start && form.watch("timeSlot").end
        ? `${form.watch("timeSlot").start}-${form.watch("timeSlot").end}`
        : undefined,
  })

  // Update selected employee when data changes
  useEffect(() => {
    if (employeeId) {
      const employee = fetchedEmployeesData?.employees?.find((emp) => emp._id === employeeId)
      if (employee) {
        setSelectedEmployee(employee)
      }
    }
  }, [employeeId, fetchedEmployeesData])

  // Get payment method icon
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case "card":
        return <CreditCard className="h-5 w-5 text-blue-500" />
      case "cash":
        return <Banknote className="h-5 w-5 text-green-500" />
      case "bank_transfer":
        return <Building className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  // Get payment method name in Vietnamese
  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "card":
        return "Thanh toán thẻ"
      case "cash":
        return "Thanh toán tại cửa hàng"
      case "bank_transfer":
        return "Chuyển khoản ngân hàng"
      default:
        return ""
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <h3 className="text-lg font-medium">Xác nhận thông tin đặt lịch</h3>

      <motion.div className="space-y-4 rounded-lg border p-5 bg-card border-slate-300" variants={item}>
        <div className="grid grid-cols-1 gap-6">
          {/* Pet Information */}
          <motion.div variants={item} className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <PawPrint className="h-5 w-5" />
              <h4 className="font-medium">Thông tin thú cưng</h4>
            </div>
            <div className="bg-muted/30 p-3 rounded-md flex items-center gap-3">
              {selectedPet?.profilePicture ? (
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={selectedPet.profilePicture.url || ""} alt={selectedPet.name} />
                  <AvatarFallback>{selectedPet.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <PawPrint className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium text-lg">{selectedPet?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPet?.species}
                  {selectedPet?.breed ? ` - ${selectedPet.breed}` : ""}
                  {selectedPet?.weight ? ` - ${selectedPet.weight}kg` : ""}
                  {selectedPet?.gender ? ` - ${selectedPet.gender}` : ""}
                </p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Service and Time Information */}
          <motion.div variants={item} className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="h-5 w-5" />
              <h4 className="font-medium">Thông tin dịch vụ và lịch hẹn</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Dịch vụ</p>
                <p className="font-medium">{service?.name}</p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Giá</p>
                <p className="font-medium text-primary">{service?.price.toLocaleString()} VND</p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Ngày hẹn</p>
                <p className="font-medium">
                  {selectedDate && format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                </p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Khung giờ</p>
                </div>
                <p className="font-medium">
                  {form.watch("timeSlot").start} - {form.watch("timeSlot").end}
                </p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Thời gian dự kiến</p>
                <p className="font-medium">{service?.duration ? formatDuration(service.duration) : "N/A"}</p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Employee Information */}
          <motion.div variants={item} className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              <h4 className="font-medium">Thông tin nhân viên</h4>
            </div>

            {selectedEmployee ? (
              <div className="bg-muted/30 p-3 rounded-md flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  {selectedEmployee.profilePicture ? (
                    <AvatarImage src={selectedEmployee.profilePicture.url || ""} alt={selectedEmployee.fullName} />
                  ) : (
                    <AvatarFallback>{selectedEmployee.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{selectedEmployee.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    Đánh giá: {selectedEmployee.employeeInfo?.performance.rating}/5
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-muted-foreground">Hệ thống sẽ tự động phân bổ nhân viên phù hợp</p>
              </div>
            )}
          </motion.div>

          {/* Notes Information */}
          {form.watch("notes") && (
            <>
              <Separator />
              <motion.div variants={item} className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Pencil className="h-5 w-5" />
                  <h4 className="font-medium">Ghi chú</h4>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="whitespace-pre-wrap">{form.watch("notes")}</p>
                </div>
              </motion.div>
            </>
          )}

          <Separator />

          {/* Payment Information */}
          <motion.div variants={item} className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <DollarSign className="h-5 w-5" />
              <h4 className="font-medium">Thông tin thanh toán</h4>
            </div>

            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                {getPaymentMethodIcon()}
                <span className="font-medium">{getPaymentMethodName()}</span>
              </div>

              {paymentMethod === "card" && (
                <p className="text-sm text-muted-foreground">
                  Bạn sẽ được chuyển đến trang thanh toán an toàn của Stripe để hoàn tất thanh toán
                </p>
              )}

              {paymentMethod === "bank_transfer" && (
                <p className="text-sm text-muted-foreground">
                  Vui lòng chuyển khoản trước khi đến cửa hàng và mang theo bằng chứng chuyển khoản
                </p>
              )}

              {paymentMethod === "cash" && (
                <p className="text-sm text-muted-foreground">Vui lòng thanh toán tại cửa hàng khi đến</p>
              )}
            </div>

            <div className="mt-4 bg-primary/10 p-4 rounded-md flex justify-between items-center">
              <span className="font-medium">Tổng thanh toán:</span>
              <span className="text-xl font-bold text-primary">{service?.price.toLocaleString()} VND</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ReviewStep
