import meetingApi from "@/apis/meeting.api"
import { useDebounce } from "@/hooks/use-debounce"
import { ListAttendFilterValues, MEETING_INVITED_STATUS, MEETING_STATUS, PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"


const DEFAULT_FILTER_VALUES: ListAttendFilterValues = {
    status: MEETING_STATUS.UPCOMING,
    progress: [MEETING_INVITED_STATUS.UNCONFIRMED],
}

export function useListAttend({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [searchMeetingName, setSearchMeetingName] = useState('')
    const [dateSelected, setDateSelected] = useState<Date | undefined>(undefined)
    const [filters, setFilters] = useState<ListAttendFilterValues | null>(DEFAULT_FILTER_VALUES)

    const searchDebounced = useDebounce(searchMeetingName)

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<ListAttendFilterValues>({
        defaultValues: DEFAULT_FILTER_VALUES,
    })

    const fetchData = async ({ pageParam = 1 }) => {
        const response = await meetingApi.getMeetingsOfMe(
            {
                page: pageParam,
                page_size: pageSize,
                q: searchDebounced || undefined,
                status: filters?.status ? Number(filters.status) : undefined,
                meeting_invited: filters?.progress?.length ? filters.progress.join(',') : undefined,
                meeting_date: dateSelected ? format(dateSelected, 'yyyy-MM-dd') : undefined,
            }
        )
        return response.data
    }

    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.LIST_ATTEND, searchDebounced, dateSelected, filters],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
    })

    const meetings = query.data?.pages.flatMap(page => page.data) ?? []
    const total_items = query.data?.pages?.[0]?.pagination?.total_items ?? 0

    return {
        isOpenFilter,
        setIsOpenFilter,
        searchMeetingName,
        setSearchMeetingName,
        dateSelected,
        setDateSelected,

        filters,
        setFilters,

        control,
        handleSubmit,
        reset,
        watch,

        ...query,
        meetings,
        total_items,
    }
}
