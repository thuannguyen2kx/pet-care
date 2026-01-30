import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { notificationKeys } from '@/features/notification/api/query-keys';
import { registerNotificationSocket } from '@/features/notification/socket/notification.socket';

export const useEmployeeNotificationSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return registerNotificationSocket({
      onNewNotification: () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.employee.list() });
        queryClient.invalidateQueries({ queryKey: notificationKeys.employee.count_unread() });

        toast.info('🔔 Bạn có thông báo mới');
      },
    });
  }, [queryClient]);
};
