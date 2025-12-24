import { useInfiniteQuery } from '@tanstack/react-query'

import FlatListComponent from '@/components/common/flat-list-component'
import Notification from './notification'

import notificationApi from '@/apis/notification.api'
import { NOTIFICATION_TYPE, PAGE_SIZE, QUERY_KEYS } from '@/lib'


export default function ImportantNotifications() {
  const fetchData = async ({ pageParam = 1 }) => {
    const response = await notificationApi.getNotifications({
      page: pageParam,
      page_size: PAGE_SIZE,
      type: NOTIFICATION_TYPE.IMPORTANT
    })

    return response.data
  }

  const { data, refetch, isFetching, hasNextPage, fetchNextPage, isError, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.IMPORTANT],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const notifications = data?.pages.flatMap(page => page.data) ?? []

  return (
    <FlatListComponent
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
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
        paddingVertical: 20,
      }}
    />
  )
}