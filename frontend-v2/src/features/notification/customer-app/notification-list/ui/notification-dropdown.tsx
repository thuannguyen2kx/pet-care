import { Bell } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

import { useCountUnread } from '@/features/notification/api/get-count-unread';
import { useMarkAllAsRead } from '@/features/notification/api/react-all-notification';
import { getNotificationTypeConfig } from '@/features/notification/config';
import { useNotificationListController } from '@/features/notification/customer-app/notification-list/application/use-notification-list-controller';
import {
  NOTIFICATION_TYPES,
  type Notification,
} from '@/features/notification/domain/notification.entity';
import { parseNotificationData } from '@/features/notification/domain/notification.transform';
import { EmptyState } from '@/shared/components/template/empty-state';
import { paths } from '@/shared/config/paths';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { ScrollArea } from '@/shared/ui/scroll-area';

export const NotificationDropdown = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotificationListController();
  const scrollRef = useRef<HTMLDivElement>(null);

  const countUnreadQuery = useCountUnread();
  const unreadCount = countUnreadQuery.data ?? 0;

  const markAllAsRead = useMarkAllAsRead();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="border-background absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 p-0 text-[10px] font-semibold shadow-sm"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-95 border-none p-0">
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-7 text-xs"
              onClick={() => markAllAsRead.mutate()}
            >
              {markAllAsRead.isPending ? 'Đang xử lý...' : 'Đánh dấu đã đọc'}
            </Button>
          )}
        </div>

        <ScrollArea ref={scrollRef} className="h-105" onScrollCapture={handleScroll}>
          {data.length === 0 ? (
            <EmptyState
              title="Chưa có thông báo nào"
              description="Chúng tôi sẽ thông báo cho bạn khi có điều gì quan trọng xảy ra."
              icon={Bell}
            />
          ) : (
            <div>
              {data.map((item) => (
                <NotificationItem key={item.id} notification={item} />
              ))}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-4">
                  <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const NotificationItem = ({ notification }: { notification: Notification }) => {
  const navigate = useNavigate();
  const notificationTypeConfig = getNotificationTypeConfig(notification.type);
  const Icon = notificationTypeConfig.icon;

  const data = parseNotificationData(notification);

  const handleClick = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.APPOINTMENT_CREATED:
        if (!data) return;
        navigate(paths.customer.bookingDetail.getHref(data.bookingId));
        break;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group border-muted relative flex cursor-pointer gap-3 border-b px-4 py-3.5 transition-colors last:border-b-0',
        'hover:bg-muted/50',
        notification.isUnread && 'bg-background',
      )}
    >
      {!notification.isRead && <div className="bg-primary absolute top-0 bottom-0 left-0 w-1" />}

      <div
        className={cn(
          'mt-0.5 shrink-0',
          'bg-background h-fit rounded-full p-2',
          notificationTypeConfig.color,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-sm leading-tight font-medium">{notification.title}</p>
          {!notification.isRead && (
            <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
          )}
        </div>

        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {notification.message}
        </p>

        <p className="text-muted-foreground text-xs font-medium">{notification.timeAgo}</p>
      </div>
    </div>
  );
};
