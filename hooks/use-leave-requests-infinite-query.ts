import leaveRequestApi from "@/apis/leave-request.api"
import { useDebounce } from "@/hooks/use-debounce"
import { LeaveRequestsFilterValues, PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"


export function useLeaveRequestsInfiniteQuery({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [searchLeaveRequest, setSearchLeaveRequest] = useState('')
    const [filters, setFilters] = useState<LeaveRequestsFilterValues>()

    const searchDebounced = useDebounce(searchLeaveRequest)

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<LeaveRequestsFilterValues>({
        defaultValues: {
            duration_type: undefined,
            leave_type: undefined,
            quick_time_range: undefined,
            status: undefined,
            user: undefined,
            leave_date_range_before: undefined,
            leave_date_range_after: undefined,
        },
    })

    const fetchData = async ({ pageParam = 1 }) => {
        const response = await leaveRequestApi.getLeaveRequests({
            page: pageParam,
            page_size: pageSize,
            duration_type: filters?.duration_type,
            leave_type: filters?.leave_type,
            this_week: filters?.quick_time_range === 'week' ? true : undefined,
            this_month: filters?.quick_time_range === 'month' ? true : undefined,
            next_month: filters?.quick_time_range === 'next_month' ? true : undefined,
            q: searchDebounced,
            status: filters?.status,
            ordering: '-created',
            user: filters?.user,
            leave_date_range_before: filters?.leave_date_range_before ?
                format(filters.leave_date_range_before, 'yyyy-MM-dd') : undefined,
            leave_date_range_after: filters?.leave_date_range_after ?
                format(filters.leave_date_range_after, 'yyyy-MM-dd') : undefined,
        })

        return response.data
    }


    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.LEAVE_REQUESTS, searchDebounced, filters],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
    })

    const leaveRequests = useMemo(
        () => query.data?.pages.flatMap(page => page.data) ?? [],
        [query.data]
    )
    const total_items = query.data?.pages[0]?.pagination?.total_items ?? 0

    const handleReset = () => {
        reset()
        setFilters(undefined)
    }

    return {
        isOpenFilter,
        setIsOpenFilter,
        searchLeaveRequest,
        setSearchLeaveRequest,

        filters,
        setFilters,

        control,
        handleSubmit,
        handleReset,
        watch,

        ...query,
        leaveRequests,
        total_items,
    }
}
