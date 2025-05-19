import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  dayjsLocalizer,
  type EventProps,
  type View,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  startOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import API from "@/lib/axios-client";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Alert, AlertDescription  } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Icons
import {
  Clock,
  X,
  Edit2,
  PlusCircle,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertCircle,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";
import { useAuthContext } from "@/context/auth-provider";

// Localization
dayjs.locale("vi");
const localizer = dayjsLocalizer(dayjs);

// Types
export interface TimeRange {
  start: string;
  end: string;
}

interface Schedule {
  _id?: string;
  date: string | Date;
  isWorking: boolean;
  workHours: TimeRange[];
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
    workHours?: TimeRange[];
    isDefault?: boolean;
    appointment?: Appointment;
  };
}

// Helper functions
const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  return timeString.split(":").slice(0, 2).join(":") };


const doTimeRangesOverlap = (ranges: TimeRange[]): boolean => {
  if (ranges.length <= 1) return false;

  // Sort ranges by start time
  const sortedRanges = [...ranges].sort((a, b) => a.start.localeCompare(b.start));

  // Check for overlaps
  for (let i = 0; i < sortedRanges.length - 1; i++) {
    if (sortedRanges[i].end > sortedRanges[i + 1].start) {
      return true;
    }
  }
  return false;
};

const areTimeRangesValid = (ranges: TimeRange[]): boolean => {
  return ranges.every((range) => range.start < range.end);
};

