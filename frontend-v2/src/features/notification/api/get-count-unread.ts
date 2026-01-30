import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { notificationKeys } from '@/features/notification/api/query-keys';
import { NotificationUnReadCountResponseSchema } from '@/features/notification/domain/notification-http-schema';
import { NOTIFICATION_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getUnreadCount = (config: AxiosRequestConfig) => {
  return http.get(NOTIFICATION_ENDPOINTS.UNREAD_COUNT, config);
};

export const getCountUnreadQueryOptions = () => {
  return queryOptions({
    queryKey: notificationKeys.customer.count_unread(),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getUnreadCount(config);
      const response = NotificationUnReadCountResponseSchema.parse(raw);
      return response.count;
    },
  });
};

type UseCountUnreadOptions = {
  queryConfig?: QueryConfig<typeof getCountUnreadQueryOptions>;
};

export const useCountUnread = ({ queryConfig }: UseCountUnreadOptions = {}) => {
  return useQuery({
    ...getCountUnreadQueryOptions(),
    ...queryConfig,
  });
};

export const getAdminCountUnreadQueryOptions = () => {
  return queryOptions({
    queryKey: notificationKeys.admin.count_unread(),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getUnreadCount(config);
      const response = NotificationUnReadCountResponseSchema.parse(raw);
      return response.count;
    },
  });
};

type UseAdminCountUnreadOptions = {
  queryConfig?: QueryConfig<typeof getAdminCountUnreadQueryOptions>;
};

export const useAdminCountUnread = ({ queryConfig }: UseAdminCountUnreadOptions = {}) => {
  return useQuery({
    ...getAdminCountUnreadQueryOptions(),
    ...queryConfig,
  });
};

export const getEmployeeCountUnreadQueryOptions = () => {
  return queryOptions({
    queryKey: notificationKeys.employee.count_unread(),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getUnreadCount(config);
      const response = NotificationUnReadCountResponseSchema.parse(raw);
      return response.count;
    },
  });
};

type UseEmployeeCountUnreadOptions = {
  queryConfig?: QueryConfig<typeof getEmployeeCountUnreadQueryOptions>;
};

export const useEmployeeCountUnread = ({ queryConfig }: UseEmployeeCountUnreadOptions = {}) => {
  return useQuery({
    ...getEmployeeCountUnreadQueryOptions(),
    ...queryConfig,
  });
};
