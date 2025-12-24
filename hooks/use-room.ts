import meetingApi from "@/apis/meeting.api"
import { MeetingRoom, QUERY_KEYS } from "@/lib"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

export function useRoom({ id, dateSelected }: { id: string, dateSelected?: Date }) {
    const formatDateSelected = dateSelected ? format(dateSelected, 'yyyy-MM-dd') : undefined

    const query = useQuery<MeetingRoom>({
        queryKey: [QUERY_KEYS.MEETINGS, id, dateSelected],
        queryFn: async () => {
            const response = await meetingApi.getCalendarsOfMeetingRoom(
                Number(id),
                formatDateSelected,
                formatDateSelected
            )
            const data = response.data.data
            return data
        },
        enabled: !!id,
    })

    return {
        ...query,
        room: query.data,
        meetings: query.data?.calendar?.[0]?.meetings || [],
    }
}