// Generate time options
const generateTimeOptions = (): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const formattedHour = hour % 12 || 12;
      const period = hour >= 12 ? "CH" : "SA";
      const label = `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
      options.push({ value, label });
    }
  }
  return options;
};

const DEFAULT_WORK_HOURS: TimeRange[] = [
  { start: "09:00", end: "17:00" },
];

const timeOptions = generateTimeOptions();

// Hook for employee schedule
const useEmployeeSchedule = (employeeId: string) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const currentMonth = selectedDate ? new Date(selectedDate) : new Date();
  
  // Calculate date range for fetching
  const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");
  
  // Fetch schedule data
  const { data, isLoading, error } = useQuery<{
    schedules: Schedule[];
    appointments: Appointment[];
  }>({
    queryKey: ["employeeSchedule", employeeId, startDate, endDate],
    queryFn: async () => {
      const response = await API.get(`/employees/${employeeId}/schedule-range`, {
        params: { startDate, endDate },
      });

      // Transform legacy data format to new format if needed
      // Todo: define a type for the response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schedules = response.data.schedules.map((schedule: any) => {
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
    enabled: !!employeeId && !!startDate && !!endDate,
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (scheduleData: any) => {
      return API.post(`/employees/${employeeId}/schedule`, { schedules: [scheduleData] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeSchedule", employeeId] });
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ scheduleId, data }: { scheduleId: string; data: any }) => {
      return API.put(`/employees/${employeeId}/schedule/${scheduleId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeSchedule", employeeId] });
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      return API.delete(`/employees/${employeeId}/schedule/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeSchedule", employeeId] });
    },
  });

  // Function to get schedule for a specific date
  const getScheduleForDate = (date: Date) => {
    if (!data?.schedules) return null;
    
    return data.schedules.find((schedule) => {
      const scheduleDate = schedule.date instanceof Date
        ? schedule.date
        : new Date(schedule.date);
      return isSameDay(scheduleDate, date);
    });
  };

  // Calculate monthly analytics
  const calculateMonthlyWorkingHours = (): number => {
    if (!data?.schedules) return 0;
    
    let totalHours = 0;
    data.schedules.forEach((schedule) => {
      if (schedule.isWorking && schedule.workHours) {
        schedule.workHours.forEach((range) => {
          const start = range.start.split(':').map(Number);
          const end = range.end.split(':').map(Number);
          
          const startHours = start[0] + start[1] / 60;
          const endHours = end[0] + end[1] / 60;
          
          totalHours += endHours - startHours;
        });
      }
    });
    
    return totalHours;
  };

  const calculateMonthlyAvailability = (): number => {
    if (!data?.schedules) return 0;
    
    const totalDaysInMonth = endOfMonth(currentMonth).getDate();
    const workingDays = data.schedules.filter(s => s.isWorking).length;
    
    return (workingDays / totalDaysInMonth) * 100;
  };

  // Return values and functions
  return {
    schedules: data?.schedules || [],
    appointments: data?.appointments || [],
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    getScheduleForDate,
    createSchedule: createScheduleMutation.mutate,
    updateSchedule: updateScheduleMutation.mutate,
    deleteSchedule: deleteScheduleMutation.mutate,
    monthlyWorkingHours: calculateMonthlyWorkingHours(),
    monthlyAvailability: calculateMonthlyAvailability(),
  };
};

// Main component
const EnhancedEmployeeScheduleManager: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<TimeRange[]>([...DEFAULT_WORK_HOURS]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(true);
  const [note, setNote] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState<Date | undefined>(new Date());
  const [validationError, setValidationError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "grid">("calendar");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {user} = useAuthContext()
  // Use the employee schedule hook
  const {
    schedules,
    appointments,
    isLoading,
    selectedDate,
    setSelectedDate,
    getScheduleForDate,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    monthlyAvailability,
    monthlyWorkingHours,
  } = useEmployeeSchedule(employeeId || user?._id || "");

  // Month navigation
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Handle clicking on a day
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setValidationError(null);
    
    const schedule = getScheduleForDate(date);

    if (schedule) {
      setIsWorking(schedule.isWorking);
      setSelectedTimeRanges(schedule.workHours);
      setNote(schedule.note || "");
    } else {
      // Default values for new schedule
      setIsWorking(true);
      setSelectedTimeRanges([...DEFAULT_WORK_HOURS]);
      setNote("");
    }

    setIsEditing(false);
    setDialogOpen(true);
  };

  // Validation
  const validateSchedule = (): boolean => {
    setValidationError(null);

    if (!isWorking) return true;

    if (selectedTimeRanges.length === 0) {
      setValidationError("Cần có ít nhất một khoảng thời gian làm việc");
      return false;
    }

    if (!areTimeRangesValid(selectedTimeRanges)) {
      setValidationError("Thời gian kết thúc phải sau thời gian bắt đầu");
      return false;
    }

    if (doTimeRangesOverlap(selectedTimeRanges)) {
      setValidationError("Các khoảng thời gian không được chồng chéo nhau");
      return false;
    }

    return true;
  };

  // Check if the selected date has appointments
  const hasAppointmentsOnSelectedDate = (): boolean => {
    if (!appointments || !selectedDate) return false;

    return appointments.some((appointment) => {
      const appointmentDate = appointment.scheduledDate instanceof Date
        ? appointment.scheduledDate
        : new Date(appointment.scheduledDate);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  // Get appointments for the selected date
  const getAppointmentsForSelectedDate = (): Appointment[] => {
    if (!appointments || !selectedDate) return [];

    return appointments.filter((appointment) => {
      const appointmentDate = appointment.scheduledDate instanceof Date
        ? appointment.scheduledDate
        : new Date(appointment.scheduledDate);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  // Save schedule
  const handleSaveSchedule = () => {
    if (!validateSchedule()) return;

    if (!isWorking && hasAppointmentsOnSelectedDate()) {
      setShowConfirmDialog(true);
      return;
    }

    saveSchedule();
  };

  const saveSchedule = () => {
    if (!selectedDate) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const schedule = getScheduleForDate(selectedDate);

    const scheduleData = {
      date: formattedDate,
      isWorking,
      workHours: selectedTimeRanges,
      note: note.trim() || undefined,
    };

    if (schedule?._id) {
      updateSchedule({
        scheduleId: schedule._id,
        data: scheduleData,
      });
    } else {
      createSchedule(scheduleData);
    }

    setDialogOpen(false);
    setShowConfirmDialog(false);
  };

  // Delete schedule
  const handleDeleteSchedule = () => {
    if (!selectedDate) return;

    const schedule = getScheduleForDate(selectedDate);
    if (schedule?._id) {
      deleteSchedule(schedule._id);
      setDialogOpen(false);
    }
  };

  // Time range management
  const handleAddTimeRange = () => {
    setValidationError(null);
    
    const lastRange = selectedTimeRanges[selectedTimeRanges.length - 1];
    
    // Try to create a logical next time slot
    const newStart = lastRange.end;
    
    // Calculate end time (2 hours after start)
    const [startHour, startMinute] = newStart.split(":").map(Number);
    let endHour = startHour + 2;
    if (endHour > 23) endHour = 23;
    
    const newEnd = `${endHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
    
    setSelectedTimeRanges([...selectedTimeRanges, { start: newStart, end: newEnd }]);
  };

  const handleRemoveTimeRange = (index: number) => {
    setValidationError(null);

    if (selectedTimeRanges.length <= 1) {
      setValidationError("Cần có ít nhất một khoảng thời gian làm việc");
      return;
    }

    setSelectedTimeRanges(selectedTimeRanges.filter((_, i) => i !== index));
  };

  const handleTimeRangeChange = (index: number, field: "start" | "end", value: string) => {
    setValidationError(null);

    const newRanges = [...selectedTimeRanges];
    newRanges[index][field] = value;
    setSelectedTimeRanges(newRanges);
  };

  // Format calendar events
  const formatCalendarEvents = (): CalendarEvent[] => {
    if (!schedules) return [];

    const events: CalendarEvent[] = [];

    // Add scheduled work days
    schedules.forEach((schedule) => {
      const eventDate = schedule.date instanceof Date
        ? schedule.date
        : new Date(schedule.date);

      // Skip if date is invalid
      if (isNaN(eventDate.getTime())) return;

      // Generate title based on work status and hours
      let title;
      if (schedule.isWorking) {
        if (schedule.workHours.length === 1) {
          title = `Làm việc: ${formatTime(schedule.workHours[0].start)} - ${formatTime(schedule.workHours[0].end)}`;
        } else {
          title = `Làm việc: ${schedule.workHours.length} ca`;
        }
      } else {
        title = "Không làm việc";
      }

      // Create event object
      events.push({
        id: schedule._id || `default-${eventDate.toISOString()}`,
        title,
        start: eventDate,
        end: eventDate,
        allDay: true,
        resource: {
          type: "schedule",
          isWorking: schedule.isWorking,
          workHours: schedule.workHours,
          isDefault: schedule.isDefault || false,
        },
      });
    });

    // Add appointments
    if (appointments) {
      appointments.forEach((appointment) => {
        const appointmentDate = appointment.scheduledDate instanceof Date
          ? appointment.scheduledDate
          : new Date(appointment.scheduledDate);

        // Create appointment event
        events.push({
          id: `appointment-${appointment._id}`,
          title: `${appointment.scheduledTimeSlot.start}-${appointment.scheduledTimeSlot.end}: ${appointment.petId?.name || "Thú cưng"}`,
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

  // Custom event component for BigCalendar
  const EventComponent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    const { resource } = event;

    if (resource.type === "schedule") {
      return (
        <div
          className={cn(
            "p-1 text-xs rounded-md shadow-sm border",
            resource.isWorking
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200",
            resource.isDefault ? "opacity-60" : "font-semibold"
          )}
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
      return (
        <div className="p-1 text-xs rounded-md shadow-sm border bg-blue-100 text-blue-800 border-blue-200">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span className="truncate">{event.title}</span>
          </div>
        </div>
      );
    }
  };

  // Calendar day styling
  const dayPropGetter = (date: Date) => {
    const schedule = schedules.find((s) => {
      const scheduleDate = s.date instanceof Date ? s.date : new Date(s.date);
      return isSameDay(scheduleDate, date);
    });

    const hasAppointments = appointments?.some((a) => {
      const appointmentDate = a.scheduledDate instanceof Date
        ? a.scheduledDate
        : new Date(a.scheduledDate);
      return isSameDay(appointmentDate, date);
    });

    const today = new Date();
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();

    return {
      className: cn(
        "transition-all duration-200",
        isSameDay(date, today) ? "border-2 border-blue-500" : "",
        selectedDate && isSameDay(date, selectedDate) ? "bg-blue-50" : "",
        schedule && !schedule.isWorking ? "bg-red-50" : "",
        schedule && schedule.isWorking && !schedule.isDefault ? "bg-green-50" : "",
        hasAppointments ? "font-bold" : "",
        !isCurrentMonth ? "opacity-40" : ""
      ),
    };
  };

  // Custom toolbar for BigCalendar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CalendarToolbar: React.FC<any> = ({ date, onNavigate }) => {
    const goToToday = () => onNavigate("TODAY");
    const goToPrev = () => onNavigate("PREV");
    const goToNext = () => onNavigate("NEXT");

    const currentDate = new Date(date);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const baseYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => baseYear - 2 + i);

    const navigateToMonthYear = (month: number, year: number) => {
      const newDate = new Date(date);
      newDate.setMonth(month);
      newDate.setFullYear(year);
      onNavigate("DATE", newDate);
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 gap-4">
        <div className="flex justify-between w-full md:w-auto">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={goToPrev}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={goToToday}>
              Hôm nay
            </Button>
            <Button size="sm" variant="outline" onClick={goToNext}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex md:hidden">
            <Button 
              variant={viewMode === "calendar" ? "default" : "outline"} 
              size="sm" 
              className="rounded-r-none"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="sm" 
              className="rounded-l-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
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

  // Handle calendar range change
  const handleRangeChange = (range: { start: Date } | Date[] | Date) => {
    let newDate: Date | null = null;

    if (Array.isArray(range) && range.length > 0) {
      newDate = new Date(range[0]);
    } else if (range instanceof Date) {
      newDate = new Date(range);
    } else if (range && typeof range === "object" && "start" in range) {
      newDate = new Date(range.start);
    }

    if (
      newDate &&
      (newDate.getMonth() !== currentDate.getMonth() ||
        newDate.getFullYear() !== currentDate.getFullYear())
    ) {
      setCurrentDate(newDate);
    }
  };

  // Create grid calendar days
  const renderGridCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);

    const days = [];
    let day = startDate;

    // Create calendar rows
    while (day <= monthEnd) {
      const week = [];

      // Create week
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const schedule = getScheduleForDate(cloneDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const hasAppts = appointments?.some(a => {
          const apptDate = a.scheduledDate instanceof Date 
            ? a.scheduledDate 
            : new Date(a.scheduledDate);
          return isSameDay(apptDate, cloneDay);
        });

        week.push(
          <div
            key={day.toString()}
            className={cn(
              "h-16 p-2 border border-gray-200 relative flex flex-col",
              isCurrentMonth ? "bg-white" : "bg-gray-50",
              !isCurrentMonth && "text-gray-400",
              isSameDay(day, new Date()) && "border-blue-500 border-2",
              selectedDate && isSameDay(day, selectedDate) && "bg-blue-50"
            )}
            onClick={() => isCurrentMonth && handleDayClick(cloneDay)}
          >
            <span className="text-xs">{format(day, "d")}</span>
            {isCurrentMonth && schedule && (
              <div className="mt-1">
                {schedule.isWorking ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs px-1 py-0 border-green-300">
                    Làm việc
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs px-1 py-0 border-red-300">
                    Nghỉ
                  </Badge>
                )}
              </div>
            )}
            {isCurrentMonth && hasAppts && (
              <div className="absolute bottom-1 right-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            )}
          </div>
        );

        day = addDays(day, 1);
      }

      days.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {week}
        </div>
      );
    }

    return days;
  };

  // Create week days header
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
    <div key={day} className="text-center p-2 border-b font-medium">
      {day}
    </div>
  ));

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with employee information */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">Lịch làm việc</h1>
        </div>
        <div className="mt-3 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Khả dụng:</span>
            <Badge variant="outline" className="ml-1 bg-blue-50">
              {monthlyAvailability.toFixed(0)}% số ngày
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Giờ làm việc:</span>
            <span className="text-sm">
              {monthlyWorkingHours.toFixed(1)} giờ trong tháng
            </span>
          </div>
        </div>
      </div>

      {/* View toggle for small screens (visible only on mobile) */}
      <div className="md:hidden">
        <Tabs
          defaultValue="calendar"
          onValueChange={(val) => setViewMode(val as "calendar" | "grid")}
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="calendar">Lịch</TabsTrigger>
            <TabsTrigger value="grid">Lưới</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" ? (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <Calendar
              localizer={localizer}
              events={formatCalendarEvents()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={["month"] as View[]}
              onSelectEvent={(event) => handleDayClick(event.start)}
              onSelectSlot={(slotInfo) => handleDayClick(slotInfo.start)}
              selectable
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              date={currentDate}
              onNavigate={(newDate) => {
                setCurrentDate(newDate);
              }}
              defaultView="month"
            />

            <div className="mt-2 p-3 bg-gray-50 rounded-md flex flex-wrap gap-3 border-t">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 mr-2"></div>
                <span className="text-sm">Ngày làm việc</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200 mr-2"></div>
                <span className="text-sm">Ngày nghỉ</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200 mr-2"></div>
                <span className="text-sm">Cuộc hẹn</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm border-2 border-blue-500 mr-2"></div>
                <span className="text-sm">Hôm nay</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Grid view (similar to the original implementation)
        <Card>
          <CardContent className="p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {format(currentDate, "MMMM yyyy", { locale: vi })
                  .charAt(0)
                  .toUpperCase() +
                  format(currentDate, "MMMM yyyy", { locale: vi }).slice(1)}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Chọn tháng
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={datePickerDate}
                      onSelect={(date) => {
                        if (date) {
                          setDatePickerDate(date);
                          setCurrentDate(date);
                          setCalendarOpen(false);
                        }
                      }}
                      locale={vi}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid calendar */}
            <div className="grid grid-cols-7">{weekDays}</div>
            {renderGridCalendarDays()}

            <div className="mt-4 p-3 bg-gray-50 rounded-md flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-green-50 border border-green-300 mr-2"></div>
                <span className="text-sm">Ngày làm việc</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-red-50 border border-red-300 mr-2"></div>
                <span className="text-sm">Ngày nghỉ</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm">Có cuộc hẹn</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm border-2 border-blue-500 mr-2"></div>
                <span className="text-sm">Hôm nay</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics and Schedule Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tổng quan tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Ngày làm việc
                </dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {schedules.filter((s) => s.isWorking).length}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày nghỉ</dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {schedules.filter((s) => !s.isWorking).length}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tổng giờ</dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {monthlyWorkingHours.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  TB giờ/ngày
                </dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {(schedules.filter((s) => s.isWorking).length > 0
                    ? monthlyWorkingHours /
                      schedules.filter((s) => s.isWorking).length
                    : 0
                  ).toFixed(1)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Appointments or Instructions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Chi tiết ngày ${format(selectedDate, "dd/MM/yyyy")}`
                : "Thao tác lịch trình"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      getScheduleForDate(selectedDate)?.isWorking
                        ? "default"
                        : "destructive"
                    }
                  >
                    {getScheduleForDate(selectedDate)?.isWorking
                      ? "Ngày làm việc"
                      : "Ngày nghỉ"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDayClick(selectedDate)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </div>

                {getScheduleForDate(selectedDate)?.isWorking && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Ca làm việc:</h3>
                    {getScheduleForDate(selectedDate)?.workHours.map(
                      (range, index) => (
                        <div
                          key={index}
                          className="flex items-center mt-1 bg-gray-50 p-2 rounded-md"
                        >
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {formatTime(range.start)} - {formatTime(range.end)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Note section */}
                {getScheduleForDate(selectedDate)?.note && (
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                    <p className="font-medium text-sm">Ghi chú:</p>
                    <p className="text-sm mt-1">
                      {getScheduleForDate(selectedDate)?.note}
                    </p>
                  </div>
                )}

                {/* Appointments for this day */}
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Cuộc hẹn:</h3>
                  {getAppointmentsForSelectedDate().length > 0 ? (
                    <div className="space-y-2">
                      {getAppointmentsForSelectedDate().map((appt) => (
                        <Link
                          key={appt._id}
                          to={`/manager/appointments/${appt._id}`}
                        >
                          <div
                            className="bg-blue-50 p-3 rounded-md border border-blue-100"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {appt.scheduledTimeSlot.start} -{" "}
                                {appt.scheduledTimeSlot.end}
                              </span>
                              <Badge variant="outline">{appt.status}</Badge>
                            </div>
                            <div className="mt-1 text-sm">
                              <span>{appt.petId?.name || "Thú cưng"}</span>
                              {appt.customerId?.fullName && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{appt.customerId.fullName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Không có cuộc hẹn nào
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">
                  Nhấp vào bất kỳ ngày nào trong lịch để xem hoặc chỉnh sửa lịch
                  trình
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 mr-2"></div>
                    <span className="text-sm">Ngày làm việc</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200 mr-2"></div>
                    <span className="text-sm">Ngày nghỉ</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Schedule Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? format(selectedDate, "EEEE, d MMMM, yyyy", { locale: vi })
                : "Lịch trình"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Chỉnh sửa lịch trình cho ngày này"
                : "Xem lịch trình cho ngày này"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isWorking">Ngày làm việc</Label>
              <Switch
                id="isWorking"
                checked={isWorking}
                onCheckedChange={setIsWorking}
                disabled={!isEditing}
              />
            </div>

            {/* Validation error display */}
            {validationError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {isWorking && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="mb-1 block">Giờ làm việc</Label>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={handleAddTimeRange}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Thêm ca
                      </Button>
                    )}
                  </div>

                  {isEditing
                    ? // Time slot editors for edit mode
                      selectedTimeRanges.map((range, index) => (
                        <div
                          key={index}
                          className="my-3 p-3 bg-gray-50 rounded border border-slate-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">
                              Ca làm việc {index + 1}
                            </h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTimeRange(index)}
                              disabled={selectedTimeRanges.length <= 1}
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
                                onValueChange={(value) =>
                                  handleTimeRangeChange(index, "start", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn giờ bắt đầu" />
                                </SelectTrigger>
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
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Giờ kết thúc:
                              </label>
                              <Select
                                value={range.end}
                                onValueChange={(value) =>
                                  handleTimeRangeChange(index, "end", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn giờ kết thúc" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions
                                    .filter(
                                      (option) => option.value > range.start
                                    )
                                    .map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))
                    : // Simple display for view mode
                      selectedTimeRanges.map((range, index) => (
                        <div
                          key={index}
                          className="flex items-center mb-2 bg-gray-50 p-2 rounded-md"
                        >
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {formatTime(range.start)} - {formatTime(range.end)}
                          </span>
                        </div>
                      ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    placeholder="Thêm ghi chú về lịch trình ngày này"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={!isEditing}
                    className="resize-none"
                  />
                </div>
              </div>
            )}

            {/* Appointments for this day (view only) */}
            {!isEditing && hasAppointmentsOnSelectedDate() && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Cuộc hẹn:</h3>
                <div className="space-y-2">
                  {getAppointmentsForSelectedDate().map((appt) => (
                    <div
                      key={appt._id}
                      className="bg-blue-50 p-2 rounded text-sm border border-blue-100"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {appt.scheduledTimeSlot.start} -{" "}
                          {appt.scheduledTimeSlot.end}
                        </span>
                        <Badge variant="outline">{appt.status}</Badge>
                      </div>
                      <div className="mt-1">
                        <span>{appt.petId?.name || "Thú cưng"}</span>
                        {appt.customerId?.fullName && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{appt.customerId.fullName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
                <div className="space-x-2">
                  {getScheduleForDate(selectedDate!) && (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteSchedule}
                    >
                      Xóa
                    </Button>
                  )}
                  <Button onClick={handleSaveSchedule}>Lưu</Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Đóng
                </Button>
                <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for scheduling changes with existing appointments */}
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
}
export default EnhancedEmployeeScheduleManager;