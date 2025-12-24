import projectApi from "@/apis/project.api"
import { useDebounce } from "@/hooks/use-debounce"
import { MyApprovalsFilterValues, PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"


export function useMyApprovals() {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [searchProject, setSearchProject] = useState('')
    const [filters, setFilters] = useState<MyApprovalsFilterValues>()

    const searchDebounced = useDebounce(searchProject)

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<MyApprovalsFilterValues>()

    const fetchData = async ({ pageParam = 1 }) => {
        const response = await projectApi.getMyApprovals({
            page: pageParam,
            page_size: PAGE_SIZE,
            q: searchDebounced,
            project_id: filters?.project_id,
            status: filters?.status,
        })

        return response.data
    }


    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.MY_APPROVALS, searchDebounced, filters],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
    })

    const myApprovals = useMemo(
        () => query.data?.pages.flatMap(page => page.data) ?? [],
        [query.data]
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
        myApprovals,
        total_items,
    }
}
