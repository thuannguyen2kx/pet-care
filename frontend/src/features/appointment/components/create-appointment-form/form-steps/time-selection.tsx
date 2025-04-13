import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServiceType } from "@/features/service/types/api.types";
import { useGetAvailableTimeSlots } from "@/features/appointment/hooks/queries/get-available-time-slot"; 
import { TimeSlotType } from "@/features/appointment/types/api.types";
import { formatDuration } from "@/features/appointment/utils/appointment-form-config";
import { FormValues } from "@/features/appointment/utils/appointment-form-config";

interface TimeSelectionStepProps {
  form: UseFormReturn<FormValues>;
  selectedDate: Date | undefined;
  serviceId: string;
  serviceType: string;
  service?: ServiceType;
  setSelectedTimeSlotData: (timeSlot: TimeSlotType | null) => void;
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
    serviceType
  );
  
  const timeSlots = timeSlotsData?.timeSlot?.slots || [];
  const availableTimeSlots = timeSlots.filter((slot) => slot.isAvailable);
  
  const morningSlots = availableTimeSlots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(":")[0]);
    return hour < 12;
  });
  
  const afternoonSlots = availableTimeSlots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(":")[0]);
    return hour >= 12;
  });

  return (
    <FormField
      control={form.control}
      name="timeSlot"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium mb-2">
            Chọn khung giờ
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Morning slots */}
              <div>
                <h4 className="text-sm font-medium mb-2">Buổi sáng</h4>
                <RadioGroup
                  onValueChange={(value) => {
                    const [start, end, ...rest] = value.split("-");
                    const originalSlotIndexes =
                      rest.length > 0
                        ? rest[0].split(",").map(Number)
                        : [];

                    field.onChange({
                      start,
                      end,
                      originalSlotIndexes,
                    });

                    // Find and set the selected time slot data
                    const selectedSlot = availableTimeSlots.find(
                      (slot) =>
                        slot.startTime === start && slot.endTime === end
                    );

                    setSelectedTimeSlotData(selectedSlot || null);
                  }}
                  className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
                  value={
                    field?.value?.start && field?.value?.end
                      ? `${field.value.start}-${
                          field.value.end
                        }-${field.value.originalSlotIndexes?.join(",")}`
                      : undefined
                  }
                >
                  {isTimeSlotsLoading ? (
                    <div className="col-span-full text-center py-2">
                      Đang tải khung giờ...
                    </div>
                  ) : morningSlots.length > 0 ? (
                    morningSlots.map((slot, index) => (
                      <div
                        key={`morning-${index}`}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={`${slot.startTime}-${slot.endTime}-${
                            slot.originalSlotIndexes?.join(",") || ""
                          }`}
                          id={`time-morning-${index}`}
                        />
                        <label
                          htmlFor={`time-morning-${index}`}
                          className="cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-4 text-center"
                        >
                          {slot.startTime} - {slot.endTime}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-2 text-muted-foreground">
                      Không có khung giờ sáng cho ngày này
                    </div>
                  )}
                </RadioGroup>
              </div>

              {/* Afternoon slots */}
              <div>
                <h4 className="text-sm font-medium mb-2">Buổi chiều</h4>
                <RadioGroup
                  onValueChange={(value) => {
                    const [start, end, ...rest] = value.split("-");
                    const originalSlotIndexes =
                      rest.length > 0
                        ? rest[0].split(",").map(Number)
                        : [];

                    field.onChange({
                      start,
                      end,
                      originalSlotIndexes,
                    });

                    // Find and set the selected time slot data
                    const selectedSlot = availableTimeSlots.find(
                      (slot) =>
                        slot.startTime === start && slot.endTime === end
                    );

                    setSelectedTimeSlotData(selectedSlot || null);
                  }}
                  className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
                  value={
                    field.value?.start && field.value?.end
                      ? `${field.value.start}-${
                          field.value.end
                        }-${field.value.originalSlotIndexes?.join(",")}`
                      : undefined
                  }
                >
                  {isTimeSlotsLoading ? (
                    <div className="col-span-full text-center py-2">
                      Đang tải khung giờ...
                    </div>
                  ) : afternoonSlots.length > 0 ? (
                    afternoonSlots.map((slot, index) => (
                      <div
                        key={`afternoon-${index}`}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={`${slot.startTime}-${slot.endTime}-${
                            slot.originalSlotIndexes?.join(",") || ""
                          }`}
                          id={`time-afternoon-${index}`}
                        />
                        <label
                          htmlFor={`time-afternoon-${index}`}
                          className="cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-4 text-center"
                        >
                          {slot.startTime} - {slot.endTime}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-2 text-muted-foreground">
                      Không có khung giờ chiều cho ngày này
                    </div>
                  )}
                </RadioGroup>
              </div>

              {availableTimeSlots.length === 0 && !isTimeSlotsLoading && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Không có khung giờ trống</AlertTitle>
                  <AlertDescription>
                    Không có khung giờ trống cho ngày này. Vui lòng chọn
                    ngày khác.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Chọn khung giờ phù hợp với bạn cho ngày đã chọn.
            {service?.duration && service.duration > 30
              ? ` Mỗi khung giờ hiển thị đã được điều chỉnh để phù hợp với thời gian dịch vụ (${formatDuration(
                  service.duration
                )}).`
              : ""}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TimeSelectionStep;