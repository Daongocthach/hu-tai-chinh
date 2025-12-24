import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  RowComponent,
  SearchInput,
  TextComponent
} from "@/components"
import PlusButton from "@/components/common/plus-button"
import MeetingCard from "@/components/meetings/meeting-card"
import MeetingsOnlineFilter from "@/components/meetings/meetings-online-filter"

import { useFlatListScrollToTopOnToggle, useMeetingsOnline } from "@/hooks"
import { MEETINGS_ONLINE_DEFAULT_FILTER_VALUES } from "@/lib"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"

export default function MeetingsOnline() {
  const router = useRouter()
  const { t } = useTranslation()
  const {
    meetingsOnline,
    total_items,
    setSearchMeetingName,
    searchMeetingName,
    setIsOpenFilter,
    isOpenFilter,
    control,
    handleSubmit,
    reset,
    setFilters,
    refetch,
    isLoading,
    isRefetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMeetingsOnline()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("meetings online")} (${total_items || 0})`}
            type="title1"
          />

          <SearchInput
            placeholder="search meeting"
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

        <FlatListComponent
          ref={listRef}
          data={meetingsOnline}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ColumnComponent gap={10}>
              {isOpenFilter && (
                <MeetingsOnlineFilter
                  control={control}
                  handleSubmit={handleSubmit}
                  onApply={(data) => {
                    setFilters(data)
                  }}
                  onReset={() => {
                    reset()
                    setFilters(MEETINGS_ONLINE_DEFAULT_FILTER_VALUES)
                  }}
                />
              )}
            </ColumnComponent>
          }
          renderItem={({ item }) => <MeetingCard {...item} />}
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
      <PlusButton hasBottomTabBar onPress={() => router.push('/create-edit-meeting-online')} />
    </Container>
  )
}
