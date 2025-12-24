import { ApiResponse, cleanParams, OverTime, PaginatedResponse } from "@/lib"
import axiosClient from "./axios-client"

const overtimeReportApi = {
    getOvertimeReports(payload: {
        q?: string
        id?: number
        page?: number
        page_size?: number
        this_week?: boolean
        this_month?: boolean
        last_30_days?: boolean
        user?: number
        status?: number
        overtime_type?: number
        project_id?: number
        ordering?: string
        work_date_range_after?: string
        work_date_range_before?: string
    }) {
        const url = 'overtimes/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<OverTime>>(url, { params })
    },
    getOvertimeReportDetails(id: number) {
        const url = `overtimes/${id}/`
        return axiosClient.get<ApiResponse<OverTime>>(url)
    },
    deleteOvertimeReport(id: number) {
        const url = `overtimes/${id}/`
        return axiosClient.delete(url)
    },
    approveOvertimeReport(id: number) {
        const url = `overtimes/${id}/approve/`
        return axiosClient.post(url)
    },
    determineOvertimeReport(
        id: number,
        payload: {
            determination: number,
            rejection_reason?: string
        }
    ) {
        const url = `/overtimes/${id}/confirm/`
        const payloadData = cleanParams(payload)
        return axiosClient.post(url, payloadData)
    },
    createOvertimeReport(payload: {
        start_time: string
        end_time: string
        work_hours: number
        note: string
        overtime_type: number
        task: number
        work_date: string
    }) {
        const url = 'overtimes/'
        const payloadData = cleanParams(payload)
        return axiosClient.post(url, payloadData)
    },
    editOvertimeReport(
        id: number,
        payload: {
            start_time: string
            end_time: string
            work_hours: number
            note: string
            overtime_type: number
            task: number
            work_date: string
            status?: number
            rejection_reason?: string
        }
    ) {
        const url = `overtimes/${id}/`
        const payloadData = cleanParams(payload)
        return axiosClient.put(url, payloadData)
    },
}

export default overtimeReportApi