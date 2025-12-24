import { showToast } from "@/alerts"
import meetingApi from "@/apis/meeting.api"
import { Meeting, QUERY_KEYS } from "@/lib"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"

export function useMeeting({ id }: { id: string }) {
    const queryClient = useQueryClient()
    const router = useRouter()

    const query = useQuery<Meeting>({
        queryKey: [QUERY_KEYS.MEETING, id],
        queryFn: () => meetingApi.getMeeting(Number(id)).then(response => {
            return response.data.data
        }),
        enabled: !!id,
    })

    const jointMeetingMutation = useMutation({
        mutationFn: async (token: string) => {
            if (!token) throw new Error('Token is required to attend meeting')
            return meetingApi.attendedMeeting(token)
        },
        onSuccess: () => {
            showToast('join_meeting_success')
            query.refetch()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETINGS] })
        }
    })

    const completeMutation = useMutation({
        mutationFn: async () => meetingApi.completedMeeting(Number(id)),
        onSuccess: () => {
            showToast('complete_meeting_success')
            query.refetch()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETINGS] })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async () => meetingApi.deleteMeeting(Number(id)),
        onSuccess: () => {
            showToast('delete_success')
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETINGS] })
            router.back()
        }
    })

    return {
        ...query,
        jointMeetingMutation,
        completeMutation,
        deleteMutation,
        meeting: query.data,
    }
}