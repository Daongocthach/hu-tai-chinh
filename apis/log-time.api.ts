import { ApiResponse, LogTime } from "@/lib"
import axiosClient from "./axios-client"

const logTimeApi = {
    getLogTime(id: number) {
        const url = `log_time/${id}/`
        return axiosClient.get<ApiResponse<LogTime>>(url)
    },
    editLogTime(id: number, payload: {
        work_date: string,
        work_hours: number,
    }) {
        const url = `log_time/${id}/`
        return axiosClient.put(url, payload)
    },
    deleteLogTime(id: number) {
        const url = `log_time/${id}/`
        return axiosClient.delete(url)
    },
}

export default logTimeApi