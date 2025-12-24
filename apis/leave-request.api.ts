import { ApiResponse, cleanParams, FileProps, Leave, PaginatedResponse } from "@/lib"
import axiosClient from "./axios-client"

const leaveRequestApi = {
    getLeaveRequests(payload: {
        page?: number
        page_size?: number
        duration_type?: string
        status?: number
        this_week?: boolean
        this_month?: boolean
        next_month?: boolean
        q?: string
        leave_type?: number
        ordering?: string
        user?: number
        leave_date_range_after?: string
        leave_date_range_before?: string
    }) {
        const url = 'leave_requests/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<Leave>>(url, { params })
    },
    getLeaveRequestDetails(id: number) {
        const url = `leave_requests/${id}/`
        return axiosClient.get<ApiResponse<Leave>>(url)
    },
    deleteLeaveRequest(id: number) {
        const url = `leave_requests/${id}/`
        return axiosClient.delete(url)
    },
    approveLeaveRequest(id: number) {
        const url = `leave_requests/${id}/approve/`
        return axiosClient.post(url)
    },
    determineLeaveRequest(
        id: number,
        payload: {
            determination: number,
            rejection_reason?: string
        }
    ) {
        const url = `/leave_requests/${id}/confirm/`
        const payloadData = cleanParams(payload)
        return axiosClient.post(url, payloadData)
    },
    createLeaveRequest(payload: {
        leave_type: number
        leave_date: string
        start_time: string
        end_time: string
        leave_hours: number
        reason: string
        evidence_image?: FileProps
    }) {
        const url = 'leave_requests/'
        const formData = new FormData()
        formData.append("leave_date", payload.leave_date)
        formData.append("start_time", payload.start_time)
        formData.append("end_time", payload.end_time)
        formData.append("leave_hours", payload.leave_hours.toString())
        formData.append("reason", payload.reason)
        formData.append("leave_type", payload.leave_type.toString())
        if (payload.evidence_image) {
            formData.append('evidence_image', {
                uri: payload.evidence_image.uri,
                name: payload.evidence_image.name,
                type: payload.evidence_image.type,
            } as any)
        }
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    editLeaveRequest(
        id: number,
        payload: {
            leave_type: number
            leave_date: string
            start_time: string
            end_time: string
            leave_hours: number
            reason: string
            evidence_image?: FileProps
            status?: number
            rejection_reason?: string
        }
    ) {
        const url = `leave_requests/${id}/`
        const formData = new FormData()
        formData.append("leave_date", payload.leave_date)
        formData.append("start_time", payload.start_time)
        formData.append("end_time", payload.end_time)
        formData.append("leave_hours", payload.leave_hours.toString())
        formData.append("reason", payload.reason)
        formData.append("leave_type", payload.leave_type.toString())
        if (payload.status) formData.append("status", payload.status.toString())
        if (payload.rejection_reason) formData.append("rejection_reason", payload.rejection_reason)
        if (payload.evidence_image?.uri) {
            formData.append('evidence_image', {
                uri: payload.evidence_image?.uri,
                name: payload.evidence_image?.name,
                type: payload.evidence_image?.type,
            } as any)
        } else {
            formData.append('remove_evidence_image', 'true')
        }

        return axiosClient.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
}

export default leaveRequestApi