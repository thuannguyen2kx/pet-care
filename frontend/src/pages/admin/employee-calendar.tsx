import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarTimeline, Appointment } from '@/features/employee/components/calendar-timeline';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Info, AlertCircle, Calendar, Clock, User, Cat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetEmployee } from '@/features/employee/hooks/queries/get-employee';
import { cn } from '@/lib/utils';
import { useGetEmployeeSchedule } from '@/features/employee/hooks/queries/get-employee-schedule';

const EmployeeCalendarPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<'week' | 'day'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Fetch employee data
  const { data: employeeData, isLoading: isEmployeeLoading } = useGetEmployee(employeeId || "");
  
  // Fetch schedule data
  const {
    data: scheduleData,
    isLoading: isScheduleLoading,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useGetEmployeeSchedule(employeeId || "", {
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  });
  
  // Convert appointments to calendar format
  const appointments = useMemo(() => {
    if (!scheduleData?.appointments) return [];
    
    return scheduleData.appointments.map(appointment => {
      const scheduledDate = new Date(appointment.date);
      const [startHour, startMinute] = appointment.timeSlot.start.split(':').map(Number);
      const [endHour, endMinute] = appointment.timeSlot.end.split(':').map(Number);
      
      const startDateTime = new Date(scheduledDate);
      startDateTime.setHours(startHour, startMinute, 0);
      
      const endDateTime = new Date(scheduledDate);
      endDateTime.setHours(endHour, endMinute, 0);
      
      return {
        id: appointment._id,
        title: appointment.service.name,
        start: startDateTime,
        end: endDateTime,
        status: appointment.status,
        customer: {
          name: appointment.customer.fullName,
          phone: appointment.customer.phoneNumber,
        },
        pet: {
          name: appointment.pet.name,
          species: appointment.pet.species,
        },
      } as Appointment;
    });
  }, [scheduleData]);
  
  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };
  
  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  // Get work schedule data
  const workDays = useMemo(() => {
    if (!scheduleData?.workDays) return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return scheduleData.workDays;
  }, [scheduleData]);
  
  const workHours = useMemo(() => {
    if (!scheduleData?.workHours) return { start: "09:00", end: "17:00" };
    return {
      start: scheduleData.workHours.start,
      end: scheduleData.workHours.end,
    };
  }, [scheduleData]);
  
  // Handle refetch when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      refetchSchedule();
    }
  }, [startDate, endDate, refetchSchedule]);
  
  // Loading states
  if (isEmployeeLoading || isScheduleLoading) {
    return <div className="flex justify-center items-center h-64">Đang tải lịch làm việc...</div>;
  }
  
  // Error state
  if (scheduleError) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Đã xảy ra lỗi khi tải lịch làm việc</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/admin/employees">Quay lại danh sách nhân viên</Link>
        </Button>
      </div>
    );
  }
  
  const employee = employeeData?.employee;
  
  return (
    <>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to={`/admin/employees/${employeeId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Lịch làm việc: {employee?.fullName}</h1>
          </div>
          
          <div>
            <Select value={selectedView} onValueChange={(value: 'week' | 'day') => setSelectedView(value)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Chọn chế độ xem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="day">Theo ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lịch làm việc</CardTitle>
            <CardDescription>
              Quản lý lịch hẹn và thời gian làm việc của nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[calc(100vh-300px)] min-h-[600px]">
              <CalendarTimeline
                appointments={appointments}
                onAppointmentClick={handleAppointmentClick}
                workingHoursStart={workHours.start}
                workingHoursEnd={workHours.end}
                workDays={workDays}
                onDateRangeChange={handleDateRangeChange}
                staffId={employeeId}
                initialView={selectedView}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-2">
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm">Đã xác nhận</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Chờ xử lý</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Đang thực hiện</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Giờ làm việc: {workHours.start} - {workHours.end}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Appointment Detail Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về cuộc hẹn đã chọn
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{selectedAppointment.title}</div>
                    <div className="text-sm text-gray-500">Dịch vụ</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {format(selectedAppointment.start as Date, 'dd/MM/yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">Ngày hẹn</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {format(selectedAppointment.start as Date, 'HH:mm')} - {format(selectedAppointment.end as Date, 'HH:mm')}
                    </div>
                    <div className="text-sm text-gray-500">Thời gian</div>
                  </div>
                </div>
                
                {selectedAppointment.customer && (
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedAppointment.customer.name}</div>
                      <div className="text-sm text-gray-500">
                        {selectedAppointment.customer.phone || "Không có số điện thoại"}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedAppointment.pet && (
                  <div className="flex items-start gap-2">
                    <Cat className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedAppointment.pet.name}</div>
                      <div className="text-sm text-gray-500">
                        {selectedAppointment.pet.species || "Thú cưng"}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <Badge variant="secondary" className={cn(
                      
                      selectedAppointment.status === 'confirmed' && 'bg-teal-500',
                      selectedAppointment.status === 'pending' && 'bg-yellow-500',
                      selectedAppointment.status === 'in-progress' && 'bg-orange-500',
                      selectedAppointment.status === 'completed' && 'bg-green-500', 
                    )}>
                      {selectedAppointment.status === 'pending' && 'Chờ xử lý'}
                      {selectedAppointment.status === 'confirmed' && 'Đã xác nhận'}
                      {selectedAppointment.status === 'in-progress' && 'Đang thực hiện'}
                      {selectedAppointment.status === 'completed' && 'Hoàn thành'}
                      {selectedAppointment.status === 'cancelled' && 'Đã hủy'}
                      {!selectedAppointment.status && 'Không xác định'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">Trạng thái</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Đóng
            </Button>
            <Button asChild>
              <Link to={`/admin/appointments/${selectedAppointment?.id}`}>
                Xem chi tiết cuộc hẹn
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeCalendarPage;