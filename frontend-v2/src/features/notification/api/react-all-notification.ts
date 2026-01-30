import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { notificationKeys } from '@/features/notification/api/query-keys';
import { NOTIFICATION_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const markAllAsRead = () => {
  return http.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
};

type UseMarkAllAsReadOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, void, unknown>;
};
export const useMarkAllAsRead = ({ mutationConfig }: UseMarkAllAsReadOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess(data, ...args) {
      queryClient.setQueriesData({ queryKey: notificationKeys.customer.count_unread() }, () => ({
        count: 0,
      }));
      queryClient.setQueriesData(
        { queryKey: notificationKeys.customer.list() },
        (old: InfiniteData<{ notifications: Notification[] }>) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              notifications: page.notifications.map((n) => ({
                ...n,
                isRead: true,
                readAt: new Date(),
              })),
            })),
          };
        },
      );
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: markAllAsRead,
  });
};

export const useAdminMarkAllAsRead = ({ mutationConfig }: UseMarkAllAsReadOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess(data, ...args) {
      queryClient.setQueriesData({ queryKey: notificationKeys.admin.count_unread() }, () => ({
        count: 0,
      }));
      queryClient.setQueriesData(
        { queryKey: notificationKeys.admin.list() },
        (old: InfiniteData<{ notifications: Notification[] }>) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              notifications: page.notifications.map((n) => ({
                ...n,
                isRead: true,
                readAt: new Date(),
              })),
            })),
          };
        },
      );
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: markAllAsRead,
  });
};

export const useEmployeeMarkAllAsRead = ({ mutationConfig }: UseMarkAllAsReadOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess(data, ...args) {
      queryClient.setQueriesData({ queryKey: notificationKeys.employee.count_unread() }, () => ({
        count: 0,
      }));
      queryClient.setQueriesData(
        { queryKey: notificationKeys.employee.list() },
        (old: InfiniteData<{ notifications: Notification[] }>) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              notifications: page.notifications.map((n) => ({
                ...n,
                isRead: true,
                readAt: new Date(),
              })),
            })),
          };
        },
      );
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: markAllAsRead,
  });
};
