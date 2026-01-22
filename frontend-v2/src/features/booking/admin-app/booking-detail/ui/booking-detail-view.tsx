import { AlertCircle } from 'lucide-react';

import { getPaymentStatusConfig } from '@/features/booking/config';
import { getCancellationInitiatorConfig } from '@/features/booking/config/booking-cancellation-initiator';
import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import {
  BOOKING_STATUS,
  type BookingDetail,
  type BookingStatus,
} from '@/features/booking/domain/booking.entity';
import { formatEmployeeSpecialty } from '@/features/employee/config';
import { formatPetType } from '@/features/pets/config';
import { getServiceCategoryLabel } from '@/features/service/config';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';
import { cn, getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';

type Props = {
  booking: BookingDetail;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onCancelBooking: (bookingId: string) => void;
};

export function AdminBookingDetailView({ booking, onUpdateBookingStatus, onCancelBooking }: Props) {
  return (
    <div className="bg-card mx-auto max-w-4xl space-y-8 p-6">
      <BackLink to={paths.admin.bookings.path} label="Danh sách đặt lịch" />

      <BookingHeader
        booking={booking}
        onUpdateBookingStatus={onUpdateBookingStatus}
        onCancelBooking={onCancelBooking}
      />

      <BookingSummary booking={booking} />

      <Separator />

      <ServiceInfo booking={booking} />

      <CustomerPetInfo booking={booking} />

      <EmployeeInfo booking={booking} />

      {(booking.customerNotes || booking.employeeNotes || booking.internalNotes) && (
        <NotesSection booking={booking} />
      )}

      <TransactionSection booking={booking} />

      {booking.rating && <RatingSection booking={booking} />}

      <TimelineSection booking={booking} />
    </div>
  );
}
function BookingHeader({
  booking,
  onUpdateBookingStatus,
  onCancelBooking,
}: {
  booking: BookingDetail;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onCancelBooking: (bookingId: string) => void;
}) {
  const bookingStatus = getStatusConfig(booking.status);
  const paymentStatus = getPaymentStatusConfig(booking.paymentStatus);

  return (
    <div className="space-y-3">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="h5-bold text-foreground">Chi tiết đặt lịch</h1>
          <Badge className={bookingStatus.className}>{bookingStatus.label}</Badge>
          <Badge className={paymentStatus.className}>{paymentStatus.label}</Badge>
        </div>
        <AdminActions
          booking={booking}
          onUpdateBookingStatus={onUpdateBookingStatus}
          onCancelBooking={onCancelBooking}
        />
      </div>

      <p className="text-muted-foreground text-sm">Mã đặt lịch: {booking.id}</p>
    </div>
  );
}
function AdminActions({
  booking,
  onUpdateBookingStatus,
  onCancelBooking,
}: {
  booking: BookingDetail;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onCancelBooking: (bookingId: string) => void;
}) {
  const disableActions = booking.isPast || booking.status === BOOKING_STATUS.CANCELLED;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disableActions}>
        <Button size="sm" variant="outline">
          Thao tác quản trị
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => onUpdateBookingStatus(booking.id, booking.status)}>
          Cập nhật trạng thái
        </DropdownMenuItem>
        <DropdownMenuItem>Phân công / Đổi nhân viên</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Đổi lịch hẹn</DropdownMenuItem>
        <DropdownMenuItem>Ghi chú nội bộ</DropdownMenuItem>

        {booking.isCancellable && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onCancelBooking(booking.id)}
            >
              Huỷ lịch hẹn
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-foreground text-sm font-semibold tracking-wider uppercase">{title}</h2>
      {children}
    </div>
  );
}

