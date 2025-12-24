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
import MeetingRoomsFilter from "@/components/meetings/meeting-rooms-filter"
import RoomCard from "@/components/meetings/room-card"

import { useFlatListScrollToTopOnToggle, useMeetingRooms } from "@/hooks"
import { ROLES } from "@/lib"
import useStore from "@/store"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"

export default function Rooms() {
  const { userData } = useStore()
  const router = useRouter()
  const { t } = useTranslation()
  const {
    total_items,
    meetingRooms,
    isOpenFilter,
    setIsOpenFilter,
    control,
    handleSubmit,
    setFilters,
    refetch,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchRoomName,
    setSearchRoomName,
    handleReset,
  } = useMeetingRooms()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("rooms")} (${total_items})`}
            type="title1"
          />

          <SearchInput
            placeholder={t("search room")}
            value={searchRoomName}
            onChangeText={setSearchRoomName}
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
          data={meetingRooms}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ColumnComponent gap={10} backgroundColor={'background'} style={{ paddingBottom: 5 }}>
              {isOpenFilter && (
                <MeetingRoomsFilter
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
          renderItem={({ item }) => <RoomCard {...item} />}
          onRefresh={refetch}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          refreshing={isFetching}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          hasBottomTabBar
          extraPaddingBottom={30}
        />
      </ColumnComponent>
      {userData?.role === ROLES.ADMIN && <PlusButton hasBottomTabBar onPress={() => router.push('/create-edit-room')} />}
    </Container>
  )
}
