import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addDays, 
  addWeeks,
  subWeeks,
  parseISO,
  differenceInMinutes,
  getHours,
  getMinutes,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Menu,
  ArrowUpDown,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface Appointment {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  color?: string;
  status?: string;
  customer?: {
    name: string;
    phone?: string;
  };
  pet?: {
    name: string;
    species?: string;
  };
  employeeId?: string;
  allDay?: boolean;
}

export interface CalendarTimelineProps {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  workingHoursStart?: string; // Format: "09:00"
  workingHoursEnd?: string; // Format: "17:00"
  workDays?: string[]; // ["Monday", "Tuesday", ...]
  onDateRangeChange?: (start: Date, end: Date) => void;
  staffId?: string;
  initialView?: 'week' | 'day';
}

type ViewType = 'week' | 'day';

const TIME_INTERVAL = 30; // minutes
const CELL_HEIGHT = 40; // pixels
const DAY_START_HOUR = 7; // 7 AM
const DAY_END_HOUR = 20; // 8 PM

const getStatusColor = (status?: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'completed':
      return 'bg-gray-100 border-gray-300 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 border-red-300 text-red-800';
    default:
      return 'bg-purple-100 border-purple-300 text-purple-800';
  }
};

const getStatusText = (status?: string): string => {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'in-progress':
      return 'Đang thực hiện';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status || 'Không xác định';
  }
};

