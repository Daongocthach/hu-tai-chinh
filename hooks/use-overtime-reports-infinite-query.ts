import overtimeReportApi from "@/apis/overtime-report.api"
import { useDebounce } from "@/hooks/use-debounce"
import { OvertimeReportsFilterValues, PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"


export function useOvertimeReportsInfiniteQuery({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [searchOvertimeReport, setSearchOvertimeReport] = useState('')
    const [filters, setFilters] = useState<OvertimeReportsFilterValues>()

    const searchDebounced = useDebounce(searchOvertimeReport)

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<OvertimeReportsFilterValues>()

    const fetchData = async ({ pageParam = 1 }) => {
        const response = await overtimeReportApi.getOvertimeReports({
            q: searchDebounced,
            page: pageParam,
            page_size: pageSize,
            this_week: filters?.quick_time_range === 'week' ? true : undefined,
            this_month: filters?.quick_time_range === 'month' ? true : undefined,
            last_30_days: filters?.quick_time_range === 'last_30_days' ? true : undefined,
            user: filters?.user,
            status: filters?.status,
            overtime_type: filters?.overtime_type,
            project_id: filters?.project,
            ordering: '-created',
            work_date_range_before: filters?.work_date_range_before ?
                format(filters.work_date_range_before, 'yyyy-MM-dd') : undefined,
            work_date_range_after: filters?.work_date_range_after ?
                format(filters.work_date_range_after, 'yyyy-MM-dd') : undefined,
        })

        return response.data
    }


    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.OVERTIME_REPORTS, searchDebounced, filters],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
    })

    const overtimeReports = useMemo(
        () => query.data?.pages.flatMap(page => page.data) ?? [],
        [query.data]
    )
    const total_items = query.data?.pages[0].pagination.total_items ?? 0

    return {
        isOpenFilter,
        setIsOpenFilter,
        searchOvertimeReport,
        setSearchOvertimeReport,

        filters,
        setFilters,

        control,
        handleSubmit,
        reset,
        watch,

        ...query,
        total_items,
        overtimeReports,
    }
}
