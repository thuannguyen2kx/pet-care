import { Calendar, Clock, History, PlayCircle, List } from 'lucide-react';

import { BOOKING_VIEW, type BookingView } from '@/features/booking/domain/booking.state';

export const BOOKING_VIEW_CONFIG: Record<
  BookingView,
  {
    label: string;
    description?: string;
    icon: React.ElementType;
  }
> = {
  [BOOKING_VIEW.ALL]: {
    label: 'Tất cả',
    description: 'Toàn bộ lịch hẹn',
    icon: List,
  },
  [BOOKING_VIEW.TODAY]: {
    label: 'Hôm nay',
    description: 'Lịch hẹn trong ngày',
    icon: Clock,
  },
  [BOOKING_VIEW.UPCOMMING]: {
    label: 'Sắp tới',
    description: 'Các lịch hẹn sắp diễn ra',
    icon: Calendar,
  },
  [BOOKING_VIEW.ONGOING]: {
    label: 'Đang diễn ra',
    description: 'Dịch vụ đang được thực hiện',
    icon: PlayCircle,
  },
  [BOOKING_VIEW.PAST]: {
    label: 'Đã qua',
    description: 'Lịch hẹn trước đây',
    icon: History,
  },
};
