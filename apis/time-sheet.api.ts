import { ApiResponse, LogTime, OverTime } from "@/lib"
import axiosClient from "./axios-client"

const timeSheetApi = {
    getTaskHours(payload: {
        task_id: number,
        work_date: string,
    }) {
        const url = `time_sheets/task_hours/?task_id=${payload.task_id}&work_date=${payload.work_date}`
        return axiosClient.get<ApiResponse<{
            log_time: LogTime,
            overtime: OverTime[]
        }>>(url)
    },
    createLogTime(payload: {
        task: number,
        work_date: string,
        work_hours: number,
    }) {
        const url = `time_sheets/`
        return axiosClient.post<ApiResponse<LogTime>>(url, payload)
    },
    editLogTime(id: number, payload: {
        work_date: string,
        work_hours: number,
    }) {
        const url = `time_sheets/${id}/`
        return axiosClient.put<ApiResponse<LogTime>>(url, payload)
    },
    deleteLogTime(id: number) {
        const url = `time_sheets/${id}/`
        return axiosClient.delete(url)
    },
}

export default timeSheetApi