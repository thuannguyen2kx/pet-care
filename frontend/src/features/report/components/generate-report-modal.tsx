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
import { toast } from 'sonner';
import { 
  useGenerateDailyReport, 
  useGenerateWeeklyReport, 
  useGenerateMonthlyReport, 
  useGenerateYearlyReport 
} from '@/features/report/hooks/queries';
import { ReportData, ReportType } from '@/features/report/types/api.types';

interface GenerateReportModalProps {
  onSuccess?: (data: ReportData) => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [date, setDate] = useState<Date | undefined>(new Date());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = (data: any, reportName: string) => {
    const reportData: ReportData = {
      success: true,
      reportId: data.report._id,
    };
    
    toast.success(`${reportName} đã được tạo thành công!`);
    setOpen(false);
    onSuccess?.(reportData);
  };

  const handleError = (error: Error) => {
    toast.error('Không thể tạo báo cáo: ' + (error.message || 'Đã xảy ra lỗi'));
  };

  // Use the mutation hooks
  const dailyMutation = useGenerateDailyReport({
    onSuccess: (data) => handleSuccess(data, 'Báo cáo ngày'),
    onError: handleError,
  });

  const weeklyMutation = useGenerateWeeklyReport({
    onSuccess: (data) => handleSuccess(data, 'Báo cáo tuần'),
    onError: handleError,
  });

  const monthlyMutation = useGenerateMonthlyReport({
    onSuccess: (data) => handleSuccess(data, 'Báo cáo tháng'),
    onError: handleError,
  });

  const yearlyMutation = useGenerateYearlyReport({
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
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-sm gap-2">
          <FileText className="h-4 w-4" />
          Tạo báo cáo mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
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
                <SelectTrigger id="report-type" className="col-span-3 w-full">
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