function BookingSummary({ booking }: { booking: BookingDetail }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <SummaryCard label="Bắt đầu" value={booking.startTime} />
      <SummaryCard label="Kết thúc" value={booking.endTime} />
      <SummaryCard label="Tổng tiền" value={`${booking.totalAmount}`} highlight />
    </div>
  );
}
function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-primary/10 rounded-lg p-4">
      <p className="text-muted-foreground text-xs tracking-wider uppercase">{label}</p>
      <p className={cn('mt-2 text-xl font-semibold', highlight && 'text-primary')}>{value}</p>
    </div>
  );
}
function ServiceInfo({ booking }: { booking: BookingDetail }) {
  return (
    <Section title="Dịch vụ">
      <p className="font-semibold">{booking.service.name}</p>
      <p className="text-muted-foreground text-sm">
        {getServiceCategoryLabel(booking.service.category)} • {booking.service.duration} phút
      </p>
    </Section>
  );
}
function CustomerPetInfo({ booking }: { booking: BookingDetail }) {
  const { customer, pet } = booking;

  return (
    <Section title="Khách hàng & Thú cưng">
      <div className="grid gap-6 sm:grid-cols-2">
        <InfoBlock
          avatar={customer.profilePicture.url}
          title={customer.fullName}
          subtitle={customer.email}
        />

        <div className="flex gap-4">
          <img
            src={pet.image || '/placeholder.svg'}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold">{pet.name}</p>
            <p className="text-muted-foreground text-sm">
              {pet.breed} • {formatPetType(pet.type)}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

type InfoBlockProps = {
  avatar?: string | null;
  title: string;
  subtitle?: string;
};

function InfoBlock({ avatar, title, subtitle }: InfoBlockProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatar ?? undefined} alt={title} />
        <AvatarFallback>{getInitials(title)}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="text-foreground font-semibold">{title}</p>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
function EmployeeInfo({ booking }: { booking: BookingDetail }) {
  const e = booking.employee;

  return (
    <Section title="Nhân viên phụ trách">
      <InfoBlock
        avatar={e.profilePicture.url}
        title={e.fullName}
        subtitle={e.specialties.map(formatEmployeeSpecialty).join(' • ')}
      />
    </Section>
  );
}
function NoteBox({
  title,
  content,
  className,
}: {
  title: string;
  content: string;
  className: string;
}) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <p className="mb-2 text-xs font-semibold uppercase">{title}</p>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}
function NotesSection({ booking }: { booking: BookingDetail }) {
  return (
    <Section title="Ghi chú">
      <div className="space-y-4">
        {booking.customerNotes && (
          <NoteBox
            title="Khách hàng"
            content={booking.customerNotes}
            className="border-blue-100 bg-blue-50 text-blue-900"
          />
        )}
        {booking.employeeNotes && (
          <NoteBox
            title="Nhân viên"
            content={booking.employeeNotes}
            className="border-green-100 bg-green-50 text-green-900"
          />
        )}
        {booking.internalNotes && (
          <NoteBox
            title="Nội bộ"
            content={booking.internalNotes}
            className="border-yellow-100 bg-yellow-50 text-yellow-900"
          />
        )}
      </div>
    </Section>
  );
}
function TransactionSection({ booking }: { booking: BookingDetail }) {
  return (
    <Section title="Giao dịch">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Tổng tiền" value={`$${booking.totalAmount}`} />
        <SummaryCard label="Đã thanh toán" value={`$${booking.paidAmount}`} />
        <SummaryCard label="Phương thức" value={booking.paymentMethod || 'N/A'} />
      </div>
    </Section>
  );
}
function RatingSection({ booking }: { booking: BookingDetail }) {
  return (
    <Section title="Đánh giá của khách hàng">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-yellow-500">★ {booking.rating!.score}</span>
        <span className="text-muted-foreground text-sm">/5</span>
      </div>
      {booking.rating?.feedback && (
        <p className="text-muted-foreground text-sm">{booking.rating.feedback}</p>
      )}
    </Section>
  );
}

function TimelineSection({ booking }: { booking: BookingDetail }) {
  return (
    <Section title="Lịch sử trạng thái">
      <div className="space-y-4">
        <div className="relative space-y-4 pl-6">
          {booking.statusHistory.map((entry, index) => {
            const statusConfig = getStatusConfig(entry.status);
            const isLast = index === booking.statusHistory.length - 1;

            return (
              <div key={entry.id} className="relative">
                {!isLast && (
                  <div className="bg-border absolute top-6 left-[-1.3rem] h-full w-0.5" />
                )}

                <div className="border-background bg-primary absolute top-1.5 -left-6.5 h-3 w-3 rounded-full border-2" />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                    <span className="text-muted-foreground text-xs">
                      {new Date(entry.changedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Được thay đổi bởi: {entry.changedBy}
                  </p>
                  {entry.reason && (
                    <>
                      <p className="text-muted-foreground text-sm">
                        Người huỷ:{' '}
                        {getCancellationInitiatorConfig(booking.cancellationInitiator)?.label}
                      </p>
                      <p className="text-foreground text-sm italic">Lý do: {entry.reason}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
