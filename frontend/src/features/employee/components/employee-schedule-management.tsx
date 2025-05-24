// components/employee-schedule-manager.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Calendar Components
import {
  Calendar,
  dayjsLocalizer,
  type View,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";

// Local Components
import { ScheduleFormDialog } from "./schedule-form-dialog";
import { ScheduleStats, ScheduleHeaderStats } from "./schedule-stats";
import { CalendarLegend, ScheduleDetails } from "./schedule-details";
import { ScheduleGrid } from "./schedule-grid";

// Hooks and Utils
import { useEmployeeSchedule } from "../hooks/use-employee-schedule";
import { useAuthContext } from "@/context/auth-provider";
import { formatCalendarEvents, dayPropGetter } from "../utils/calendar-utils";
import { ScheduleFormData } from "../validation/schedule-schema";
import { CalendarToolbar } from "./calender-toolbar";
import { EventComponent } from "./event-component";

// Setup
dayjs.locale("vi");
const localizer = dayjsLocalizer(dayjs);

const EmployeeScheduleManager: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { user } = useAuthContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "grid">("calendar");

  // Use the employee schedule hook
  const {
    schedules,
    appointments,
    isLoading,
    selectedDate,
    setSelectedDate,
    getScheduleForDate,
    saveSchedule,
    deleteSchedule,
    monthlyAvailability,
    monthlyWorkingHours,
    isSaving,
    isDeleting,
  } = useEmployeeSchedule(employeeId || user?._id || "");


  // Handle clicking on a day
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
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

  // Save schedule
  const handleSaveSchedule = (formData: ScheduleFormData) => {
    if (!selectedDate) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const scheduleData = {
      date: formattedDate,
      isWorking: formData.isWorking,
      workHours: formData.workHours,
      note: formData.note?.trim() || undefined,
    };

    saveSchedule(scheduleData);
    setDialogOpen(false);
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

  // Format calendar events
  const calendarEvents = formatCalendarEvents(schedules, appointments);

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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">Lịch làm việc</h1>
        </div>
        <ScheduleHeaderStats
          schedules={schedules}
          monthlyWorkingHours={monthlyWorkingHours}
          monthlyAvailability={monthlyAvailability}
        />
      </div>

      {/* View toggle for small screens */}
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

      {/* Calendar/Grid View */}
      {viewMode === "calendar" ? (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={["month"] as View[]}
              onSelectEvent={(event) => handleDayClick(event.start)}
              onSelectSlot={(slotInfo) => handleDayClick(slotInfo.start)}
              selectable
              components={{
                event: EventComponent,
                toolbar: (props) => (
                  <CalendarToolbar
                    {...props}
                    setViewMode={setViewMode}
                    viewMode={viewMode}
                  />
                ),
              }}
              dayPropGetter={(date) => dayPropGetter(date, {
                schedules,
                appointments,
                currentDate,
                selectedDate,
              })}
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
              onNavigate={(newDate) => setCurrentDate(newDate)}
              defaultView="month"
            />
            <CalendarLegend />
          </CardContent>
        </Card>
      ) : (
        <ScheduleGrid
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          schedules={schedules}
          appointments={appointments}
          selectedDate={selectedDate}
          onDayClick={handleDayClick}
        />
      )}

      {/* Schedule Details and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ScheduleStats
            schedules={schedules}
            monthlyWorkingHours={monthlyWorkingHours}
            monthlyAvailability={monthlyAvailability}
          />
        </div>
        <div className="md:col-span-2">
          <ScheduleDetails
            selectedDate={selectedDate}
            schedule={selectedDate ? getScheduleForDate(selectedDate) : null}
            appointments={appointments}
            onEdit={() => setDialogOpen(true)}
          />
        </div>
      </div>

      {/* Schedule Form Dialog */}
      <ScheduleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        schedule={selectedDate ? getScheduleForDate(selectedDate) : null}
        appointments={appointments}
        onSave={handleSaveSchedule}
        onDelete={handleDeleteSchedule}
        isLoading={isSaving || isDeleting}
        hasExistingSchedule={!!selectedDate && !!getScheduleForDate(selectedDate)?._id}
      />
    </div>
  );
};

export default EmployeeScheduleManager;