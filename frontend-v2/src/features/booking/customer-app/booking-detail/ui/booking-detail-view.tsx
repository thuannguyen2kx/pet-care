import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertCircle, Clock, MessageSquare, Star, User } from 'lucide-react';
import { useState } from 'react';

import { getPaymentStatusConfig } from '@/features/booking/config';
import { getCancellationInitiatorConfig } from '@/features/booking/config/booking-cancellation-initiator';
import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import {
  BOOKING_STATUS,
  type BookingDetail,
  type BookingStatus,
} from '@/features/booking/domain/booking.entity';
import { formatPetType } from '@/features/pets/helpers';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';
import { cn, getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

type Props = {
  booking: BookingDetail;
};
export function BookingDetailView({ booking }: Props) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  const handleReviewSubmit = () => {
    console.log('Review submitted:', { rating: reviewRating, content: reviewContent });
    setIsReviewOpen(false);
  };

  const paymentStatus = getPaymentStatusConfig(booking.paymentStatus);
  const cancellationInitiator = getCancellationInitiatorConfig(booking.cancellationInitiator);
  const rating = booking.rating;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <BackLink to={paths.customer.myBookings.path} label="Quay lại danh sách" />
        <div className="mb-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-foreground h5-bold tracking-tight">Chi tiết đặt lịch</h1>
              <p className="text-muted-foreground mt-2 text-sm">Mã: {booking.id}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <div className="overflow-hidden bg-white">
          {/* Pet & Service Summary */}
          <div className="border-muted border-b p-6 sm:p-8">
            <div className="mb-6 flex gap-6">
              {booking.pet.image && (
                <div className="shrink-0">
                  <img
                    src={booking.pet.image || '/placeholder.svg'}
                    alt={booking.pet.name}
                    className="h-24 w-24 rounded-sm object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="mb-1 text-2xl font-light text-stone-900">{booking.pet.name}</h2>
                <p className="mb-4 text-sm text-stone-600">
                  {booking.pet.breed} • {formatPetType(booking.pet.type)}
                </p>
                <Badge variant="secondary">
                  <p className="text-sm font-medium">{booking.serviceSnapshot.name}</p>
                </Badge>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="border-muted border-b p-6 sm:p-8">
            <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
              Thông tin dịch vụ
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Danh mục</p>
                <p className="text-foreground text-sm font-medium">
                  {booking.serviceSnapshot.category}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Thời lượng</p>
                <p className="text-foreground text-sm font-medium">
                  {booking.serviceSnapshot.duration} phút
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Giá dịch vụ</p>
                <p className="text-primary text-sm font-medium">
                  {booking.serviceSnapshot.price.toLocaleString('vi-VN')} đ
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Thanh toán</p>
                <Badge className={paymentStatus.className}>{paymentStatus.label}</Badge>
              </div>
            </div>
          </div>

          {/* Schedule & Employee */}
          <div className="border-muted border-b p-6 sm:p-8">
            <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
              Lịch biểu
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Ngày & Giờ</p>
                  <p className="text-foreground text-sm font-medium">
                    {format(booking.scheduledDate, 'dd/MM/yyyy', { locale: vi })} •{' '}
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>

              {booking.employee && (
                <div className="flex items-center gap-3 pt-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Nhân viên phụ trách</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage src={booking.employee.profilePicture?.url ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(booking.employee.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-foreground text-sm font-medium">
                        {booking.employee.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-muted border-b p-6 sm:p-8">
            <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
              Thông tin khách hàng
            </h3>
            <div className="flex items-center gap-3">
              {booking.customer.profilePicture?.url && (
                <Avatar className="size-10">
                  <AvatarImage src={booking.customer.profilePicture.url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(booking.customer.fullName)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="text-foreground text-sm font-medium">{booking.customer.fullName}</p>
                <p className="text-muted-foreground text-xs">{booking.customer.email}</p>
              </div>
            </div>
          </div>

          {booking.status === BOOKING_STATUS.CANCELLED && booking.cancellationReason && (
            <div className="bg-destructive/10 border-muted border-b p-6 sm:p-8">
              <div className="flex gap-3">
                <AlertCircle className="text-destructive/80 mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-destructive/80 mb-2 text-sm font-medium">Lý do hủy</h3>
                  <p className="text-destructive mb-2 text-sm">{booking.cancellationReason}</p>
                  {booking.cancellationInitiator && (
                    <>
                      <p className="text-destructive/80 text-xs">
                        Người hủy:{' '}
                        <span className="font-medium">{cancellationInitiator?.label}</span>
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {cancellationInitiator?.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {(booking.paidAmount !== undefined ||
            booking.paymentMethod ||
            booking.customerNotes ||
            booking.employeeNotes) && (
            <div className="border-muted border-b p-6 sm:p-8">
              <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
                Thông tin bổ sung
              </h3>
              <div className="space-y-4">
                {booking.paidAmount !== undefined && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">Số tiền thanh toán</p>
                    <p className="text-foreground text-sm font-medium">
                      {booking.paidAmount.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                )}
                {booking.paymentMethod && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">Phương thức thanh toán</p>
                    <p className="text-foreground text-sm font-medium">{booking.paymentMethod}</p>
                  </div>
                )}
                {booking.customerNotes && (
                  <div className="pt-2">
                    <div className="mb-1 flex items-center gap-2">
                      <MessageSquare className="text-muted-foreground h-4 w-4" />
                      <p className="text-muted-foreground text-xs">Ghi chú của khách hàng</p>
                    </div>
                    <p className="border-muted bg-foreground/5 text-foreground rounded-sm border p-3 text-sm">
                      {booking.customerNotes}
                    </p>
                  </div>
                )}
                {booking.employeeNotes && (
                  <div className="pt-2">
                    <div className="mb-1 flex items-center gap-2">
                      <MessageSquare className="text-muted-foreground h-4 w-4" />
                      <p className="text-muted-foreground text-xs">Ghi chú của nhân viên</p>
                    </div>
                    <p className="border-muted bg-foreground/5 text-foreground rounded-sm border p-3 text-sm">
                      {booking.employeeNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Info */}
          {booking.isPast && (
            <div className="bg-warning/10 border-muted border-b p-6 sm:p-8">
              <div className="flex gap-3">
                <AlertCircle className="text-warning/80 mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-warning text-sm font-medium">Lịch đã qua</p>
                  <p className="text-warning/80 mt-1 text-xs">
                    Đặt lịch này đã diễn ra hoặc sắp kết thúc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {booking.status === BOOKING_STATUS.COMPLETED && (
            <div className="border-muted bg-success/5 border-b p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="text-success h-5 w-5" />
                  <div>
                    <h3 className="text-success text-sm font-medium">Đánh giá dịch vụ</h3>
                    {rating?.score ? (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating?.score ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-success text-xs font-medium">{rating.score}/5</span>
                      </div>
                    ) : (
                      <p className="text-success/80 mt-1 text-xs">Chưa có đánh giá</p>
                    )}
                  </div>
                </div>
                {!booking.rating && (
                  <button
                    onClick={() => setIsReviewOpen(true)}
                    className="bg-success/90 text-success-foreground hover:bg-success cursor-pointer rounded-sm px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Tạo đánh giá
                  </button>
                )}
              </div>
              {booking.rating && (
                <div className="border-muted mt-4 rounded-sm border p-3">
                  <p className="text-muted-foreground mb-1 text-xs">Nội dung đánh giá</p>
                  <p className="text-foreground text-sm">{booking.rating?.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="border-muted flex flex-col gap-3 border-t p-6 sm:flex-row sm:p-8">
            {booking.isCancellable && (
              <>
                <Button
                  variant="outline"
                  className="border-destructive bg-destructive/10 text-destructive hover:text-destructive hover:bg-destructive/20 flex-1"
                >
                  Hủy đặt lịch
                </Button>
              </>
            )}
            {!booking.isCancellable && (
              <div className="bg-foreground/5 text-foreground/50 flex-1 cursor-not-allowed rounded-sm px-4 py-2.5 text-center text-sm font-medium">
                Không thể hủy
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        {booking.statusHistory?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
              Lịch sử trạng thái
            </h3>

            <div className="space-y-3">
              {booking.statusHistory.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                const Icon = statusConfig.icon;

                return (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <div className="pt-0.5">
                      <Icon className={cn('h-4 w-4', statusConfig.timelineIconClass)} />
                    </div>

                    <div className={cn('flex-1', statusConfig.timelineIconClass)}>
                      <p>
                        <span className="font-medium">{statusConfig.label}</span>
                        {' • '}
                        {format(item.changedAt, 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </p>

                      {item.reason && (
                        <p className="text-muted-foreground mt-0.5 text-[11px]">{item.reason}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isReviewOpen && (
        <div className="bg-popover-foreground/50 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-popover w-full max-w-md rounded-sm">
            <div className="border-muted border-b p-6">
              <h2 className="text-foreground text-lg font-medium">Tạo đánh giá</h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="text-foreground mb-3 text-sm font-medium">Đánh giá của bạn</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-foreground mb-2 block text-sm font-medium">
                  Nội dung đánh giá
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  className="focus:ring-success border-border w-full rounded-sm border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-stone-200 p-6">
              <button
                onClick={() => setIsReviewOpen(false)}
                className="flex-1 rounded-sm bg-stone-100 px-4 py-2 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-200"
              >
                Hủy
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={reviewRating === 0}
                className="bg-success/90 text-success-foreground hover:bg-success disabled:bg-foreground/20 flex-1 rounded-sm px-4 py-2 text-sm font-medium transition-colors"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function StatusBadge({ status }: { status: BookingStatus }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
}
