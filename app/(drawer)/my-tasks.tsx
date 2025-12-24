import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  ProjectsTasksFilter,
  ProjectTasksCard,
  RowComponent,
  SearchInput,
  TextComponent
} from "@/components"
import { useFlatListScrollToTopOnToggle, useProjectsTasksInfiniteQuery } from "@/hooks"
import { ProjectTasksCardProps } from "@/lib"

export default function MyTasks() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const {
    total_items,
    searchProject,
    setSearchProject,
    isOpenFilter,
    projectsTasks,
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
  } = useProjectsTasksInfiniteQuery()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("my tasks")} (${total_items || 0})`}
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
          data={projectsTasks}
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
          renderItem={({ item }: { item: ProjectTasksCardProps }) => <ProjectTasksCard {...item} />}
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