export const CalendarTimeline: React.FC<CalendarTimelineProps> = ({
  appointments = [],
  onAppointmentClick,
  workingHoursStart = "09:00",
  workingHoursEnd = "17:00",
  workDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  onDateRangeChange,
  staffId,
  initialView = 'week'
}) => {
  console.log("staffId", staffId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>(initialView);
  const [hoveredAppointment, setHoveredAppointment] = useState<Appointment | null>(null);
  
  // Reference to track if we've already notified about the current date range
  const dateRangeNotifiedRef = useRef(false);

  // Normalize date for the start of the week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday

  // For day view, we just use the current selected date
  const viewDays = view === 'week' 
    ? eachDayOfInterval({ start: weekStart, end: weekEnd }) 
    : [currentDate];

  // Memoize the date range to avoid unnecessary recalculations
  const dateRange = useMemo(() => {
    if (view === 'week') {
      return { start: weekStart, end: weekEnd };
    } else {
      return { start: currentDate, end: currentDate };
    }
  }, [currentDate, view, weekStart, weekEnd]);

  // Get all hours between start and end
  const timeSlots = useMemo(() => {
    const slots = [];
    // Total hours to display
    for (let hour = DAY_START_HOUR; hour <= DAY_END_HOUR; hour++) {
      // For half-hour marks
      for (let minute = 0; minute < 60; minute += TIME_INTERVAL) {
        slots.push({
          hour,
          minute,
          label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        });
      }
    }
    return slots;
  }, []);

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };
  
  const goToNext = () => {
    if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  // Check if a day is a work day
  const isWorkDay = (date: Date): boolean => {
    const dayName = format(date, 'EEEE'); // Monday, Tuesday, etc.
    return workDays.includes(dayName);
  };

  // Format the date range for display
  const formatDateRange = () => {
    if (view === 'week') {
      const start = format(weekStart, 'dd/MM/yyyy');
      const end = format(weekEnd, 'dd/MM/yyyy');
      return `${start} - ${end}`;
    } else {
      return format(currentDate, 'dd/MM/yyyy');
    }
  };

  // Check if a time is within working hours
  const isWithinWorkingHours = (hour: number, minute: number): boolean => {
    const [startHour, startMinute] = workingHoursStart.split(':').map(Number);
    const [endHour, endMinute] = workingHoursEnd.split(':').map(Number);
    
    const time = hour * 60 + minute;
    const workStart = startHour * 60 + startMinute;
    const workEnd = endHour * 60 + endMinute;
    
    return time >= workStart && time < workEnd;
  };

  // Process appointments to position them correctly in the grid
  const getAppointmentsForDay = (day: Date) => {
    return appointments
      .filter(appointment => {
        const start = appointment.start instanceof Date 
          ? appointment.start 
          : parseISO(appointment.start as string);
        
        return isSameDay(start, day);
      })
      .map(appointment => {
        const start = appointment.start instanceof Date 
          ? appointment.start 
          : parseISO(appointment.start as string);
        
        const end = appointment.end instanceof Date 
          ? appointment.end 
          : parseISO(appointment.end as string);
        
        // Calculate top position based on time
        const startHour = getHours(start);
        const startMinute = getMinutes(start);
        
        // Calculate the position as a percentage of the day
        const dayStartInMinutes = DAY_START_HOUR * 60;
        const startTimeInMinutes = startHour * 60 + startMinute;
        const topPosition = ((startTimeInMinutes - dayStartInMinutes) / (TIME_INTERVAL)) * CELL_HEIGHT;
        
        // Calculate height based on duration
        const durationInMinutes = differenceInMinutes(end, start);
        const height = (durationInMinutes / TIME_INTERVAL) * CELL_HEIGHT;
        
        return {
          ...appointment,
          topPosition,
          height: Math.max(CELL_HEIGHT, height), // Ensure minimum height
          startTime: format(start, 'HH:mm'),
          endTime: format(end, 'HH:mm'),
          startObj: start,
          endObj: end
        };
      })
      .sort((a, b) => {
        // Sort by start time
        return (a.startObj as Date).getTime() - (b.startObj as Date).getTime();
      });
  };

  // Notify parent of date range change
  useEffect(() => {
    // Only call onDateRangeChange if we have the callback and the date range has changed
    if (onDateRangeChange && !dateRangeNotifiedRef.current) {
      onDateRangeChange(dateRange.start, dateRange.end);
      dateRangeNotifiedRef.current = true;
    }
  }, [dateRange, onDateRangeChange]);

  // Reset notification flag when date range changes
  useEffect(() => {
    dateRangeNotifiedRef.current = false;
  }, [dateRange.start.getTime(), dateRange.end.getTime()]);
  
  return (
    <div className="flex flex-col h-full border rounded-lg bg-white overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Hôm nay
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {formatDateRange()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {view === 'week' ? 'Tuần' : 'Ngày'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView('day')}>
                Xem theo ngày
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('week')}>
                Xem theo tuần
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" asChild>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <Menu className="mr-2 h-4 w-4" />
              Menu
            </a>
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="flex flex-1 overflow-auto">
        {/* Time Labels Column */}
        <div className="flex flex-col w-16 min-w-16 border-r z-10 bg-white">
          <div className="sticky top-0 z-20 h-12 border-b bg-gray-50">
            {/* Empty space for alignment with day headers */}
            <div className="h-12"></div>
          </div>
          <div className="flex-1">
            {timeSlots.map((slot, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-start justify-end pr-2 border-b",
                  slot.minute === 0 ? "h-10 font-medium" : "h-10 text-xs text-gray-500"
                )}
                style={{ height: `${CELL_HEIGHT}px` }}
              >
                {slot.minute === 0 && (
                  <span>{slot.hour}:00</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Days Columns */}
        <div className="flex-1 flex overflow-auto">
          {viewDays.map((day, dayIndex) => (
            <div 
              key={dayIndex} 
              className={cn(
                "flex-1 min-w-[200px] flex flex-col border-r last:border-r-0",
                !isWorkDay(day) && "bg-gray-50"
              )}
            >
              {/* Day Header */}
              <div className={cn(
                "sticky top-0 z-20 h-12 flex flex-col items-center justify-center border-b",
                isSameDay(day, new Date()) && "bg-blue-50",
                !isWorkDay(day) && "bg-gray-100"
              )}>
                <div className="font-medium">
                  {format(day, 'EEE', { locale: vi })}
                </div>
                <div className={cn(
                  "text-sm",
                  isSameDay(day, new Date()) && "font-bold text-blue-600"
                )}>
                  {format(day, 'dd/MM')}
                </div>
              </div>
              
              {/* Time Slots with Appointments */}
              <div className="flex-1 relative">
                {/* Time Grid Background */}
                {timeSlots.map((slot, slotIndex) => (
                  <div 
                    key={slotIndex} 
                    className={cn(
                      "border-b",
                      isWithinWorkingHours(slot.hour, slot.minute) 
                        ? "bg-white" 
                        : "bg-gray-50"
                    )}
                    style={{ height: `${CELL_HEIGHT}px` }}
                  ></div>
                ))}
                
                {/* Appointments */}
                <div className="absolute inset-0 px-1">
                  {getAppointmentsForDay(day).map((appointment, appIndex) => (
                    <TooltipProvider key={appIndex} delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "absolute left-0 right-0 mx-1 rounded-sm border p-1 overflow-hidden cursor-pointer",
                              getStatusColor(appointment.status),
                              hoveredAppointment?.id === appointment.id && "ring-2 ring-blue-500"
                            )}
                            style={{ 
                              top: `${appointment.topPosition}px`, 
                              height: `${appointment.height}px`,
                            }}
                            onClick={() => onAppointmentClick?.(appointment)}
                            onMouseEnter={() => setHoveredAppointment(appointment)}
                            onMouseLeave={() => setHoveredAppointment(null)}
                          >
                            <div className="flex justify-between text-xs font-medium">
                              <span>{appointment.startTime} - {appointment.endTime}</span>
                              <Badge variant="outline" className="text-[10px] h-4">
                                {getStatusText(appointment.status)}
                              </Badge>
                            </div>
                            <div className="font-medium text-sm truncate">{appointment.title}</div>
                            {appointment.pet && (
                              <div className="text-xs truncate">
                                {appointment.pet.name}
                                {appointment.pet.species && ` (${appointment.pet.species})`}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1 p-1">
                            <div className="font-bold">{appointment.title}</div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.startTime} - {appointment.endTime}</span>
                            </div>
                            {appointment.customer && (
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{appointment.customer.name}</span>
                                {appointment.customer.phone && (
                                  <span className="text-gray-500">({appointment.customer.phone})</span>
                                )}
                              </div>
                            )}
                            {appointment.pet && (
                              <div>
                                <span className="font-medium">Thú cưng:</span> {appointment.pet.name}
                                {appointment.pet.species && ` (${appointment.pet.species})`}
                              </div>
                            )}
                            <div>
                              <Badge variant="outline">
                                {getStatusText(appointment.status)}
                              </Badge>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarTimeline;