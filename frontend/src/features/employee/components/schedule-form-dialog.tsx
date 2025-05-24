import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, PlusCircle, Trash2, AlertCircle } from "lucide-react";

import {
  scheduleFormSchema,
  ScheduleFormData,
} from "../validation/schedule-schema";
import {
  generateTimeOptions,
  DEFAULT_WORK_HOURS,
} from "../utils/schedule-utils";
import { Schedule, Appointment } from "../types/schedule.types";
import { useAppointments } from "../hooks/use-appointment";

import { isPastDate, getPastDateMessage } from "../utils/date-validation";
import StatusBadge from "@/features/appointment/components/status-badge";

interface ScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  schedule: Schedule | null;
  appointments: Appointment[];
  onSave: (data: ScheduleFormData) => void;
  onDelete: () => void;
  isLoading: boolean;
  hasExistingSchedule: boolean;
}

export const ScheduleFormDialog: React.FC<ScheduleFormDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
  schedule,
  appointments,
  onSave,
  onDelete,
  isLoading,
  hasExistingSchedule,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const timeOptions = generateTimeOptions();

  const isPast = selectedDate ? isPastDate(selectedDate) : false;

  const { hasAppointmentsOnSelectedDate, getAppointmentsForSelectedDate } =
    useAppointments(selectedDate, appointments);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    mode: "onBlur", // Thay đổi từ onChange sang onBlur để tránh quá nhiều validation
    reValidateMode: "onChange", // Re-validate khi có thay đổi sau lần đầu validate
    defaultValues: {
      isWorking: schedule?.isWorking ?? true,
      workHours: schedule?.workHours ?? [...DEFAULT_WORK_HOURS],
      note: schedule?.note ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workHours",
  });

  const watchIsWorking = form.watch("isWorking");
  const watchWorkHours = form.watch("workHours");

  // Reset form when schedule changes
  useEffect(() => {
    if (schedule) {
      form.reset({
        isWorking: schedule.isWorking,
        workHours: schedule.workHours,
        note: schedule.note || "",
      });
    } else {
      form.reset({
        isWorking: true,
        workHours: [...DEFAULT_WORK_HOURS],
        note: "",
      });
    }
  }, [schedule, form]);

  // Trigger validation khi isWorking hoặc workHours thay đổi
  useEffect(() => {
    // Delay validation một chút để tránh quá nhiều validation calls
    const timeoutId = setTimeout(() => {
      form.trigger();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [watchIsWorking, watchWorkHours, form]);

  const handleAddTimeRange = () => {
    setValidationError(null);

    const lastRange = fields[fields.length - 1];
    const newStart = lastRange?.end || "09:00";

    const [startHour, startMinute] = newStart.split(":").map(Number);
    let endHour = startHour + 2;
    if (endHour > 23) endHour = 23;

    const newEnd = `${endHour.toString().padStart(2, "0")}:${startMinute
      .toString()
      .padStart(2, "0")}`;

    append({ start: newStart, end: newEnd });
  };

  const handleRemoveTimeRange = (index: number) => {
    remove(index);
    // Trigger validation sau khi remove
    setTimeout(() => form.trigger(), 0);
  };

  const handleSubmit = async (data: ScheduleFormData) => { 
    // Clear previous validation error
    setValidationError(null);
    
    // Validate form trước khi submit
    const isValid = await form.trigger();
    console.log("Is form valid:", isValid);
    
    if (!isValid) { 
      // Force hiển thị lỗi bằng cách set root error nếu không có lỗi nào hiển thị
      const hasVisibleErrors = Object.keys(form.formState.errors).length > 0;
      if (!hasVisibleErrors) {
        form.setError("root", {
          type: "manual",
          message: "Vui lòng kiểm tra và sửa các lỗi trong form"
        });
      }
      
      // Scroll to first error element
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]') || 
                          document.querySelector('.text-destructive') ||
                          document.querySelector('[role="alert"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    if (!data.isWorking && hasAppointmentsOnSelectedDate()) {
      setShowConfirmDialog(true);
      return;
    }

    onSave(data);
  };

  const handleConfirmedSave = () => {
    const data = form.getValues();
    onSave(data);
    setShowConfirmDialog(false);
  };

  // Handle switch change để trigger validation
  const handleWorkingChange = (value: boolean) => {
    form.setValue("isWorking", value);
    // Trigger validation sau khi thay đổi
    setTimeout(() => form.trigger(), 0);
  };

  // Helper function để extract tất cả error messages
  const getAllErrorMessages = () => {
    const errors = form.formState.errors;
    const messages: string[] = [];

    // Root errors
    if (errors.root?.message) {
      messages.push(errors.root.message);
    }

    // WorkHours array errors - check multiple possible locations
    if (errors.workHours?.message) {
      messages.push(errors.workHours.message);
    }
    
    // WorkHours root errors (from zod refine)
    if (errors.workHours?.root?.message) {
      messages.push(errors.workHours.root.message);
    }

    // Individual workHours errors
    if (Array.isArray(errors.workHours)) {
      errors.workHours.forEach((error, index) => {
        if (error?.start?.message) {
          messages.push(`Ca ${index + 1} - Giờ bắt đầu: ${error.start.message}`);
        }
        if (error?.end?.message) {
          messages.push(`Ca ${index + 1} - Giờ kết thúc: ${error.end.message}`);
        }
        // Check root error for each work hour item
        if (error?.root?.message) {
          messages.push(`Ca ${index + 1}: ${error.root.message}`);
        }
      });
    }

    // Note errors
    if (errors.note?.message) {
      messages.push(`Ghi chú: ${errors.note.message}`);
    }

    // isWorking errors
    if (errors.isWorking?.message) {
      messages.push(`Ngày làm việc: ${errors.isWorking.message}`);
    }

    // Fallback: extract any remaining errors that might be missed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractMessagesRecursively = (obj: any, path: string = '') => {
      if (obj && typeof obj === 'object') {
        if (obj.message && typeof obj.message === 'string' && !messages.includes(obj.message)) {
          messages.push(obj.message);
        }
        
        // Recursively check nested objects
        Object.keys(obj).forEach(key => {
          if (key !== 'message') {
            extractMessagesRecursively(obj[key], path ? `${path}.${key}` : key);
          }
        });
      }
    };

    // Apply fallback extraction
    extractMessagesRecursively(errors);

    return [...new Set(messages)]; // Remove duplicates
  };

  const allErrorMessages = getAllErrorMessages();
  const appointmentsForDate = getAppointmentsForSelectedDate();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate &&
                format(selectedDate, "EEEE, d MMMM, yyyy", { locale: vi })}
            </DialogTitle>
            <DialogDescription>
              Chỉnh sửa lịch trình cho ngày này
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Past Date Warning */}
              {isPast && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {getPastDateMessage()}. Bạn chỉ có thể xem thông tin, không
                    thể chỉnh sửa.
                  </AlertDescription>
                </Alert>
              )}

              {/* Working Day Toggle */}
              <FormField
                control={form.control}
                name="isWorking"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ngày làm việc</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Bật/tắt để đánh dấu ngày này là ngày làm việc
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={handleWorkingChange}
                        disabled={isPast}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work Hours Section */}
              {watchIsWorking && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-medium">
                      Giờ làm việc
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTimeRange}
                      className="flex items-center gap-2"
                      disabled={isPast}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Thêm ca
                    </Button>
                  </div>

                  {/* Hiển thị lỗi cho workHours array */}
                  {form.formState.errors.workHours?.message && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {form.formState.errors.workHours.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-lg border border-gray-200 p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Ca làm việc {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTimeRange(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={isPast}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`workHours.${index}.start`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giờ bắt đầu</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Trigger validation sau khi thay đổi
                                  setTimeout(() => form.trigger(), 0);
                                }}
                                value={field.value}
                                disabled={isPast}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn giờ bắt đầu" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`workHours.${index}.end`}
                          render={({ field }) => {
                            const startTime = form.watch(
                              `workHours.${index}.start`
                            );
                            const availableEndTimes = timeOptions.filter(
                              (option) => option.value > startTime
                            );

                            return (
                              <FormItem>
                                <FormLabel>Giờ kết thúc</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    // Trigger validation sau khi thay đổi
                                    setTimeout(() => form.trigger(), 0);
                                  }}
                                  value={field.value}
                                  disabled={isPast}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn giờ kết thúc" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableEndTimes.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Note Field */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thêm ghi chú về lịch trình ngày này"
                        className="resize-none"
                        disabled={isPast}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Appointments Section */}
              {appointmentsForDate.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Cuộc hẹn trong ngày:</h4>
                  <div className="space-y-2">
                    {appointmentsForDate.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">
                              {appointment.scheduledTimeSlot.start} -{" "}
                              {appointment.scheduledTimeSlot.end}
                            </div>
                            <div className="text-sm text-gray-600">
                              {appointment.petId?.name} •{" "}
                              {appointment.customerId?.fullName}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Errors Display */}
              {allErrorMessages.length > 0 && (
                <Alert variant="destructive" data-error="true">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {allErrorMessages.map((message, index) => (
                        <div key={index}>{message}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              {/* Validation error display */}
              {validationError && (
                <Alert variant="destructive" className="py-2" data-error="true">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {isPast ? "Đóng" : "Hủy"}
                </Button>
                {!isPast && (
                  <div className="flex gap-2">
                    {hasExistingSchedule && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isLoading}
                      >
                        Xóa
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      onClick={async () => {
                        // Trigger validation trước khi submit
                        await form.trigger();
                      }}
                    >
                      {isLoading ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cảnh báo</DialogTitle>
            <DialogDescription>
              Bạn đang đánh dấu một ngày có cuộc hẹn là ngày không làm việc.
              Điều này có thể gây xung đột với các cuộc hẹn đã được lên lịch.
              Bạn có chắc chắn muốn tiếp tục?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmedSave}>
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};