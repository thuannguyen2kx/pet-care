import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  Clock,
  User,
  PawPrint,
  Scissors,
  FileText,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusIndicator } from '@/features/appointment/components/admin-appointment-calendar/status-indicator';
import { useGetAppointmentById } from '@/features/appointment/hooks/queries/get-appointment';
import AppointmentStatusActions from '@/features/appointment/components/admin-appointment-details/appointment-status-action';
import PaymentManagement from '@/features/payment/components/payment-management';

const AppointmentDetailsPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useGetAppointmentById(appointmentId || '');
  const appointment = data?.appointment;
  
  // Handle error states
  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Không thể tải thông tin cuộc hẹn
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  if(!appointment) return null

  // Format date and time with error handling
  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'EEEE, dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'N/A';
    }
  };

  // Get status label
  const getStatusLabel = (status?: string) => {
    if (!status) return 'Không xác định';
    
    const statusMap: Record<string, string> = {
      'pending': 'Chờ xử lý',
      'confirmed': 'Đã xác nhận',
      'in-progress': 'Đang thực hiện',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    
    return statusMap[status] || status;
  };

  // Get payment status label
const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Đã thanh toán';
    case 'pending':
      return 'Chờ thanh toán';
    case 'failed':
      return 'Thanh toán thất bại';
    case 'refunded':
      return 'Đã hoàn tiền';
    default:
      return 'Không xác định';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'refunded':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

  // Get status color for badge
  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/appointments">Lịch hẹn</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Chi tiết lịch hẹn</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <Button 
                    variant="ghost" 
                    className="mb-2 p-0 h-auto" 
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm">Quay lại</span>
                  </Button>
                  <CardTitle className="text-2xl">
                    {isLoading ? (
                      <Skeleton className="h-8 w-64" />
                    ) : (
                      appointment?.serviceId.name || 'Chi tiết lịch hẹn'
                    )}
                  </CardTitle>
                </div>
                
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </>
                ) : (
                  <>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(appointment?.status)}
                    >
                      <StatusIndicator status={appointment?.status || ''} size="sm" />
                      {getStatusLabel(appointment?.status)}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={getPaymentStatusColor(appointment?.paymentStatus)}
                    >
                      <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                      {getPaymentStatusLabel(appointment?.paymentStatus)}
                    </Badge>
                  </>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date and Time */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                      <CalendarClock className="h-4 w-4 mr-1.5" />
                      Thời gian
                    </h3>
                    {isLoading ? (
                      <Skeleton className="h-6 w-full" />
                    ) : (
                      <div className="font-medium">
                        {formatDate(appointment?.scheduledDate)}
                      </div>
                    )}
                    {isLoading ? (
                      <Skeleton className="h-5 w-32 mt-1" />
                    ) : (
                      <div className="text-sm text-gray-500">
                        {appointment?.scheduledTimeSlot.start} - {appointment?.scheduledTimeSlot.end}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Service Info */}
                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                      <Scissors className="h-4 w-4 mr-1.5" />
                      Dịch vụ
                    </h3>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-5 w-32 mt-1" />
                      </>
                    ) : (
                      <>
                        <div className="font-medium">
                          {appointment?.serviceId?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5 inline mr-1" />
                          {appointment?.serviceId?.duration || 0} phút
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          <CreditCard className="h-3.5 w-3.5 inline mr-1" />
                          {appointment?.serviceId?.price?.toLocaleString() || 0} VNĐ
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Employee Info */}
                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                      <UserCheck className="h-4 w-4 mr-1.5" />
                      Nhân viên phụ trách
                    </h3>
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-6 w-40" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={appointment?.employeeId?.profilePicture?.url || ''} 
                            alt={appointment?.employeeId?.fullName || 'Employee'} 
                          />
                          <AvatarFallback>
                            {appointment?.employeeId?.fullName?.charAt(0) || 'E'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {appointment?.employeeId?.fullName || 'Chưa phân công'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer and Pet Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                      <User className="h-4 w-4 mr-1.5" />
                      Khách hàng
                    </h3>
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={appointment?.customerId?.profilePicture?.url || ''} 
                            alt={appointment?.customerId?.fullName || 'Customer'} 
                          />
                          <AvatarFallback>
                            {appointment?.customerId?.fullName?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {appointment?.customerId?.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment?.customerId?.email} • {appointment?.customerId?.phoneNumber}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                      <PawPrint className="h-4 w-4 mr-1.5" />
                      Thú cưng
                    </h3>
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={appointment?.petId?.profilePicture?.url || ''} 
                            alt={appointment?.petId?.name || 'Pet'} 
                          />
                          <AvatarFallback>
                            {appointment?.petId?.name?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {appointment?.petId?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment?.petId?.species} • {appointment?.petId?.breed}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Status and Payment */}
                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Thanh toán
                    </h3>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </>
                    ) : (
                      <>
                        <div className="font-medium">
                          {appointment?.totalAmount?.toLocaleString() || 0} VNĐ
                        </div>
                        <div className="text-sm text-gray-500">
                          {getPaymentStatusLabel(appointment?.paymentStatus)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6 space-y-4">
                <Separator />
                <div>
                  <h3 className="text-sm font-medium flex items-center text-gray-500 mb-2">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Ghi chú
                  </h3>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-2" />
                    </>
                  ) : (
                    <div className="text-sm">
                      {appointment?.notes || 'Không có ghi chú'}
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium flex items-center text-gray-500 mb-2">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Ghi chú dịch vụ
                  </h3>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-2" />
                    </>
                  ) : (
                    <div className="text-sm">
                      {appointment?.serviceNotes || 'Không có ghi chú dịch vụ'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chi tiết dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    {appointment?.serviceId?.description || 'Không có mô tả chi tiết dịch vụ.'}
                  </p>
                  
                  {appointment?.serviceId?.images && appointment.serviceId.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {appointment.serviceId.images
                        .filter(img => img.url)
                        .map((image, index) => (
                          <div key={index} className="rounded-md overflow-hidden">
                            <img 
                              src={image.url || ''} 
                              alt={`Service ${index + 1}`} 
                              className="h-24 w-full object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div> 
        <div className="w-full md:w-80">
          <AppointmentStatusActions 
            appointment={appointment}
            isLoading={isLoading}
          />
          <PaymentManagement appointment={appointment} isLoading={isLoading} isAdmin />
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;