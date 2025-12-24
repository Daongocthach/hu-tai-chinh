import { ApiResponse, cleanParams, Meeting, MeetingRoom, PaginatedResponse } from "@/lib"
import axiosClient from "./axios-client"

const meetingApi = {
    generateQRCode(meetingId: number) {
        const url = `meetings/${meetingId}/generate_qr/`
        return axiosClient.post(url)
    },
    createMeeting(payload: {
        title: string
        meeting_date: string
        start_time: string
        end_time: string
        meeting_type: number
        meeting_room?: number
        invited: number[]
        meeting_link?: string
        conferencing?: 'google_meet' | 'zoom'
    }) {
        const url = 'meetings/'
        return axiosClient.post(url, payload)
    },
    editMeeting(id: number, payload: {
        title: string
        meeting_date: string
        start_time: string
        end_time: string
        meeting_type: number
        meeting_room?: number
        invited: number[]
        meeting_link?: string
        conferencing?: 'google_meet' | 'zoom'
    }) {
        const url = `meetings/${id}/`
        return axiosClient.put(url, payload)
    },
    deleteMeeting(id: number) {
        const url = `meetings/${id}/`
        return axiosClient.delete(url)
    },
    completedMeeting(id: number) {
        const url = `/meetings/${id}/completed/`
        return axiosClient.put(url)
    },
    getMeetings(payload: {
        page?: number,
        page_size?: number,
        meeting_type?: number,
        status?: number,
        date_start?: string,
        date_end?: string,
        q?: string,
    }) {
        const url = 'meetings/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<Meeting>>(url, { params })
    },
    getMeetingsOfMe(payload: {
        page?: number,
        page_size?: number,
        meeting_invited?: string,
        status?: number,
        meeting_date?: string,
        q?: string,
    }) {
        const url = 'meetings/me/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<Meeting[]>>(url, { params })
    },
    getMeeting(id: number) {
        const url = `meetings/${id}/`
        return axiosClient.get<ApiResponse<Meeting>>(url)
    },
    getCalendarsOfMeetingRoom(room_id: number, date_start?: string, date_end?: string) {
        const url = `meeting_rooms/${room_id}/calendar/`
        const params = cleanParams({ date_start, date_end })
        return axiosClient.get<ApiResponse<MeetingRoom>>(url, { params })
    },
    attendedMeeting(token: string) {
        const url = `meetings/attended/`
        return axiosClient.post(url, { token })
    },
    getCalendar(date_start: string, date_end: string) {
        const url = `meetings/me/calendar/`
        const params = cleanParams({ date_start, date_end })
        return axiosClient.get(url, { params })
    },
    confirmMeeting(id: number, status: number) {
        const url = `meetings/${id}/me/confirmed/`
        return axiosClient.put(url, { status })
    }
}

export default meetingApi