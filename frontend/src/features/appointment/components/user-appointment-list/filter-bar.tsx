import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select";
import { AppointmentStatus, appointmentStatusTranslations } from "@/constants";

interface AppointmentFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const AppointmentFilterBar: React.FC<AppointmentFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên thú cưng hoặc nhân viên..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[280px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>
                {
                  appointmentStatusTranslations[statusFilter as AppointmentStatus] ||
                  appointmentStatusTranslations["all"]
                } 
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="in-progress">Đang thực hiện</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AppointmentFilterBar;