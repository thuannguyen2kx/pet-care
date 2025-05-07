"use client"

import type React from "react"
import type { UseFormReturn } from "react-hook-form"
import { AlertTriangle, Clock, Info } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ServiceType } from "@/features/service/types/api.types"
import { useGetAvailableTimeSlots } from "@/features/appointment/hooks/queries/get-available-time-slot"
import type { TimeSlotType } from "@/features/appointment/types/api.types"
import { formatDuration } from "@/features/appointment/utils/appointment-form-config"
import type { FormValues } from "@/features/appointment/utils/appointment-form-config"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface TimeSelectionStepProps {
  form: UseFormReturn<FormValues>
  selectedDate: Date | undefined
  serviceId: string
  serviceType: string
  service?: ServiceType
  setSelectedTimeSlotData: (timeSlot: TimeSlotType | null) => void
}

const TimeSelectionStep: React.FC<TimeSelectionStepProps> = ({
  form,
  selectedDate,
  serviceId,
  serviceType,
  service,
  setSelectedTimeSlotData,
}) => {
  // Get available time slots
  const { data: timeSlotsData, isLoading: isTimeSlotsLoading } = useGetAvailableTimeSlots(
    selectedDate,
    serviceId,
    serviceType,
  )

  const timeSlots = timeSlotsData?.timeSlot?.slots || []
  const availableTimeSlots = timeSlots.filter((slot) => slot.isAvailable)

  const morningSlots = availableTimeSlots.filter((slot) => {
    const hour = Number.parseInt(slot.startTime.split(":")[0])
    return hour < 12
  })

  const afternoonSlots = availableTimeSlots.filter((slot) => {
    const hour = Number.parseInt(slot.startTime.split(":")[0])
    return hour >= 12
  })

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

          <FormControl>
            <div className="space-y-6">
              {/* Morning slots */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
                    AM
                  </span>
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

                      // Find and set the selected time slot data
                      const selectedSlot = availableTimeSlots.find(
                        (slot) => slot.startTime === start && slot.endTime === end,
                      )

                      setSelectedTimeSlotData(selectedSlot || null)
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
                            />
                            <label
                              htmlFor={`time-morning-${index}`}
                              className={cn(
                                "cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-3 text-center transition-all",
                                field?.value?.start === slot.startTime && field?.value?.end === slot.endTime
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "hover:border-primary/50 hover:bg-primary/5",
                              )}
                            >
                              {slot.startTime} - {slot.endTime}
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
                  <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                    PM
                  </span>
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

                      // Find and set the selected time slot data
                      const selectedSlot = availableTimeSlots.find(
                        (slot) => slot.startTime === start && slot.endTime === end,
                      )

                      setSelectedTimeSlotData(selectedSlot || null)
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
                            />
                            <label
                              htmlFor={`time-afternoon-${index}`}
                              className={cn(
                                "cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-3 text-center transition-all",
                                field?.value?.start === slot.startTime && field?.value?.end === slot.endTime
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "hover:border-primary/50 hover:bg-primary/5",
                              )}
                            >
                              {slot.startTime} - {slot.endTime}
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

              {availableTimeSlots.length === 0 && !isTimeSlotsLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Không có khung giờ trống</AlertTitle>
                    <AlertDescription>Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.</AlertDescription>
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
          <FormDescription className="mt-3">Chọn khung giờ phù hợp với bạn cho ngày đã chọn.</FormDescription>
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
