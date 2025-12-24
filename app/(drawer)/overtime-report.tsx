import { useTranslation } from "react-i18next"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  OvertimeReportCard,
  OvertimeReportsFilter,
  RowComponent,
  SearchInput,
  TextComponent
} from "@/components"
import { useFlatListScrollToTopOnToggle, useOvertimeReportsInfiniteQuery } from "@/hooks"
import { OverTime } from "@/lib"

export default function OvertimeReport() {
  const { t } = useTranslation()
  const {
    total_items,
    overtimeReports,
    isOpenFilter,
    setIsOpenFilter,
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
    searchOvertimeReport,
    setSearchOvertimeReport,
  } = useOvertimeReportsInfiniteQuery()

  const listRef = useFlatListScrollToTopOnToggle(isOpenFilter)

  return (
    <Container>
      <ColumnComponent gap={10}>
        <RowComponent gap={10}>
          <TextComponent
            text={`${t("overtime report")} (${total_items || 0})`}
            type="title1"
          />

          <SearchInput
            placeholder={t("search overtime report")}
            value={searchOvertimeReport}
            onChangeText={setSearchOvertimeReport}
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
          data={overtimeReports}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ColumnComponent gap={10} backgroundColor={'background'} style={{ paddingBottom: 5 }}>
              {isOpenFilter && (
                <OvertimeReportsFilter
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
          renderItem={({ item }: { item: OverTime }) => <OvertimeReportCard {...item} />}
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
