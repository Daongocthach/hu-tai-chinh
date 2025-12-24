import projectApi from "@/apis/project.api"
import { QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export function useProjectsInfiniteQuery({ pageSize = 20 }: { pageSize?: number } = {}) {
  
  const fetchData = async ({ pageParam = 1 }) => {
    const response = await projectApi.getProjects({
      page: pageParam,
      page_size: pageSize,
      q: '',
    })
    return response.data
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const projects = useMemo(
    () => query.data?.pages.flatMap(page => page.data) ?? [],
    [query.data]
  )

  const projectOptions = useMemo(
    () =>
      projects.map(project => ({
        label: project.name,
        value: project.id.toString(),
      })),
    [projects]
  )

  return {
    ...query,
    projects,
    projectOptions,
  }
}
