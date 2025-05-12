"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  dayjsLocalizer,
  type EventProps,
  type View,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Clock,
  Check,
  X,
  Edit2,
  CalendarPlus2Icon as CalendarIcon2,
  Plus,
  Trash2,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import API from "@/lib/axios-client";

dayjs.locale("vi");

const localizer = dayjsLocalizer(dayjs);

// Updated to support multiple time ranges
interface TimeRange {
  start: string;
  end: string;
}

interface Schedule {
  _id?: string;
  date: string | Date;
  isWorking: boolean;
  workHours: TimeRange[]; // Modified to be an array of time ranges
  note?: string;
  isDefault?: boolean;
}

interface ScheduledTimeSlot {
  start: string;
  end: string;
}

interface Pet {
  _id: string;
  name: string;
  species?: string;
  breed?: string;
  profilePicture?: {
    url: string;
  };
}

interface Customer {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

interface Appointment {
  _id: string;
  scheduledDate: string | Date;
  scheduledTimeSlot: ScheduledTimeSlot;
  petId?: Pet;
  customerId?: Customer;
  status: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: {
    type: "schedule" | "appointment";
    isWorking?: boolean;
    workHours?: TimeRange[]; // Modified to be an array
    isDefault?: boolean;
    appointment?: Appointment;
  };
}

interface EmployeeScheduleManagementProps {
  employeeId: string;
}

interface ScheduleFormState {
  isWorking: boolean;
  workHours: TimeRange[]; // Modified to be an array
  note: string;
  scheduleId?: string;
}

// Helper function để định dạng thời gian
const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  return timeString.split(":").slice(0, 2).join(":");
};

// Helper to check if time ranges overlap
const doTimeRangesOverlap = (ranges: TimeRange[]): boolean => {
  if (ranges.length <= 1) return false;

  // Sort ranges by start time
  const sortedRanges = [...ranges].sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  // Check for overlaps
  for (let i = 0; i < sortedRanges.length - 1; i++) {
    if (sortedRanges[i].end > sortedRanges[i + 1].start) {
      return true;
    }
  }
  return false;
};

// Validate time ranges (end time > start time)
const areTimeRangesValid = (ranges: TimeRange[]): boolean => {
  return ranges.every((range) => range.start < range.end);
};

const DEFAULT_WORK_HOURS: TimeRange[] = [
  {
    start: "09:00",
    end: "17:00",
  },
];

