import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Edit2, CalendarIcon } from "lucide-react";
import { Schedule, Appointment } from "../types/schedule.types";
import { formatTime } from "../utils/schedule-utils";
import StatusBadge from "@/features/appointment/components/status-badge";

interface ScheduleDetailsProps {
  selectedDate: Date | null;
  schedule: Schedule | null;
  appointments: Appointment[];
  onEdit: () => void;
}

export const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({
  selectedDate,
  schedule,
  appointments,
  onEdit,
}) => {
  if (!selectedDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thao tác lịch trình</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-6">
              Nhấp vào bất kỳ ngày nào trong lịch để xem hoặc chỉnh sửa lịch trình
            </p>
            <div className="flex justify-center gap-4">
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
        </CardContent>
      </Card>
    );
  }

  const dayAppointments = appointments.filter((appointment) => {
    const appointmentDate = appointment.scheduledDate instanceof Date
      ? appointment.scheduledDate
      : new Date(appointment.scheduledDate);
    return appointmentDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết ngày {format(selectedDate, "dd/MM/yyyy")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant={schedule?.isWorking ? "default" : "destructive"}>
              {schedule?.isWorking ? "Ngày làm việc" : "Ngày nghỉ"}
            </Badge>
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>

          {schedule?.isWorking && schedule.workHours && (
            <div>
              <h3 className="text-sm font-medium mb-2">Ca làm việc:</h3>
              {schedule.workHours.map((range, index) => (
                <div
                  key={index}
                  className="flex items-center mt-1 bg-gray-50 p-2 rounded-md"
                >
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {formatTime(range.start)} - {formatTime(range.end)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {schedule?.note && (
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
              <p className="font-medium text-sm">Ghi chú:</p>
              <p className="text-sm mt-1">{schedule.note}</p>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-medium mb-2">Cuộc hẹn:</h3>
            {dayAppointments.length > 0 ? (
              <div className="space-y-2">
                {dayAppointments.map((appointment) => (
                  <Link
                    key={appointment._id}
                    to={`/manager/appointments/${appointment._id}`}
                    className="block"
                  >
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">
                            {appointment.scheduledTimeSlot.start} -{" "}
                            {appointment.scheduledTimeSlot.end}
                          </span>
                          <div className="mt-1 text-sm">
                            <span>{appointment.petId?.name || "Thú cưng"}</span>
                            {appointment.customerId?.fullName && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{appointment.customerId.fullName}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Không có cuộc hẹn nào</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// components/calendar-legend.tsx
export const CalendarLegend: React.FC = () => {
  return (
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
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-sm bg-gray-100 opacity-50 mr-2"></div>
        <span className="text-sm text-gray-500">Ngày đã qua (chỉ xem)</span>
      </div>
    </div>
  );
};