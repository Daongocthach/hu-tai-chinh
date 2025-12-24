import { useTranslation } from "react-i18next"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  RowComponent,
  SearchInput,
  TextComponent
} from "@/components"
import UserCard from "@/components/users/user-card"
import UsersFilter from "@/components/users/users-filter"
import { useFlatListScrollToTopOnToggle, useUsersInfiniteQuery } from "@/hooks"
import { User } from "@/lib"

export default function Users() {
  const { t } = useTranslation()
  const {
    total_items,
    users,
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
    searchUser,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    setSearchUser,
  } = useUsersInfiniteQuery()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("user")} (${total_items})`}
            type="title1"
          />

          <SearchInput
            placeholder={t("search user")}
            value={searchUser}
            onChangeText={setSearchUser}
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
          data={users}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ColumnComponent gap={10} backgroundColor={'background'} style={{ paddingBottom: 5 }}>
              {isOpenFilter && (
                <UsersFilter
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
          renderItem={({ item }: { item: User }) => <UserCard {...item} />}
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
    </Container>
  )
}
