

import { useCallback, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { AlertTriangle, Clock, Info, Calendar, User } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ServiceType } from "@/features/service/types/api.types"
import { useGetAvailableTimeSlots } from "@/features/appointment/hooks/queries/get-available-time-slot"
import { formatDuration } from "@/features/appointment/utils/appointment-form-config"
import type { FormValues } from "@/features/appointment/utils/appointment-form-config"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimeSelectionStepProps {
  form: UseFormReturn<FormValues>
  selectedDate: Date | undefined
  serviceId: string
  serviceType: string
  service?: ServiceType
}

const TimeSelectionStep: React.FC<TimeSelectionStepProps> = ({
  form,
  selectedDate,
  serviceId,
  serviceType,
  service,
}) => {
  // Lấy ID nhân viên từ form
  const selectedEmployeeId = form.watch("employeeId");

  // Get available time slots with employee filter
  const { data: timeSlotsData, isLoading: isTimeSlotsLoading } = useGetAvailableTimeSlots(
    selectedDate,
    serviceId,
    serviceType,
    selectedEmployeeId // Thêm ID nhân viên vào query
  )

  // Get all time slots from response
  const timeSlots = useMemo(() => timeSlotsData?.timeSlot?.slots || [], [timeSlotsData?.timeSlot?.slots]);
  
  // Count available and unavailable slots
  const availableCount = useMemo(() => 
    timeSlots.filter(slot => slot.isAvailable).length, 
    [timeSlots]
  );
  const unavailableCount = useMemo(() => 
    timeSlots.filter(slot => !slot.isAvailable).length, 
    [timeSlots]
  );
  
  // Kiểm tra thông tin đặc biệt từ API
  const isEmployeeNotWorking = timeSlotsData?.timeSlot?.employeeNotWorking || false
  const isEmployeeOnVacation = timeSlotsData?.timeSlot?.employeeOnVacation || false
  const noAvailableSlots = timeSlotsData?.timeSlot?.noAvailableSlots || false
  const employeeWorkHours = timeSlotsData?.timeSlot?.employeeWorkHours || []

  // Separate slots into morning and afternoon
  const morningSlots = useMemo(() => timeSlots.filter(slot => {
    const hour = Number.parseInt(slot.startTime.split(":")[0])
    return hour < 12
  }), [timeSlots]);

  const afternoonSlots = useMemo(() => timeSlots.filter(slot => {
    const hour = Number.parseInt(slot.startTime.split(":")[0])
    return hour >= 12
  }), [timeSlots]);

  const formatWorkHoursDisplay = useCallback((workHours: { start: string; end: string }[]) => {
    if (!workHours || workHours.length === 0) return "Không có thông tin";
    
    return workHours.map((hours, index) => (
      `${hours.start} - ${hours.end}${index < workHours.length - 1 ? ", " : ""}`
    )).join("");
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  // Kiểm tra slot có nằm trong giờ làm việc không
  // const isOutsideWorkHours = useCallback((slot: TimeSlotType) => {
  //   if (!selectedEmployeeId || !employeeWorkHours || employeeWorkHours.length === 0) 
  //     return false;
    
  //   // Kiểm tra slot có nằm trong bất kỳ ca làm việc nào không
  //   return !employeeWorkHours.some(workHour => {
  //     const workStartHour = parseInt(workHour.start.split(':')[0]);
  //     const workStartMinute = parseInt(workHour.start.split(':')[1]);
  //     const workEndHour = parseInt(workHour.end.split(':')[0]);
  //     const workEndMinute = parseInt(workHour.end.split(':')[1]);
      
  //     const slotStartHour = parseInt(slot.startTime.split(':')[0]);
  //     const slotStartMinute = parseInt(slot.startTime.split(':')[1]);
  //     const slotEndHour = parseInt(slot.endTime.split(':')[0]);
  //     const slotEndMinute = parseInt(slot.endTime.split(':')[1]);
      
  //     // Slot bắt đầu sau hoặc cùng giờ bắt đầu làm việc
  //     const isAfterWorkStart = 
  //       slotStartHour > workStartHour || 
  //       (slotStartHour === workStartHour && slotStartMinute >= workStartMinute);
      
  //     // Slot kết thúc trước hoặc cùng giờ kết thúc làm việc
  //     const isBeforeWorkEnd = 
  //       slotEndHour < workEndHour || 
  //       (slotEndHour === workEndHour && slotEndMinute <= workEndMinute);
      
  //     return isAfterWorkStart && isBeforeWorkEnd;
  //   });
  // }, [selectedEmployeeId, employeeWorkHours]);

  return (
    <FormField
      control={form.control}
      name="timeSlot"
      render={({ field }) => (
        <FormItem>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <FormLabel className="text-lg font-medium mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Chọn khung giờ
            </FormLabel>
          </motion.div>

          {/* Thông tin lịch làm việc của nhân viên */}
          {selectedEmployeeId && selectedDate && employeeWorkHours.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="mb-4 border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Lịch làm việc của nhân viên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}:
                    </span>
                    <span className="ml-2 text-primary">
                      {formatWorkHoursDisplay(employeeWorkHours)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Thông báo khi nhân viên không làm việc */}
          {(isEmployeeNotWorking || isEmployeeOnVacation) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nhân viên không làm việc</AlertTitle>
                <AlertDescription>
                  {isEmployeeOnVacation 
                    ? "Nhân viên đang trong thời gian nghỉ phép vào ngày này." 
                    : "Nhân viên không làm việc vào ngày này."}
                  {" "}Vui lòng chọn ngày khác hoặc chọn nhân viên khác.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {!isTimeSlotsLoading && timeSlots.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  Tổng số khung giờ: {timeSlots.length}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    <span className="h-2 w-2 bg-primary rounded-full mr-1.5"></span>
                    {availableCount} khả dụng
                  </Badge>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive">
                    <span className="h-2 w-2 bg-destructive rounded-full mr-1.5"></span>
                    {unavailableCount} không khả dụng
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          <FormControl>
            <div className="space-y-6">
              {/* Morning slots */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2"> 
                  Buổi sáng
                </h4>

                {isTimeSlotsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={`skeleton-morning-${i}`} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <RadioGroup
                    onValueChange={(value) => {
                      const [start, end, ...rest] = value.split("-")
                      const originalSlotIndexes = rest.length > 0 ? rest[0].split(",").map(Number) : []

                      field.onChange({
                        start,
                        end,
                        originalSlotIndexes,
                      })

                     
                    }}
                    className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
                    value={
                      field?.value?.start && field?.value?.end
                        ? `${field.value.start}-${field.value.end}-${field.value.originalSlotIndexes?.join(",")}`
                        : undefined
                    }
                  >
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 col-span-full"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {morningSlots.length > 0 ? (
                        morningSlots.map((slot, index) => (
                          <motion.div key={`morning-${index}`} variants={item} className="flex items-center">
                            <RadioGroupItem
                              value={`${slot.startTime}-${slot.endTime}-${slot.originalSlotIndexes?.join(",") || ""}`}
                              id={`time-morning-${index}`}
                              className="sr-only"
                              disabled={!slot.isAvailable}
                            />
                            <label
                              htmlFor={`time-morning-${index}`}
                              className={cn(
                                "cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-3 text-center transition-all relative",
                                !slot.isAvailable && "opacity-60 cursor-not-allowed bg-muted/30",
                                field?.value?.start === slot.startTime && field?.value?.end === slot.endTime
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : slot.isAvailable
                                    ? "hover:border-primary/50 hover:bg-primary/5"
                                    : "border-destructive/30"
                              )}
                            >
                              {slot.startTime} - {slot.endTime}
                               {!slot.isAvailable && (
                              <span className="absolute top-1 right-1 bg-red-500 text-white text-[11px] px-1 py-0.5 rounded-sm">
                                Đã đặt
                              </span>)}
                            </label>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-3 text-muted-foreground border border-dashed rounded-md">
                          Không có khung giờ sáng cho ngày này
                        </div>
                      )}
                    </motion.div>
                  </RadioGroup>
                )}
              </motion.div>

              {/* Afternoon slots */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  Buổi chiều
                </h4>

                {isTimeSlotsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={`skeleton-afternoon-${i}`} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <RadioGroup
                    onValueChange={(value) => {
                      const [start, end, ...rest] = value.split("-")
                      const originalSlotIndexes = rest.length > 0 ? rest[0].split(",").map(Number) : []

                      field.onChange({
                        start,
                        end,
                        originalSlotIndexes,
                      })

                     
                    }}
                    className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
                    value={
                      field.value?.start && field.value?.end
                        ? `${field.value.start}-${field.value.end}-${field.value.originalSlotIndexes?.join(",")}`
                        : undefined
                    }
                  >
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 col-span-full"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {afternoonSlots.length > 0 ? (
                        afternoonSlots.map((slot, index) => (
                          <motion.div key={`afternoon-${index}`} variants={item} className="flex items-center">
                            <RadioGroupItem
                              value={`${slot.startTime}-${slot.endTime}-${slot.originalSlotIndexes?.join(",") || ""}`}
                              id={`time-afternoon-${index}`}
                              className="sr-only"
                              disabled={!slot.isAvailable}
                            />
                            <label
                              htmlFor={`time-afternoon-${index}`}
                              className={cn(
                                "cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-3 text-center transition-all relative",
                                !slot.isAvailable && "opacity-60 cursor-not-allowed bg-rose-200",
                                field?.value?.start === slot.startTime && field?.value?.end === slot.endTime
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : slot.isAvailable
                                    ? "hover:border-primary/50 hover:bg-primary/5"
                                    : "border-destructive/30"
                              )}
                            >
                              {slot.startTime} - {slot.endTime}
                              {!slot.isAvailable && (
                              <span className="absolute top-1 right-1 bg-red-500 text-white text-[11px] px-1 py-0.5 rounded-sm">
                                Đã đặt
                              </span>
                            )}
                             
                            </label>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-3 text-muted-foreground border border-dashed rounded-md">
                          Không có khung giờ chiều cho ngày này
                        </div>
                      )}
                    </motion.div>
                  </RadioGroup>
                )}
              </motion.div>

              {/* Thông báo khi tất cả các slots đều đã đặt */}
              {!isTimeSlotsLoading && timeSlots.length > 0 && availableCount === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Không có khung giờ trống</AlertTitle>
                    <AlertDescription>
                      {noAvailableSlots 
                        ? "Không có khung giờ trống đủ dài cho dịch vụ này vào ngày đã chọn." 
                        : "Tất cả các khung giờ đã được đặt cho ngày này."}
                      {" "}Vui lòng chọn một ngày khác hoặc liên hệ với chúng tôi để được hỗ trợ.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Thông báo khi không có khung giờ nào */}
              {!isTimeSlotsLoading && timeSlots.length === 0 && !isEmployeeNotWorking && !isEmployeeOnVacation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Không có khung giờ</AlertTitle>
                    <AlertDescription>
                      Không có khung giờ nào được thiết lập cho ngày này. Vui lòng chọn một ngày khác hoặc liên hệ với chúng tôi để được hỗ trợ.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {service?.duration && service.duration > 30 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Alert className="bg-primary/5 border-primary/20">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      Mỗi khung giờ hiển thị đã được điều chỉnh để phù hợp với thời gian dịch vụ (
                      {formatDuration(service.duration)}).
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </div>
          </FormControl>
          <FormDescription className="mt-3">
            Chọn khung giờ phù hợp với bạn cho ngày đã chọn. Các khung giờ đã được đặt sẽ hiển thị mờ và không thể chọn.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Helper function for className conditionals
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

export default TimeSelectionStep