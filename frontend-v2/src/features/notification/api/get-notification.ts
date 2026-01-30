import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { notificationKeys } from '@/features/notification/api/query-keys';
import { NotificationsResponseSchema } from '@/features/notification/domain/notification-http-schema';
import { mapNotificationsDtoToEntity } from '@/features/notification/domain/notification.transform';
import { NOTIFICATION_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getNotifications = (config: AxiosRequestConfig) => {
  return http.get(NOTIFICATION_ENDPOINTS.LIST, config);
};

export const getNotificationsQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: notificationKeys.customer.list(),

    queryFn: async ({ signal, pageParam }) => {
      const config = {
        signal,
        params: pageParam ? { cursor: pageParam } : {},
      };

      const raw = await getNotifications(config);
      const response = NotificationsResponseSchema.parse(raw);
      return {
        notifications: mapNotificationsDtoToEntity(response.items),
        meta: response.meta,
      };
    },
    initialPageParam: '',

    getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined),
  });
};

type UseNotificationOptions = {
  queryConfig?: QueryConfig<typeof getNotificationsQueryOptions>;
};

export const useNotifications = ({ queryConfig }: UseNotificationOptions = {}) => {
  return useInfiniteQuery({
    ...getNotificationsQueryOptions(),
    ...queryConfig,
  });
};

export const getAdminNotificationsQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: notificationKeys.admin.list(),

    queryFn: async ({ signal, pageParam }) => {
      const config = {
        signal,
        params: pageParam ? { cursor: pageParam } : {},
      };

      const raw = await getNotifications(config);
      const response = NotificationsResponseSchema.parse(raw);
      return {
        notifications: mapNotificationsDtoToEntity(response.items),
        meta: response.meta,
      };
    },
    initialPageParam: '',

    getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined),
  });
};
type UseAdminNotificationsOptions = {
  queryConfig?: QueryConfig<typeof getAdminNotificationsQueryOptions>;
};

export const useAdminNotifications = ({ queryConfig }: UseAdminNotificationsOptions = {}) => {
  return useInfiniteQuery({
    ...getAdminNotificationsQueryOptions(),
    ...queryConfig,
  });
};

export const getEmployeeNotificationsQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: notificationKeys.employee.list(),

    queryFn: async ({ signal, pageParam }) => {
      const config = {
        signal,
        params: pageParam ? { cursor: pageParam } : {},
      };

      const raw = await getNotifications(config);
      const response = NotificationsResponseSchema.parse(raw);
      return {
        notifications: mapNotificationsDtoToEntity(response.items),
        meta: response.meta,
      };
    },
    initialPageParam: '',

    getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined),
  });
};
type UseEmployeeNotificationsOptions = {
  queryConfig?: QueryConfig<typeof getEmployeeNotificationsQueryOptions>;
};

export const useEmployeeNotifications = ({ queryConfig }: UseEmployeeNotificationsOptions = {}) => {
  return useInfiniteQuery({
    ...getEmployeeNotificationsQueryOptions(),
    ...queryConfig,
  });
};
