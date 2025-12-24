import meetingApi from "@/apis/meeting.api"
import { useDebounce } from "@/hooks/use-debounce"
import {
    MEETING_TYPE,
    MEETINGS_ONLINE_DEFAULT_FILTER_VALUES,
    MeetingsOnlineFilterValues,
    PAGE_SIZE,
    QUERY_KEYS,
} from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"


export function useMeetingsOnline({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [searchMeetingName, setSearchMeetingName] = useState('')
    const [filters, setFilters] = useState<MeetingsOnlineFilterValues>(MEETINGS_ONLINE_DEFAULT_FILTER_VALUES)

    const searchDebounced = useDebounce(searchMeetingName)

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<MeetingsOnlineFilterValues>({
        defaultValues: MEETINGS_ONLINE_DEFAULT_FILTER_VALUES,
    })

    const fetchData = async ({ pageParam = 1 }) => {
        const response = await meetingApi.getMeetings({
            page: pageParam,
            page_size: pageSize,
            meeting_type: MEETING_TYPE.MEETING_ONLINE,
            status: filters?.status,
            date_start: filters?.date_start ? format(filters.date_start, 'HH:mm:ss') : undefined,
            date_end: filters?.date_end ? format(filters.date_end, 'HH:mm:ss') : undefined,
            q: searchDebounced,
        })
        return response.data
    }


    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.MEETINGS_ONLINE, searchDebounced, filters],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
    })

    const meetingsOnline = query.data?.pages.flatMap(page => page.data) ?? []
    const total_items = query.data?.pages[0].pagination.total_items ?? 0

    return {
        isOpenFilter,
        setIsOpenFilter,
        searchMeetingName,
        setSearchMeetingName,

        filters,
        setFilters,

        control,
        handleSubmit,
        reset,
        watch,

        ...query,
        total_items,    
        meetingsOnline,
    }
}
