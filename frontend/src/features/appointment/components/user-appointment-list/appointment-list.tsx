import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Clock, Calendar, User, ChevronRight } from "lucide-react";
import { UserAppointmentType } from "@/features/appointment/types/api.types";
import StatusBadge from "./status-badge";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/helper";
import { formatDuration } from "@/features/appointment/utils/appointment-form-config";

interface AppointmentListViewProps {
  appointments: UserAppointmentType[];
  onCancelAppointment: (appointmentId: string) => void;
}

const AppointmentListView: React.FC<AppointmentListViewProps> = ({
  appointments,
  onCancelAppointment,
}) => {
  if (!appointments?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có lịch hẹn nào.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment._id}
          className="rounded-lg border border-slate-200 bg-white hover:shadow-sm transition-shadow"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {appointment.petId.profilePicture ? (
                  <img
                    src={appointment.petId.profilePicture.url || ""}
                    alt={appointment.petId.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {appointment.petId.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-lg">
                    {appointment.petId.name}
                  </h3>
                  <div>
                    <Link to={`/services/${appointment.serviceId._id}`} className="text-gray-500 text-sm hover:text-primary hover:underline">
                      {appointment.serviceId.name || "Dịch vụ không xác định"}
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Giá
                        <span className="ml-2 font-medium">
                          {formatVND(appointment.serviceId.price)}
                        </span>

                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Thời gian
                        <span className="ml-2 font-medium">
                          {formatDuration(appointment.serviceId.duration)}
                        </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <StatusBadge status={appointment.status} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(
                    new Date(appointment.scheduledDate),
                    "EEEE, dd/MM/yyyy",
                    {
                      locale: vi,
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{appointment.scheduledTimeSlot.start}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>
                  {appointment.employeeId?.fullName || "Chưa phân công"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center border-t border-slate-300 pt-3">
              <div className="text-sm text-gray-500">
                <span>ID: #{appointment._id.slice(-6)}</span>
              </div>

              <div className="flex gap-2">
                {(appointment.status === "pending" ||
                  appointment.status === "confirmed") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => onCancelAppointment(appointment._id)}
                  >
                    Hủy lịch hẹn
                  </Button>
                )}

                <Button asChild variant="secondary" size="sm" className="gap-1">
                  <Link to={`/appointments/${appointment._id}`}>
                    Xem chi tiết
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentListView;