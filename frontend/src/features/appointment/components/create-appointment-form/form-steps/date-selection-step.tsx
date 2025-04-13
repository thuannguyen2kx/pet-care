import React from "react";
import { UseFormReturn } from "react-hook-form";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormValues } from "@/features/appointment/utils/appointment-form-config";

interface DateSelectionStepProps {
  form: UseFormReturn<FormValues>;
  setSelectedDate: (date: Date | undefined) => void;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
  form,
  setSelectedDate,
}) => {
  return (
    <FormField
      control={form.control}
      name="scheduledDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-lg font-medium mb-2">
            Chọn ngày hẹn
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "EEEE, dd/MM/yyyy", {
                      locale: vi,
                    })
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  setSelectedDate(date);
                  field.onChange(date);
                }}
                disabled={
                  (date) =>
                    date < addDays(new Date(), 1) || // No same-day appointments
                    date > addDays(new Date(), 30) // Max 30 days in advance
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            Chọn ngày cho cuộc hẹn. Bạn chỉ có thể đặt lịch từ ngày mai và
            trong vòng 30 ngày tới.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateSelectionStep;