"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FormValues } from "@/features/appointment/utils/appointment-form-config"
import { CalendarDays, ChevronLeft, ChevronRight, Info, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { vi } from "date-fns/locale"
import { format, addDays, isSameDay, isToday } from "date-fns"
import { useGetEmployeeSchedules } from "@/features/employee/hooks/queries/get-employee-schedules"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DateSelectionStepProps {
  form: UseFormReturn<FormValues>
  setSelectedDate: (date: Date | undefined) => void
  isLoading?: boolean
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({ 
  form, 
  setSelectedDate,
  isLoading = false 
}) => {
  // Get today's date
  const today = useMemo(() => new Date(), []);
   
  // State for date selection
  const [allDates, setAllDates] = useState<Date[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const visibleDates = 7 // Number of dates visible at once
  const daysToShow = 30 // Number of days to display
  
  // Lấy employee ID đã chọn từ form
  const selectedEmployeeId = form.watch("employeeId")
  
  // Lấy lịch làm việc của nhân viên nếu đã chọn nhân viên
  const startDate = useMemo(() => format(today, "yyyy-MM-dd"), [today]);
  const endDate = useMemo(() => format(addDays(today, daysToShow), "yyyy-MM-dd"), [today, daysToShow]);
  
  const { 
    data: employeeSchedulesData, 
    isLoading: isSchedulesLoading 
  } = useGetEmployeeSchedules(
    selectedEmployeeId, 
    startDate, 
    endDate,
    !!selectedEmployeeId // Chỉ enabled khi có employee ID
  )
  
  // Tạo và cập nhật danh sách tất cả các ngày trong 30 ngày tới
  useEffect(() => {
    const dates: Date[] = []
    for (let i = 0; i < daysToShow; i++) {
      dates.push(addDays(today, i))
    }
    setAllDates(dates)
  }, [today, daysToShow])
  
  // Kiểm tra ngày có khả dụng không (nhân viên làm việc vào ngày đó)
  const isDateAvailable = useCallback((date: Date) => {
    // Nếu không có employee ID hoặc không có dữ liệu lịch, tất cả ngày đều khả dụng
    if (!selectedEmployeeId || !employeeSchedulesData?.schedules) return true
    
    // Tìm lịch làm việc cho ngày cụ thể
    const matchingSchedule = employeeSchedulesData.schedules.find(schedule => {
      const scheduleDate = new Date(schedule.date)
      return isSameDay(scheduleDate, date)
    })
    
    // Nếu có lịch cụ thể, kiểm tra nhân viên có làm việc và có ít nhất một khoảng thời gian làm việc
    if (matchingSchedule) {
      return matchingSchedule.isWorking && matchingSchedule.workHours.length > 0
    }
    
    // Nếu không có lịch cụ thể, giả định ngày đó khả dụng
    return true
  }, [selectedEmployeeId, employeeSchedulesData?.schedules])
  
  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    // Chỉ cho phép chọn ngày khả dụng
    if (selectedEmployeeId && !isDateAvailable(date)) return
    
    form.setValue("scheduledDate", date, { shouldValidate: true })
    setSelectedDate(date)
  }, [form, setSelectedDate, isDateAvailable, selectedEmployeeId])
  
  // Navigation for date carousel
  const handlePrevious = useCallback(() => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1)
    }
  }, [startIndex])
  
  const handleNext = useCallback(() => {
    if (startIndex + visibleDates < allDates.length) {
      setStartIndex(prev => prev + 1)
    }
  }, [startIndex, allDates.length, visibleDates])
  
  // Check if a date is selected - Memoized to avoid recalculations
  const isDateSelected = useCallback((date: Date) => {
    const scheduledDate = form.getValues("scheduledDate");
    return scheduledDate && isSameDay(scheduledDate as Date, date);
  }, [form])
  
  // Lấy thông tin về workHours của một ngày - Memoized
  const getWorkHoursInfo = useCallback((date: Date) => {
    if (!selectedEmployeeId || !employeeSchedulesData?.schedules) return null
    
    const matchingSchedule = employeeSchedulesData.schedules.find(schedule => {
      const scheduleDate = new Date(schedule.date)
      return isSameDay(scheduleDate, date)
    })
    
    return matchingSchedule?.workHours || null
  }, [selectedEmployeeId, employeeSchedulesData])

  // Hiển thị thông tin về lý do ngày không khả dụng
  const getDateUnavailableReason = useCallback((date: Date): string | null => {
    if (!selectedEmployeeId || !employeeSchedulesData?.schedules) return null
    
    const matchingSchedule = employeeSchedulesData.schedules.find(schedule => {
      const scheduleDate = new Date(schedule.date)
      return isSameDay(scheduleDate, date)
    })
    
    if (!matchingSchedule) return null
    
    if (!matchingSchedule.isWorking) return "Ngày nghỉ"
    if (matchingSchedule.workHours.length === 0) return "Không có ca làm việc"
    
    return null
  }, [selectedEmployeeId, employeeSchedulesData?.schedules])

  // Visible dates from the carousel
  const visibleDatesArray = useMemo(() => 
    allDates.slice(startIndex, startIndex + visibleDates), 
    [allDates, startIndex, visibleDates]
  );

  // Count available dates
  const availableDatesCount = useMemo(() => 
    allDates.filter(date => isDateAvailable(date)).length,
    [allDates, isDateAvailable]
  );

  return (
    <FormField
      control={form.control}
      name="scheduledDate"
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <FormLabel className="text-lg font-medium mb-2 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Chọn ngày hẹn
            </FormLabel>
          </motion.div>
          
          {/* Thông báo khi đã chọn nhân viên */}
          {selectedEmployeeId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription>
                  {selectedEmployeeId && availableDatesCount === 0 ? (
                    "Nhân viên này không có lịch làm việc trong 30 ngày tới."
                  ) : (
                    `Hiển thị tất cả ngày trong 30 ngày tới. Các ngày nhân viên không làm việc sẽ bị vô hiệu hóa.`
                  )}
                </AlertDescription>
              </Alert>
              
              {selectedEmployeeId && availableDatesCount > 0 && (
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>
                    <Calendar className="h-4 w-4 inline-block mr-1.5 text-primary" />
                    Ngày có lịch làm việc: {availableDatesCount}/{daysToShow}
                  </span>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Loading state */}
          {isSchedulesLoading && selectedEmployeeId && (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <div className="flex flex-wrap gap-2">
                {Array(7).fill(0).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full flex-1" />
                ))}
              </div>
            </div>
          )}
          
          {/* Date Navigation Controls */}
          {(!isSchedulesLoading || !selectedEmployeeId) && allDates.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Ngày</h3>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handlePrevious}
                    disabled={startIndex === 0 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleNext}
                    disabled={startIndex + visibleDates >= allDates.length || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Date List */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-full"
              >
                <FormControl>
                  <div className="flex flex-wrap gap-2"> 
                    {visibleDatesArray.map((date, index) => {
                      const workHours = getWorkHoursInfo(date);
                      const dateIsAvailable = isDateAvailable(date);
                      const unavailableReason = getDateUnavailableReason(date);
                      const isDisable = Boolean(isLoading || (selectedEmployeeId && !dateIsAvailable)); 
                      return (
                        <div key={index} className="flex-1 relative">
                          <Button
                            variant={isDateSelected(date) ? "default" : "outline"}
                            className={cn(
                              "w-full h-24 p-1 flex flex-col items-center justify-center transition-all border-slate-300 disabled:bg-rose-100",
                              isDateSelected(date) ? 'bg-primary text-primary-foreground' : '',
                              !dateIsAvailable && selectedEmployeeId ? 'opacity-60 bg-muted/30' : '',
                              isToday(date) && !isDateSelected(date) ? 'border-primary/50' : ''
                            )}
                            disabled={isDisable}
                            onClick={() => handleDateSelect(date)}
                          >
                            <span className="text-xs font-medium">
                              {format(date, 'EEE', { locale: vi })}
                            </span>
                            <span className={cn(
                              "text-lg font-bold",
                              isToday(date) && !isDateSelected(date) ? 'text-primary' : ''
                            )}>
                              {format(date, 'd')}
                            </span>
                            <span className="text-xs">
                              {format(date, 'MM/yyyy')}
                            </span>
                            {workHours && workHours.length > 0 && (
                              <span className="text-[10px] mt-1 truncate max-w-full px-1">
                                {workHours.length === 1 
                                  ? `${workHours[0].start}-${workHours[0].end}`
                                  : `${workHours.length} ca`}
                              </span>
                            )}
                            
                            {isToday(date) && !isDateSelected(date) && (
                              <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[9px] px-1 py-0.5 rounded-sm">
                                Hôm nay
                              </span>
                            )}
                            
                          </Button>
                          
                          {/* Badge for unavailable dates */}
                          {selectedEmployeeId && !dateIsAvailable && unavailableReason && (
                            <span className="absolute bottom-1 w-full text-center">
                              <span className="text-[9px] bg-muted-foreground/10 text-muted-foreground px-1 py-0.5 rounded">
                                {unavailableReason}
                              </span>
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </FormControl>
              </motion.div>
              
              {/* Monthly Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-4"
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Xem tất cả ngày</h3>
                <div className="grid grid-cols-5 gap-1.5 md:grid-cols-7 lg:grid-cols-10">
                  {allDates.map((date, index) => {
                    const dateIsAvailable = isDateAvailable(date);
                    const workHours = getWorkHoursInfo(date);
                    const disabled = Boolean(isLoading || (selectedEmployeeId && !dateIsAvailable)); 
                    return (
                      <Button
                        key={index}
                        variant={isDateSelected(date) ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-20 p-1  flex flex-col items-center justify-center transition-all border-slate-300 disabled:bg-rose-100",
                          isDateSelected(date) ? 'bg-primary text-primary-foreground' : '',
                          !dateIsAvailable && selectedEmployeeId ? 'opacity-60 bg-muted/30' : '',
                          isToday(date) && !isDateSelected(date) ? 'border-primary/50' : ''
                        )}
                        disabled={disabled}
                        onClick={() => handleDateSelect(date)}
                      >
                        <span className="text-[10px] font-medium">
                          {format(date, 'EEE', { locale: vi })}
                        </span>
                        <span className={cn(
                          "text-sm font-bold",
                          isToday(date) && !isDateSelected(date) ? 'text-primary' : ''
                        )}>
                          {format(date, 'd')}
                        </span>
                        <span className="text-[9px]">
                          {format(date, 'MM')}
                        </span>
                        {workHours && workHours.length > 0 && (
                          <div className="w-2 h-2 rounded-full bg-primary/40 mt-0.5" />
                        )}
                      </Button>
                    )
                  })}
                </div>
              </motion.div>
              
              {field.value && isDateSelected(field.value as Date) && (
                <div className="mt-3 flex justify-center">
                  <Badge className="bg-primary/10 text-primary">
                    Đã chọn: {format(field.value as Date, 'EEEE, dd/MM/yyyy', { locale: vi })}
                  </Badge>
                </div>
              )}
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <FormDescription className="text-center mt-2">
                  Chọn ngày trong khoảng từ hôm nay đến 30 ngày tới.
                </FormDescription>
              </motion.div>
            </>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default DateSelectionStep