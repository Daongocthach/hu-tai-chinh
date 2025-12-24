import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  LeaveRequestCard,
  LeaveRequestsFilter,
  PlusButton,
  RowComponent,
  SearchInput,
  TextComponent,
} from "@/components"
import { useFlatListScrollToTopOnToggle, useLeaveRequestsInfiniteQuery } from "@/hooks"
import { Leave } from "@/lib"

export default function LeaveRequests() {
  const router = useRouter()
  const { t } = useTranslation()

  const {
    total_items,
    leaveRequests,
    isOpenFilter,
    setIsOpenFilter,
    control,
    handleSubmit,
    handleReset,
    setFilters,
    refetch,
    isLoading,
    isRefetching,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    searchLeaveRequest,
    setSearchLeaveRequest,
  } = useLeaveRequestsInfiniteQuery()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("leave request")} (${total_items})`}
            type="title1"
          />

          <SearchInput
            placeholder={t("search leave request")}
            value={searchLeaveRequest}
            onChangeText={setSearchLeaveRequest}
          />

          <ButtonComponent
            onPress={() => setIsOpenFilter(!isOpenFilter)}
            iconProps={{ name: "ListFilter" }}
            buttonStyle={{
              padding: 8,
            }}
          />
        </RowComponent>
        <FlatListComponent
          ref={listRef}
          data={leaveRequests}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ColumnComponent
              gap={10}
              backgroundColor={'background'}
              style={{
                paddingBottom: 5
              }}
            >
              {isOpenFilter && (
                <LeaveRequestsFilter
                  control={control}
                  handleSubmit={handleSubmit}
                  onApply={(data) => {
                    setFilters(data)
                  }}
                  onReset={handleReset}
                />
              )}
            </ColumnComponent>
          }
          renderItem={({ item }: { item: Leave }) => <LeaveRequestCard {...item} />}
          contentContainerStyle={{ paddingBottom: 150 }}
          onRefresh={refetch}
          refreshing={isRefetching}
          loadMore={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          hasMore={hasNextPage}
        />
      </ColumnComponent>
      <PlusButton onPress={() => router.push('/(modals)/create-edit-leave-request')} style={{ zIndex: 1 }} />
    </Container>
  )
}
