import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, FileText, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type ReportData = {
  success: boolean;
  reportId: string;
};

type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface GenerateReportModalProps {
  onSuccess?: (data: ReportData) => void;
}

// Fake API calls
const generateDailyReport = async (date: Date): Promise<ReportData> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, reportId: 'daily-' + Date.now() }), 1500)
  );
};

const generateWeeklyReport = async (date: Date): Promise<ReportData> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, reportId: 'weekly-' + Date.now() }), 1500)
  );
};

const generateMonthlyReport = async (date: Date): Promise<ReportData> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, reportId: 'monthly-' + Date.now() }), 1500)
  );
};

const generateYearlyReport = async (date: Date): Promise<ReportData> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, reportId: 'yearly-' + Date.now() }), 1500)
  );
};

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSuccess = (data: ReportData, reportName: string) => {
    toast.success(`${reportName} đã được tạo thành công!`);
    setOpen(false);
    onSuccess?.(data);
  };

  const handleError = (error: any) => {
    toast.error('Không thể tạo báo cáo: ' + (error.message || 'Đã xảy ra lỗi'));
  };

  const dailyMutation = useMutation({
    mutationFn: generateDailyReport,
    onSuccess: (data) => handleSuccess(data, 'Báo cáo ngày'),
    onError: handleError,
  });

  const weeklyMutation = useMutation({
    mutationFn: generateWeeklyReport,
    onSuccess: (data) => handleSuccess(data, 'Báo cáo tuần'),
    onError: handleError,
  });

  const monthlyMutation = useMutation({
    mutationFn: generateMonthlyReport,
    onSuccess: (data) => handleSuccess(data, 'Báo cáo tháng'),
    onError: handleError,
  });

  const yearlyMutation = useMutation({
    mutationFn: generateYearlyReport,
    onSuccess: (data) => handleSuccess(data, 'Báo cáo năm'),
    onError: handleError,
  });

  const getActiveMutation = () => {
    switch (reportType) {
      case 'daily': return dailyMutation;
      case 'weekly': return weeklyMutation;
      case 'monthly': return monthlyMutation;
      case 'yearly': return yearlyMutation;
    }
  };

  const activeMutation = getActiveMutation();
  const isLoading = activeMutation.isPending;

  const getReportTitle = () => {
    switch (reportType) {
      case 'daily': return 'Tạo báo cáo ngày';
      case 'weekly': return 'Tạo báo cáo tuần';
      case 'monthly': return 'Tạo báo cáo tháng';
      case 'yearly': return 'Tạo báo cáo năm';
      default: return 'Tạo báo cáo';
    }
  };

  const getFormattedDate = () => {
    if (!date) return '';
    switch (reportType) {
      case 'daily':
        return format(date, 'dd/MM/yyyy');
      case 'weekly': {
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(date.getDate() + 6);
        return `${format(weekStart, 'dd/MM/yyyy')} - ${format(weekEnd, 'dd/MM/yyyy')}`;
      }
      case 'monthly':
        return format(date, 'MM/yyyy');
      case 'yearly':
        return format(date, 'yyyy');
      default:
        return format(date, 'dd/MM/yyyy');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    switch (reportType) {
      case 'daily':
        dailyMutation.mutate(date);
        break;
      case 'weekly':
        weeklyMutation.mutate(date);
        break;
      case 'monthly':
        monthlyMutation.mutate(date);
        break;
      case 'yearly':
        yearlyMutation.mutate(date);
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white shadow-sm gap-2">
          <FileText className="h-4 w-4" />
          Tạo báo cáo mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getReportTitle()}</DialogTitle>
          <DialogDescription>
            Chọn kiểu báo cáo và khoảng thời gian để tạo báo cáo mới
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-type" className="text-right">
                Loại báo cáo
              </Label>
              <Select
                value={reportType}
                onValueChange={(value: ReportType) => setReportType(value)}
                disabled={isLoading}
              >
                <SelectTrigger id="report-type" className="col-span-3">
                  <SelectValue placeholder="Chọn loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Báo cáo ngày</SelectItem>
                  <SelectItem value="weekly">Báo cáo tuần</SelectItem>
                  <SelectItem value="monthly">Báo cáo tháng</SelectItem>
                  <SelectItem value="yearly">Báo cáo năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Ngày báo cáo
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? getFormattedDate() : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo báo cáo'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportModal;
