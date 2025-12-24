import projectApi from "@/apis/project.api"
import { PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"

export function useProjectHistories({ project_id }: { project_id: number }) {
  const fetchData = async ({ pageParam = 1 }) => {
    const response = await projectApi.getProjectHistories(project_id, {
      page: pageParam,
      page_size: PAGE_SIZE,
    })
    return response.data
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.PROJECT_HISTORIES],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const histories = query.data?.pages.flatMap(page => page.data) ?? []

  return {
    ...query,
    histories,
  }
}
