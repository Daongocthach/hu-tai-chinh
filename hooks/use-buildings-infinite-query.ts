import buildingApi from "@/apis/building.api"
import { PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export const useBuildingsInfiniteQuery = ({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) => {

  const fetchData = async ({ pageParam = 1 }) => {
    const response = await buildingApi.getBuildings(pageParam, pageSize)
    return response.data
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.BUILDINGS],
    queryFn: fetchData,
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.pagination?.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const buildings = useMemo(
    () => query.data?.pages.flatMap(page => page.data) ?? [],
    [query.data]
  )

  const buildingOptions = useMemo(
    () =>
      buildings.map(building => ({
        label: building.name,
        value: building.id.toString(),
      })),
    [buildings]
  )

  return {
    ...query,
    buildings,
    buildingOptions,
  }
}
