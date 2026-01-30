import { useNotifications } from '@/features/notification/api/get-notification';

export const useNotificationListController = () => {
  const notificationsQuery = useNotifications();

  const notifications = notificationsQuery.data?.pages.flatMap((page) => page.notifications) ?? [];
  return {
    data: notifications,
    isFetching: notificationsQuery.isLoading,
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,

    fetchNextPage: notificationsQuery.fetchNextPage,
    hasNextPage: notificationsQuery.hasNextPage,
  };
};
