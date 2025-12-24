import roomApi from "@/apis/room.api"
import { useDebounce } from "@/hooks/use-debounce"
import { MeetingRoomsFilterValues, PAGE_SIZE, QUERY_KEYS, ROOM_STATUS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"


export function useMeetingRooms({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [searchRoomName, setSearchRoomName] = useState('')
    const [filters, setFilters] = useState<MeetingRoomsFilterValues>()

    const searchDebounced = useDebounce(searchRoomName)

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<MeetingRoomsFilterValues>({
        defaultValues: {
            max_capacity: "",
            date_selected: undefined,
            facilities: [],
            start_time: undefined,
            end_time: undefined,
        },
    })

    const fetchData = async ({ pageParam = 1 }) => {
        const response = await roomApi.getRooms({
            page: pageParam,
            page_size: pageSize,
            q: searchDebounced,
            customer: undefined,
            meeting_date: filters?.date_selected ? format(filters.date_selected, 'yyyy-MM-dd') : undefined,
            start_time: filters?.start_time ? format(filters.start_time, 'HH:mm:ss') : undefined,
            end_time: filters?.end_time ? format(filters.end_time, 'HH:mm:ss') : undefined,
            min_capacity: undefined,
            max_capacity: filters?.max_capacity,
            status: ROOM_STATUS.AVAILABLE,
            wifi: filters?.facilities?.includes('wifi') || undefined,
            projector: filters?.facilities?.includes('projector') || undefined,
            television: filters?.facilities?.includes('television') || undefined,
            whiteboard: filters?.facilities?.includes('whiteboard') || undefined
       } )

        return response.data
    }


    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.MEETING_ROOMS, searchDebounced, filters],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
    })

    const meetingRooms = useMemo(
        () => query.data?.pages.flatMap(page => page.data) ?? [],
        [query.data]
    )
    const total_items = useMemo(
        () => query.data?.pages[0]?.pagination?.total_items ?? 0,
        [query.data]
    )

    const meetingRoomOptions = useMemo(
        () =>
            meetingRooms.map(room => ({
                label: room.name,
                value: room.id.toString(),
            })),
        [meetingRooms]
    )

    const handleReset = useCallback(() => {
        reset()
        setFilters(undefined)
    }, [reset])

    return {
        isOpenFilter,
        setIsOpenFilter,
        searchRoomName,
        setSearchRoomName,

        filters,
        setFilters,

        control,
        handleSubmit,
        handleReset,
        watch,

        ...query,
        meetingRooms,
        total_items,
        meetingRoomOptions,
    }
}
