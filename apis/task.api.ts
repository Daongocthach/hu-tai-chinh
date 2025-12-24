import { ApiResponse, cleanParams, TaskDetails } from "@/lib"
import { ROLES } from "@/lib/constants/user.constant"
import axiosClient from "./axios-client"

const tasksApi = {
    getTasks(payload: {
        page?: number,
        page_size?: number
    }) {
        const url = 'tasks/'
        const params = cleanParams(payload)
        return axiosClient.get<ApiResponse<TaskDetails[]>>(url, { params })
    },
    getTasksByPhase(phase_id: number, role?: number) {
        const url = role === ROLES.ADMIN ? `admin/phases/${phase_id}/tasks/` : `phases/${phase_id}/tasks/`
        return axiosClient.get<ApiResponse<TaskDetails[]>>(url)
    },
    followTask(task_id: number) {
        const url = `tasks/${task_id}/follow_task/`
        return axiosClient.post<ApiResponse<TaskDetails>>(url)
    },
    unFollowTask(task_id: number) {
        const url = `tasks/${task_id}/unfollow_task/`
        return axiosClient.delete(url)
    },
}

export default tasksApi