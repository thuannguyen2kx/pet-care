// src/components/dashboard/reports-list.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { ReportType } from "@/features/report/types/api.types";
import { formatCurrency } from './dashboard-utils';
import { useReports } from "@/features/report/hooks/queries/index";
import GenerateReportModal from '../generate-report-modal'
import ReportDetail from '../report-detail';

// Report list pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    
    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    }
    
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2
    ];
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trước
      </Button>
      
      {getPageNumbers().map(page => (
        <Button
          key={page}
          variant="outline"
          size="sm"
          className={currentPage === page ? "bg-primary text-white" : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau
      </Button>
    </div>
  );
};

// Report row item component
interface ReportRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: any;
  onViewReport: (id: string) => void;
  onDownloadReport: (id: string) => void;
}

const ReportRow: React.FC<ReportRowProps> = ({ 
  report, 
  onViewReport, 
  onDownloadReport 
}) => {
  // Helper function to format period label based on report type
  const formatPeriodLabel = () => {
    const startDate = new Date(report.period.start);
    const endDate = new Date(report.period.end);
    
    if (report.reportType === 'daily') {
      return format(startDate, 'dd/MM/yyyy');
    } else if (report.reportType === 'weekly') {
      return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
    } else if (report.reportType === 'monthly') {
      return format(startDate, 'MM/yyyy');
    } else {
      return format(startDate, 'yyyy');
    }
  };
  
  // Helper for report type badge styling
  const getReportTypeBadgeClass = () => {
    switch (report.reportType) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'weekly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'monthly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'yearly':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return '';
    }
  };
  
  // Helper for report type label
  const getReportTypeLabel = () => {
    switch (report.reportType) {
      case 'daily':
        return 'Ngày';
      case 'weekly':
        return 'Tuần';
      case 'monthly':
        return 'Tháng';
      case 'yearly':
        return 'Năm';
      default:
        return report.reportType;
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="font-medium">
          Báo cáo #{report._id.toString().substring(0, 8)}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className={getReportTypeBadgeClass()}>
          {getReportTypeLabel()}
        </Badge>
      </td>
      <td className="px-4 py-3">
        {formatPeriodLabel()}
      </td>
      <td className="px-4 py-3 font-medium">
        {formatCurrency(report.metrics.revenue.total)}
      </td>
      <td className="px-4 py-3">
        {report.metrics.appointments.total}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm')}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onViewReport(report._id)}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onDownloadReport(report._id)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// Main Reports List component
const ReportsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [reportType, setReportType] = useState<ReportType | undefined>(undefined);
  
  // Fetch reports using the query hook
  const { data, isLoading, refetch } = useReports({
    reportType,
    page,
    limit
  });
  
  const reports = data?.reports || [];
  const totalPages = data?.meta?.pagination?.pages || 1;
  const totalCount = data?.meta?.total || 0;
  
  // State for report detail modal
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isReportDetailOpen, setIsReportDetailOpen] = useState(false);
  
  // Handler for viewing a report
  const handleViewReport = (id: string) => {
    setSelectedReportId(id);
    setIsReportDetailOpen(true);
  };
  
  // Handler for closing report detail
  const handleCloseReportDetail = () => {
    setIsReportDetailOpen(false);
  };
  
  // Handler for downloading a report
  const handleDownloadReport = (id: string) => {
    console.log('Download report:', id);
    // In a real app, you'd call an API endpoint to download
  };
  
  // Handler for report creation success
  const handleReportCreated = () => {
    refetch();
  };

  return (
    <div>
      {selectedReportId && (
        <ReportDetail
          reportId={selectedReportId}
          isOpen={isReportDetailOpen}
          onClose={handleCloseReportDetail}
        />
      )}
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <GenerateReportModal onSuccess={handleReportCreated} />
        
        <Button 
          variant="ghost" 
          className={`bg-white shadow-sm gap-2 ${!reportType ? 'border-primary text-primary' : ''}`}
          onClick={() => setReportType(undefined)}
        >
          Tất cả
        </Button>
        
        <Button 
          variant="ghost" 
          className={`bg-white shadow-sm gap-2 ${reportType === 'daily' ? 'border-primary text-primary' : ''}`}
          onClick={() => setReportType('daily')}
        >
          Báo cáo ngày
        </Button>
        
        <Button 
          variant="ghost" 
          className={`bg-white shadow-sm gap-2 ${reportType === 'weekly' ? 'border-primary text-primary' : ''}`}
          onClick={() => setReportType('weekly')}
        >
          Báo cáo tuần
        </Button>
        
        <Button 
          variant="ghost" 
          className={`bg-white shadow-sm gap-2 ${reportType === 'monthly' ? 'border-primary text-primary' : ''}`}
          onClick={() => setReportType('monthly')}
        >
          Báo cáo tháng
        </Button>
        
        <Button 
          variant="ghost" 
          className={`bg-white shadow-sm gap-2 ${reportType === 'yearly' ? 'border-primary text-primary' : ''}`}
          onClick={() => setReportType('yearly')}
        >
          Báo cáo năm
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left">Báo cáo</th>
              <th className="px-4 py-3 text-left">Loại</th>
              <th className="px-4 py-3 text-left">Thời gian</th>
              <th className="px-4 py-3 text-left">Doanh thu</th>
              <th className="px-4 py-3 text-left">Lịch hẹn</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  Đang tải...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  Không có báo cáo nào
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <ReportRow 
                  key={report._id}
                  report={report}
                  onViewReport={handleViewReport}
                  onDownloadReport={handleDownloadReport}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Hiển thị {(page - 1) * limit + 1}-{Math.min(page * limit, totalCount)} trên tổng số {totalCount} báo cáo
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default ReportsList;