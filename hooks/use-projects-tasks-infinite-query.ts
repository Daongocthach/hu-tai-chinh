import projectApi from "@/apis/project.api"
import { useDebounce } from "@/hooks/use-debounce"
import { PAGE_SIZE, ProjectsTasksFilterValues, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"


export function useProjectsTasksInfiniteQuery({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [searchProject, setSearchProject] = useState('')
    const [filters, setFilters] = useState<ProjectsTasksFilterValues>()

    const searchDebounced = useDebounce(searchProject)

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<ProjectsTasksFilterValues>()

    const fetchData = async ({ pageParam = 1 }) => {
        const response = await projectApi.getProjectsTasks({
            page: pageParam,
            page_size: pageSize,
            q: searchDebounced,
            project_id: filters?.project_id,
            status: filters?.status,
        })

        return response.data
    }


    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.PROJECTS_TASKS, searchDebounced, filters],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
    })

    const projectsTasks = useMemo(
        () => query.data?.pages.flatMap(page => page.data) ?? [],
        [query.data]
    )

    const projectsTasksOptions = useMemo(
        () =>
            projectsTasks.map(task => ({
                label: task.name,
                value: task.id.toString(),
            })),
        [projectsTasks]
    )

    const total_items = query.data?.pages?.[0]?.pagination?.total_items || 0

    return {
        isOpenFilter,
        setIsOpenFilter,
        searchProject,
        setSearchProject,

        filters,
        setFilters,

        control,
        handleSubmit,
        reset,
        watch,

        ...query,
        projectsTasks,
        projectsTasksOptions,
        total_items,
    }
}