const EmployeeScheduleManagement: React.FC<EmployeeScheduleManagementProps> = ({
  employeeId,
}) => {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormState>({
    isWorking: true,
    workHours: [...DEFAULT_WORK_HOURS], // Use spread to create a copy
    note: "",
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Tính toán phạm vi ngày cho tháng hiện tại
  const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");

  // Fetch dữ liệu lịch làm việc của nhân viên
  const { data: scheduleData, error } = useQuery<{
    schedules: Schedule[];
    appointments: Appointment[];
  }>({
    queryKey: ["employeeSchedule", employeeId, startDate, endDate],
    queryFn: async () => {
      console.log("Fetching schedule for:", startDate, "to", endDate);
      const response = await API.get(
        `/employees/${employeeId}/schedule-range`,
        {
          params: { startDate, endDate },
        }
      );

      // Transform legacy data format to new format if needed
      const schedules = response.data.schedules.map((schedule: any) => {
        // Check if workHours is an object (old format) and convert it to array
        if (schedule.workHours && !Array.isArray(schedule.workHours)) {
          return {
            ...schedule,
            workHours: [
              {
                start: schedule.workHours.start,
                end: schedule.workHours.end,
              },
            ],
          };
        }
        return schedule;
      });

      return {
        ...response.data,
        schedules,
      };
    },
    // Add this to ensure query refreshes when variables change
    enabled: !!employeeId && !!startDate && !!endDate,
  });

  // Mutation để cập nhật lịch
  const setScheduleMutation = useMutation({
    mutationFn: async (scheduleData: { schedules: Schedule[] }) => {
      return API.post(`/employees/${employeeId}/schedule`, scheduleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employeeSchedule", employeeId],
      });
      setEditMode(false);
      setShowConfirmDialog(false);
    },
  });

  // Mutation để xóa lịch
  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      return API.delete(`/employees/${employeeId}/schedule/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employeeSchedule", employeeId],
      });
      setEditMode(false);
    },
  });

  // Xử lý khi chọn ngày
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setValidationError(null);

    // Tìm kiếm lịch cho ngày này
    if (scheduleData?.schedules) {
      const existingSchedule = scheduleData.schedules.find((schedule) => {
        const scheduleDate =
          schedule.date instanceof Date
            ? schedule.date
            : new Date(schedule.date);
        return isSameDay(scheduleDate, date);
      });

      if (existingSchedule) {
        // Make sure workHours is an array
        const workHours = Array.isArray(existingSchedule.workHours)
          ? existingSchedule.workHours
          : [existingSchedule.workHours];

        setScheduleForm({
          isWorking: existingSchedule.isWorking,
          workHours: workHours.map((hours) => ({
            start: formatTime(hours.start),
            end: formatTime(hours.end),
          })),
          note: existingSchedule.note || "",
          scheduleId: existingSchedule._id,
        });
      } else {
        // Reset về mặc định
        setScheduleForm({
          isWorking: true,
          workHours: [...DEFAULT_WORK_HOURS],
          note: "",
        });
      }
    }

    setEditMode(false);
  };

  // Function to add a new time range
  const addTimeRange = () => {
    setValidationError(null);

    const lastRange = scheduleForm.workHours[scheduleForm.workHours.length - 1];
    let newStart = "10:00";
    let newEnd = "18:00";

    // Try to create a logical next time slot
    if (lastRange) {
      // Parse last end time
      const [endHour, endMinute] = lastRange.end.split(":").map(Number);

      // Add 1 hour for the next start time
      let nextHour = endHour + 1;
      if (nextHour > 23) nextHour = 23;

      newStart = `${nextHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;

      // Set end time to be 2 hours after start time
      nextHour = Math.min(nextHour + 2, 23);
      newEnd = `${nextHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;
    }

    setScheduleForm((prev) => ({
      ...prev,
      workHours: [...prev.workHours, { start: newStart, end: newEnd }],
    }));
  };

  // Function to remove a time range
  const removeTimeRange = (index: number) => {
    setValidationError(null);

    if (scheduleForm.workHours.length <= 1) {
      setValidationError("Cần có ít nhất một khoảng thời gian làm việc");
      return;
    }

    setScheduleForm((prev) => ({
      ...prev,
      workHours: prev.workHours.filter((_, i) => i !== index),
    }));
  };

  // Function to update a time range
  const updateTimeRange = (
    index: number,
    key: "start" | "end",
    value: string
  ) => {
    setValidationError(null);

    setScheduleForm((prev) => {
      const newWorkHours = [...prev.workHours];
      newWorkHours[index] = {
        ...newWorkHours[index],
        [key]: value,
      };
      return {
        ...prev,
        workHours: newWorkHours,
      };
    });
  };

  const validateSchedule = (): boolean => {
    // Clear any existing errors
    setValidationError(null);

    // If not working, no validation needed
    if (!scheduleForm.isWorking) {
      return true;
    }

    // Check that there is at least one time range
    if (scheduleForm.workHours.length === 0) {
      setValidationError("Cần có ít nhất một khoảng thời gian làm việc");
      return false;
    }

    // Check that each time range is valid (end > start)
    if (!areTimeRangesValid(scheduleForm.workHours)) {
      setValidationError("Thời gian kết thúc phải sau thời gian bắt đầu");
      return false;
    }

    // Check for overlapping time ranges
    if (doTimeRangesOverlap(scheduleForm.workHours)) {
      setValidationError("Các khoảng thời gian không được chồng chéo nhau");
      return false;
    }

    return true;
  };

  const handleSaveSchedule = () => {
    // Validate schedule data
    if (!validateSchedule()) {
      return;
    }

    if (!scheduleForm.isWorking && hasAppointmentsOnSelectedDate()) {
      setShowConfirmDialog(true);
      return;
    }

    saveSchedule();
  };

  const saveSchedule = () => {
    if (!selectedDate) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    setScheduleMutation.mutate({
      schedules: [
        {
          date: formattedDate,
          isWorking: scheduleForm.isWorking,
          workHours: scheduleForm.workHours,
          note: scheduleForm.note,
        },
      ],
    });
  };

  // Xử lý xóa lịch
  const handleDeleteSchedule = () => {
    if (scheduleForm.scheduleId) {
      deleteScheduleMutation.mutate(scheduleForm.scheduleId);
    }
  };

  // Kiểm tra xem ngày được chọn có cuộc hẹn không
  const hasAppointmentsOnSelectedDate = (): boolean => {
    if (!scheduleData?.appointments || !selectedDate) return false;

    return scheduleData.appointments.some((appointment) => {
      const appointmentDate =
        appointment.scheduledDate instanceof Date
          ? appointment.scheduledDate
          : new Date(appointment.scheduledDate);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  // Lấy các cuộc hẹn cho ngày được chọn
  const getAppointmentsForSelectedDate = (): Appointment[] => {
    if (!scheduleData?.appointments || !selectedDate) return [];

    return scheduleData.appointments.filter((appointment) => {
      const appointmentDate =
        appointment.scheduledDate instanceof Date
          ? appointment.scheduledDate
          : new Date(appointment.scheduledDate);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  // Định dạng các sự kiện lịch dựa trên lịch làm việc và cuộc hẹn
  const formatCalendarEvents = (): CalendarEvent[] => {
    if (!scheduleData?.schedules) return [];

    const events: CalendarEvent[] = [];

    // Thêm các ngày làm việc đã lên lịch
    scheduleData.schedules.forEach((schedule) => {
      const eventDate =
        schedule.date instanceof Date ? schedule.date : new Date(schedule.date);

      // Bỏ qua nếu ngày không hợp lệ
      if (isNaN(eventDate.getTime())) return;

      // Ensure workHours is always an array
      const workHoursArray = Array.isArray(schedule.workHours)
        ? schedule.workHours
        : [schedule.workHours];

      // Generate title based on work status and hours
      let title;
      if (schedule.isWorking) {
        if (workHoursArray.length === 1) {
          title = `Làm việc: ${formatTime(
            workHoursArray[0].start
          )} - ${formatTime(workHoursArray[0].end)}`;
        } else {
          title = `Làm việc: ${workHoursArray.length} ca`;
        }
      } else {
        title = "Không làm việc";
      }

      // Tạo đối tượng sự kiện
      events.push({
        id: schedule._id || `default-${eventDate.toISOString()}`,
        title,
        start: eventDate,
        end: eventDate,
        allDay: true,
        resource: {
          type: "schedule",
          isWorking: schedule.isWorking,
          workHours: workHoursArray,
          isDefault: schedule.isDefault || false,
        },
      });
    });

    // Thêm các cuộc hẹn
    if (scheduleData.appointments) {
      scheduleData.appointments.forEach((appointment) => {
        const appointmentDate =
          appointment.scheduledDate instanceof Date
            ? appointment.scheduledDate
            : new Date(appointment.scheduledDate);

        // Tạo sự kiện cuộc hẹn
        events.push({
          id: `appointment-${appointment._id}`,
          title: `${appointment.scheduledTimeSlot.start}-${
            appointment.scheduledTimeSlot.end
          }: ${appointment.petId?.name || "Thú cưng"}`,
          start: appointmentDate,
          end: appointmentDate,
          allDay: true,
          resource: {
            type: "appointment",
            appointment,
          },
        });
      });
    }

    return events;
  };

  // Component sự kiện tùy chỉnh cho lịch
  const EventComponent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    const { resource } = event;

    if (resource.type === "schedule") {
      // Hiển thị sự kiện lịch
      return (
        <div
          className={`p-1 text-xs rounded-md shadow-sm border ${
            resource.isWorking
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          } ${resource.isDefault ? "opacity-60" : "font-semibold"}`}
        >
          <div className="flex items-center">
            {resource.isWorking ? (
              <Clock className="w-3 h-3 mr-1" />
            ) : (
              <X className="w-3 h-3 mr-1" />
            )}
            <span className="truncate">{event.title}</span>
          </div>
          {resource.isDefault && (
            <span className="text-[10px] italic">(Mặc định)</span>
          )}
        </div>
      );
    } else {
      // Hiển thị sự kiện cuộc hẹn
      return (
        <div className="p-1 text-xs rounded-md shadow-sm border bg-blue-100 text-blue-800 border-blue-200">
          <div className="flex items-center">
            <CalendarIcon2 className="w-3 h-3 mr-1" />
            <span className="truncate">{event.title}</span>
          </div>
        </div>
      );
    }
  };

  // Xử lý hiển thị ngày/ngày trong lịch
  const dayPropGetter = (date: Date) => {
    // Tìm lịch cho ngày này
    const schedule = scheduleData?.schedules?.find((s) => {
      const scheduleDate = s.date instanceof Date ? s.date : new Date(s.date);
      return isSameDay(scheduleDate, date);
    });

    // Tìm các cuộc hẹn cho ngày này
    const hasAppointments = scheduleData?.appointments?.some((a) => {
      const appointmentDate =
        a.scheduledDate instanceof Date
          ? a.scheduledDate
          : new Date(a.scheduledDate);
      return isSameDay(appointmentDate, date);
    });

    const today = new Date();
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

    const classes = [
      "transition-all duration-200",
      isSameDay(date, today) ? "border-2 border-blue-500" : "",
      selectedDate && isSameDay(date, selectedDate) ? "bg-blue-50" : "",
      schedule && !schedule.isWorking ? "bg-red-50" : "",
      schedule && schedule.isWorking && !schedule.isDefault
        ? "bg-green-50"
        : "",
      hasAppointments ? "font-bold" : "",
      !isCurrentMonth ? "opacity-40" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return { className: classes };
  };

  // Các nút điều hướng cho lịch
  const CalendarToolbar: React.FC<any> = ({ date, onNavigate }) => {
    const goToToday = () => onNavigate("TODAY");
    const goToPrev = () => onNavigate("PREV");
    const goToNext = () => onNavigate("NEXT");

    // Extract month and year from the current date
    const currentDate = new Date(date);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Create arrays for months and years
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    // Generate years (current year -2 to current year +2)
    const baseYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => baseYear - 2 + i);

    // Handle direct navigation to a specific month/year
    const navigateToMonthYear = (month: number, year: number) => {
      const newDate = new Date(date);
      newDate.setMonth(month);
      newDate.setFullYear(year);
      onNavigate("DATE", newDate);
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 gap-4">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={goToPrev}>
            &lt;
          </Button>
          <Button size="sm" variant="outline" onClick={goToToday}>
            Hôm nay
          </Button>
          <Button size="sm" variant="outline" onClick={goToNext}>
            &gt;
          </Button>
        </div>

        <h2 className="text-sm font-semibold hidden md:block">
          {format(date, "MMMM yyyy", { locale: vi }).charAt(0).toUpperCase() +
            format(date, "MMMM yyyy", { locale: vi }).slice(1)}
        </h2>

        <div className="flex items-center gap-2">
          <Select
            value={currentMonth.toString()}
            onValueChange={(value) =>
              navigateToMonthYear(Number.parseInt(value), currentYear)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentYear.toString()}
            onValueChange={(value) =>
              navigateToMonthYear(currentMonth, Number.parseInt(value))
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  // Cập nhật tháng hiện tại khi lịch thay đổi
  const handleRangeChange = (range: { start: Date } | Date[] | Date) => {
    // Extract the date from the range
    let newDate: Date | null = null;

    if (Array.isArray(range) && range.length > 0) {
      newDate = new Date(range[0]);
    } else if (range instanceof Date) {
      newDate = new Date(range);
    } else if (range && typeof range === "object" && "start" in range) {
      newDate = new Date(range.start);
    }

    // Only update if we have a valid date and it's different from the current month
    if (
      newDate &&
      (newDate.getMonth() !== currentMonth.getMonth() ||
        newDate.getFullYear() !== currentMonth.getFullYear())
    ) {
      console.log("Changing month to:", format(newDate, "MMMM yyyy"));
      setCurrentMonth(newDate);
    }
  };

  // Render time slots for display mode
  const renderTimeSlots = () => {
    return scheduleForm.workHours.map((range, index) => (
      <div key={index} className="mt-2 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        <span>
          {formatTime(range.start)} - {formatTime(range.end)}
        </span>
      </div>
    ));
  };

  // Render time slot editors for edit mode
  const renderTimeSlotEditors = () => {
    return scheduleForm.workHours.map((range, index) => (
      <div
        key={index}
        className="my-3 p-3 bg-gray-50 rounded border border-slate-200"
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Ca làm việc {index + 1}</h4>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeTimeRange(index)}
            disabled={scheduleForm.workHours.length <= 1}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Giờ bắt đầu:
            </label>
            <Select
              value={range.start}
              onValueChange={(value) => updateTimeRange(index, "start", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn giờ bắt đầu" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, hour) => {
                  return ["00", "30"].map((minute) => {
                    const timeValue = `${hour
                      .toString()
                      .padStart(2, "0")}:${minute}`;
                    return (
                      <SelectItem key={timeValue} value={timeValue}>
                        {timeValue}
                      </SelectItem>
                    );
                  });
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giờ kết thúc:
            </label>
            <Select
              value={range.end}
              onValueChange={(value) => updateTimeRange(index, "end", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn giờ kết thúc" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, hour) => {
                  return ["00", "30"].map((minute) => {
                    const timeValue = `${hour
                      .toString()
                      .padStart(2, "0")}:${minute}`;
                    return (
                      <SelectItem key={timeValue} value={timeValue}>
                        {timeValue}
                      </SelectItem>
                    );
                  });
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    ));
  };

  // Render component
  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-xl font-bold mb-6">Quản lý lịch làm việc</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <span>Lỗi: Không thể tải dữ liệu lịch làm việc</span>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <Calendar
              localizer={localizer}
              events={formatCalendarEvents()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={["month"] as View[]}
              onSelectEvent={(event) => handleSelectDate(event.start)}
              onSelectSlot={(slotInfo) => handleSelectDate(slotInfo.start)}
              selectable
              components={{
                event: EventComponent as any,
                toolbar: CalendarToolbar,
              }}
              dayPropGetter={dayPropGetter}
              onRangeChange={handleRangeChange}
              messages={{
                next: "Kế tiếp",
                previous: "Trước",
                today: "Hôm nay",
                month: "Tháng",
                week: "Tuần",
                day: "Ngày",
              }}
              date={currentMonth}
              onNavigate={(newDate) => {
                console.log(
                  "onNavigate called with date:",
                  format(newDate, "yyyy-MM-dd")
                );
                setCurrentMonth(newDate);
              }}
              defaultView="month"
            />

            <div className="mt-4 p-3 bg-gray-50 rounded-md flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-200 mr-2"></div>
                <span className="text-sm">Ngày làm việc</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-red-100 border border-red-200 mr-2"></div>
                <span className="text-sm">Ngày nghỉ</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-blue-100 border border-blue-200 mr-2"></div>
                <span className="text-sm">Cuộc hẹn</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-gray-100 border border-gray-200 opacity-60 mr-2"></div>
                <span className="text-sm">Lịch mặc định</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm border-2 border-blue-500  mr-2"></div>
                <span className="text-sm">Hôm nay</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Schedule Detail */}
        <div>
          <Card className="px-2">
            {selectedDate ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">
                    {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })
                      .charAt(0)
                      .toUpperCase() +
                      format(selectedDate, "EEEE, dd/MM/yyyy", {
                        locale: vi,
                      }).slice(1)}
                  </h2>

                  {!editMode && (
                    <Button
                      size="icon"
                      variant={"ghost"}
                      onClick={() => setEditMode(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                    </Button>
                  )}
                </div>
                {editMode && (
                  <div className="flex justify-end gap-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditMode(false)}
                    >
                      <X className="w-4 h-4 mr-1" /> Hủy
                    </Button>
                    <Button size="sm" onClick={handleSaveSchedule}>
                      <Check className="w-4 h-4 mr-1" /> Lưu
                    </Button>
                  </div>
                )}

                {!editMode ? (
                  // Chế độ xem
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Badge>
                        {scheduleForm.isWorking ? "Làm việc" : "Không làm việc"}
                      </Badge>
                    </div>

                    {scheduleForm.isWorking && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">
                          Ca làm việc:
                        </h3>
                        {renderTimeSlots()}
                      </div>
                    )}

                    {scheduleForm.note && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium mb-1">Ghi chú:</p>
                        <p>{scheduleForm.note}</p>
                      </div>
                    )}

                    {/* Hiển thị các cuộc hẹn cho ngày này */}
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Cuộc hẹn:</h3>
                      {getAppointmentsForSelectedDate().length > 0 ? (
                        <ul className="space-y-2">
                          {getAppointmentsForSelectedDate().map((appt) => (
                            <li
                              key={appt._id}
                              className="bg-blue-50 p-2 rounded text-sm"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {appt.scheduledTimeSlot.start} -{" "}
                                  {appt.scheduledTimeSlot.end}
                                </span>
                                <Badge variant="outline">{appt.status}</Badge>
                              </div>
                              <div className="mt-1">
                                <span>{appt.petId?.name}</span>
                                <span className="mx-1">•</span>
                                <span>{appt.customerId?.fullName}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Không có cuộc hẹn nào
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Chế độ chỉnh sửa
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="mr-2">Trạng thái:</span>
                      <Switch
                        checked={scheduleForm.isWorking}
                        onCheckedChange={(checked) =>
                          setScheduleForm((prev) => ({
                            ...prev,
                            isWorking: checked,
                          }))
                        }
                      />
                      <span className="ml-2">
                        {scheduleForm.isWorking ? "Làm việc" : "Không làm việc"}
                      </span>
                    </div>

                    {/* Validation error display */}
                    {validationError && (
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription>{validationError}</AlertDescription>
                      </Alert>
                    )}

                    {scheduleForm.isWorking && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">Ca làm việc</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={addTimeRange}
                            className="h-8 px-2"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Thêm ca
                          </Button>
                        </div>

                        {renderTimeSlotEditors()}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Ghi chú:
                      </label>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={scheduleForm.note || ""}
                        onChange={(e) =>
                          setScheduleForm((prev) => ({
                            ...prev,
                            note: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>

                    {scheduleForm.scheduleId && (
                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteSchedule}
                        >
                          Xóa lịch làm việc này
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>
                  Vui lòng chọn một ngày để xem hoặc chỉnh sửa lịch làm việc
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Hộp thoại xác nhận */}
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
            <Button variant="destructive" onClick={saveSchedule}>
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeScheduleManagement;
