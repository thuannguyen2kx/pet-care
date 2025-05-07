"use client"

import { useState, useEffect } from "react"
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
import type { FormValues } from "@/features/appointment/utils/appointment-form-config"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { vi } from "date-fns/locale"
import { format, addDays, isSameDay } from "date-fns"

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
  const today = new Date()
   
  // State for date selection
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const visibleDates = 7 // Number of dates visible at once
  
  // Generate the next 30 days
  useEffect(() => {
    const dates: Date[] = []
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(today, i))
    }
    setAvailableDates(dates)
  }, [])
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    form.setValue("scheduledDate", date)
    setSelectedDate(date)
  }
  
  // Navigation for date carousel
  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
    }
  }
  
  const handleNext = () => {
    if (startIndex + visibleDates < availableDates.length) {
      setStartIndex(startIndex + 1)
    }
  }
  
  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return form.getValues("scheduledDate") && 
      isSameDay(form.getValues("scheduledDate") as Date, date)
  }

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
          
          {/* Date Navigation Controls */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Ngày có sẵn</h3>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handlePrevious}
                disabled={startIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleNext}
                disabled={startIndex + visibleDates >= availableDates.length}
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
                {availableDates.slice(startIndex, startIndex + visibleDates).map((date, index) => (
                  <Button
                    key={index}
                    variant={isDateSelected(date) ? "default" : "outline"}
                    className={`flex-1 h-24 p-1 flex flex-col items-center justify-center transition-all border-slate-300
                      ${isDateSelected(date) ? 'bg-primary text-primary-foreground' : ''}
                    `}
                    disabled={isLoading}
                    onClick={() => handleDateSelect(date)}
                  >
                    <span className="text-xs font-medium">
                      {format(date, 'EEE', { locale: vi })}
                    </span>
                    <span className="text-lg font-bold">
                      {format(date, 'd')}
                    </span>
                    <span className="text-xs">
                      {format(date, 'MM/yyyy')}
                    </span>
                  </Button>
                ))}
              </div>
            </FormControl>
          </motion.div>
          
          {/* Show all dates in a grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-4"
          >
            <div className="grid grid-cols-5 gap-2 md:grid-cols-6 lg:grid-cols-10">
              {availableDates.map((date, index) => (
                <Button
                  key={index}
                  variant={isDateSelected(date) ? "default" : "outline"}
                  size="sm"
                  className={`h-20 p-1 flex flex-col items-center justify-center transition-all border-slate-300
                    ${isDateSelected(date) ? 'bg-primary text-primary-foreground' : ''}
                  `}
                  disabled={isLoading}
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="text-xs font-medium">
                    {format(date, 'EEE', { locale: vi })}
                  </span>
                  <span className="text-base font-bold">
                    {format(date, 'd')}
                  </span>
                  <span className="text-xs">
                    {format(date, 'MM')}
                  </span>
                </Button>
              ))}
            </div>
          </motion.div>
          
          {isDateSelected(field.value as Date) && (
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default DateSelectionStep