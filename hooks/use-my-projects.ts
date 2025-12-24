import projectApi from "@/apis/project.api"
import { useDebounce } from "@/hooks/use-debounce"
import { PAGE_SIZE, PROJECT_PRIORITIES, PROJECT_STATUS, ProjectsFilterValues, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

const DEFAULT_FILTER_VALUES: ProjectsFilterValues = {
  priority: [
    PROJECT_PRIORITIES.MEDIUM,
    PROJECT_PRIORITIES.HIGH,
    PROJECT_PRIORITIES.IMPORTANT,
  ],
  status: [
    PROJECT_STATUS.NOT_STARTED,
    PROJECT_STATUS.IN_PROGRESS,
  ],
  department: "",
  customer: "",
  user: "",
}

export function useMyProjects({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [searchProjectName, setSearchProjectName] = useState('')
  const [filters, setFilters] = useState<ProjectsFilterValues | null>(DEFAULT_FILTER_VALUES)

  const searchDebounced = useDebounce(searchProjectName)

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<ProjectsFilterValues>({
    mode: "onChange",
    defaultValues: DEFAULT_FILTER_VALUES,
  })

  const fetchData = async ({ pageParam = 1 }) => {
    const response = await projectApi.getProjects({
      page: pageParam,
      page_size: pageSize,
      q: searchDebounced,
      priority: filters?.priority,
      status: filters?.status,
      department: filters?.department,
      customer: filters?.customer,
      user: filters?.user,
    })
    return response.data
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.PROJECTS, searchDebounced, filters],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const projects = query.data?.pages.flatMap(page => page.data) ?? []
  const total_items = query.data?.pages[0]?.pagination?.total_items ?? 0

  const projectOptions = useMemo(
    () =>
      projects.map(project => ({
        label: project.name,
        value: project.id.toString(),
      })),
    [projects]
  )

  const handleReset = () => {
    reset()
    setFilters(DEFAULT_FILTER_VALUES)
  }

  return {
    isOpenFilter,
    setIsOpenFilter,
    searchProjectName,
    setSearchProjectName,

    filters,
    setFilters,

    control,
    handleSubmit,
    handleReset,
    watch,

    ...query,
    projects,
    projectOptions,
    total_items,
  }
}
