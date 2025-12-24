import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import FlatListComponent from '@/components/common/flat-list-component'

import { showAlert, showToast } from '@/alerts'
import notificationApi from '@/apis/notification.api'
import ButtonComponent from '@/components/common/button-component'
import { NotificationProps, PAGE_SIZE, QUERY_KEYS } from '@/lib'
import Notification from './notification'


export default function UnreadNotifications() {
  const queryClient = useQueryClient()

  const { mutate: markAllAsRead, isPending } = useMutation({
    mutationFn: () => {
      return notificationApi.markAllAsRead()
    },
    onSuccess: () => {
      showToast('update_success')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IMPORTANT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_COUNT] })
    },
  })

  const fetchData = async ({ pageParam = 1 }) => {
    const response = await notificationApi.getNotifications({
      page: pageParam,
      page_size: PAGE_SIZE,
      is_read: false
    })

    return response.data
  }

  const { data, refetch, isFetching, hasNextPage, fetchNextPage, isError, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.UNREAD],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const notifications = data?.pages.flatMap(page => page.data) ?? []
  const total_items = data?.pages[0].pagination.total_items ?? 0

  return (
    <FlatListComponent
      data={notifications}
      keyExtractor={(item: NotificationProps) => item.id.toString()}
      ListHeaderComponent={
        total_items > 0 ?
          <ButtonComponent
            textProps={{ text: 'mark all as read' }}
            onPress={() => showAlert('mark_all_as_read', () => markAllAsRead())}
            loading={isPending}
          />
          : null
      }
      renderItem={({ item }) => (
        <Notification {...item} />
      )}
      onRefresh={refetch}
      loadMore={hasNextPage ? fetchNextPage : undefined}
      refreshing={isFetching}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      isError={isError}
      contentContainerStyle={{ 
        gap: 25,
      }}
    />
  )
}