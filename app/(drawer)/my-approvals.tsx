import { useTranslation } from "react-i18next"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  MyApprovalCard,
  ProjectsTasksFilter,
  RowComponent,
  SearchInput,
  TextComponent
} from "@/components"
import { useFlatListScrollToTopOnToggle, useMyApprovals } from "@/hooks"
import { ProjectTask } from "@/lib"

export default function MyApprovals() {
  const { t } = useTranslation()
  const {
    total_items,
    searchProject,
    setSearchProject,
    isOpenFilter,
    myApprovals,
    control,
    handleSubmit,
    reset,
    setFilters,
    refetch,
    isRefetching,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    setIsOpenFilter,
  } = useMyApprovals()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("my approvals")} (${total_items || 0})`}
            type="title1"
          />

          <SearchInput
            placeholder={t("search project")}
            value={searchProject}
            onChangeText={setSearchProject}
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
          data={myApprovals}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ColumnComponent gap={10} backgroundColor={'background'} style={{ paddingBottom: 5 }}>
              {isOpenFilter && (
                <ProjectsTasksFilter
                  control={control}
                  handleSubmit={handleSubmit}
                  onApply={(data) => {
                    setFilters(data)
                  }}
                  onReset={() => {
                    reset()
                    setFilters(undefined)
                  }}
                />
              )}
            </ColumnComponent>
          }
          renderItem={({ item }: { item: ProjectTask }) => <MyApprovalCard {...item} />}
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
