import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  ProjectCard,
  ProjectDetail,
  ProjectsFilter,
  RowComponent,
  SearchInput,
  TextComponent
} from "@/components"

import { useFlatListScrollToTopOnToggle, useMyProjects } from "@/hooks"
import { useTranslation } from "react-i18next"
import { KeyboardAvoidingView } from "react-native"

export default function MyProjects() {
  const { t } = useTranslation()
  const {
    total_items,
    projects,
    isOpenFilter,
    setIsOpenFilter,
    control,
    handleSubmit,
    setFilters,
    handleReset,
    refetch,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    isError,
    searchProjectName,
    setSearchProjectName,
  } = useMyProjects()
  
  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <ColumnComponent gap={10}>
          <RowComponent gap={10}>
            <TextComponent
              text={`${t("my projects")} (${total_items})`}
              type="title1"
            />

            <SearchInput
              placeholder={t("search project")}
              value={searchProjectName}
              onChangeText={setSearchProjectName}
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
            data={projects}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
              <ColumnComponent gap={10} backgroundColor={'background'} style={{ paddingBottom: 5 }}>
                {isOpenFilter && (
                  <ProjectsFilter
                    control={control}
                    handleSubmit={handleSubmit}
                    onApply={(data) => {
                      setFilters(data)
                    }}
                    onReset={handleReset}
                  />
                )}
                <TextComponent type="caption" fontWeight="semibold" text="my recently project" />
                <ProjectDetail project={projects?.[0]} isRecent />
              </ColumnComponent>
            }
            renderItem={({ item }) => <ProjectCard {...item} />}
            onRefresh={refetch}
            refreshing={isRefetching}
            loadMore={fetchNextPage}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            isError={isError}
            hasMore={hasNextPage}
          />
        </ColumnComponent>
      </KeyboardAvoidingView>
    </Container>
  )
}
