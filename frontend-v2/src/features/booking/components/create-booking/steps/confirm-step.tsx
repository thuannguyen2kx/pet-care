import { Calendar, Check, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { BookingSummary } from '@/features/booking/hooks/use-booking-summary';
import { formatPetType } from '@/features/pets/helpers';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  summary: BookingSummary;
  setNotes: (notes: string) => void;
};
export function ConfirmStep({ summary, setNotes }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Check className="text-primary h-8 w-8" />
        </div>
        <h2 className="text-foreground text-xl font-semibold">Xác nhận đặt lịch</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Vui lòng kiểm tra lại thông tin trước khi xác nhận
        </p>
      </div>
      <ConfirmSummary summary={summary} />
      <ConfirmNote notes={summary.notes} setNotes={setNotes} />
    </div>
  );
}
function ConfirmSummarySkeleton() {
  return (
    <div className="bg-secondary/30 space-y-4 p-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>

      <Separator />

      {/* DateTime Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

function ConfirmSummary({ summary }: { summary: BookingSummary }) {
  const { service, pet, employee, dateText, timeText, price, duration, notes } = summary;

  if (!service || !pet || !employee) {
    return <ConfirmSummarySkeleton />;
  }
  return (
    <div className="bg-secondary/30 space-y-4 p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          <img
            src={service?.images[0].url || '/placeholder.svg'}
            alt={service?.name || ''}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Dịch vụ
          </p>
          <p className="text-foreground font-medium">{service.name}</p>
        </div>
        <p className="text-primary font-semibold">{price}</p>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={pet.image?.url ?? undefined} />
          <AvatarFallback>{getInitials(pet.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Thú cưng
          </p>
          <p className="text-foreground font-medium">
            {pet.name} <span className="text-muted-foreground">({formatPetType(pet.type)})</span>
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={employee?.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(employee.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Chuyên viên
          </p>
          <p className="text-foreground font-medium">{employee.fullName}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-medium">{employee.rating}</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <div className="bg-primary/10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
          <Calendar className="text-primary h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Thời gian
          </p>
          <p className="text-foreground font-medium">{dateText}</p>
          <p className="text-primary text-sm">
            {timeText} - {duration} phút
          </p>
        </div>
      </div>

      {notes && (
        <>
          <Separator />
          <div className="bg-background/50 rounded-xl p-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Ghi chú
            </p>
            <p className="text-foreground mt-1 text-sm">{notes}</p>
          </div>
        </>
      )}
    </div>
  );
}

function ConfirmNote(props: { notes?: string; setNotes: (notes: string) => void }) {
  const { notes, setNotes } = props;
  const [localNotes, setLocalNotes] = useState(() => notes || '');
  const debouncedNotes = useDebounce(localNotes, 500);

  useEffect(() => {
    if (debouncedNotes === notes) return;
    setNotes(debouncedNotes);
  }, [debouncedNotes, setNotes, notes]);

  return (
    <div>
      <h3 className="text-foreground text-base font-semibold">Ghi chú</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Thông tin thêm giúp chúng tôi phục vụ bạn tốt hơn (tuỳ chọn)
      </p>
      <Textarea
        placeholder="Ví dụ: Bé sợ nước, cần nhẹ nhàng khi tắm..."
        value={localNotes}
        onChange={(e) => setLocalNotes(e.target.value)}
        className="mt-3 resize-none"
        rows={4}
      />
    </div>
  );
}
