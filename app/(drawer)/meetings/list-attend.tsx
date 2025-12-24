import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  DateSelector,
  FlatListComponent,
  MeetingCard,
  RowComponent,
  SearchInput,
  TextComponent
} from '@/components'
import PlusButton from '@/components/common/plus-button'
import ListAttendFilter from '@/components/meetings/list-attend-filter'
import { useFlatListScrollToTopOnToggle, useListAttend } from '@/hooks'

export default function ListAttend() {
  const router = useRouter()
  const { t } = useTranslation()
  const {
    total_items,
    searchMeetingName,
    setSearchMeetingName,
    isOpenFilter,
    meetings,
    control,
    handleSubmit,
    reset,
    setFilters,
    refetch,
    isRefetching,
    isLoading,
    isError,
    setIsOpenFilter,
    dateSelected,
    setDateSelected,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useListAttend()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("meetings")} (${total_items})`}
            type="title1"
          />

          <SearchInput
            placeholder={t("search room")}
            value={searchMeetingName}
            onChangeText={setSearchMeetingName}
          />

          <ButtonComponent
            onPress={() => setIsOpenFilter(!isOpenFilter)}
            iconProps={{ name: "ListFilter" }}
            buttonStyle={{
              padding: 8,
            }}
          />
        </RowComponent>
        <DateSelector
          dateSelected={dateSelected || new Date()}
          setDateSelected={setDateSelected}
        />
        <FlatListComponent
          ref={listRef}
          data={meetings}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ColumnComponent gap={10} backgroundColor={'background'} style={{ paddingBottom: 5 }}>
              {isOpenFilter && (
                <ListAttendFilter
                  control={control}
                  handleSubmit={handleSubmit}
                  onApply={(data) => {
                    setFilters(data)
                  }}
                  onReset={() => {
                    reset()
                    setFilters(null)
                  }}
                />
              )}
            </ColumnComponent>
          }
          renderItem={({ item }) => <MeetingCard {...item} />}
          hasBottomTabBar
          extraPaddingBottom={50}
          onRefresh={refetch}
          refreshing={isRefetching}
          loadMore={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          hasMore={hasNextPage}
        />
      </ColumnComponent>
      <PlusButton hasBottomTabBar onPress={() => router.push('/create-edit-meeting')} />
    </Container>
  )
}
