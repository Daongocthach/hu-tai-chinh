import { ApiResponse, cleanParams, PaginatedResponse, Project, ProjectHistory, ProjectMember, ProjectTask, ProjectTasksCardProps } from "@/lib"
import { ROLES } from "@/lib/constants/user.constant"
import axiosClient from "./axios-client"

const projectApi = {
    getProjects(payload: {
        page?: number
        page_size?: number
        q?: string
        customer?: number | string
        department?: number | string
        priority?: number[]
        status?: number[]
        user?: number | string
    }) {
        const url = "projects/"
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<Project[]>>(url, { params })
    },
    getProject(project_id: string, role?: number) {
        const url = role === ROLES.ADMIN ? `admin/projects/${project_id}/` : `projects/${project_id}/`
        return axiosClient.get<ApiResponse<Project>>(url)
    },
    getProjectsTasks(payload: {
        page?: number
        page_size?: number
        q?: string,
        project_id?: number,
        status?: number
    }) {
        const url = "projects/details/"
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<ProjectTasksCardProps[]>>(url, { params })
    },
    approveProject(project_id: number) {
        const url = `request_project_update_statuses/${project_id}/approve/`
        return axiosClient.post(url)
    },
    rejectProject(project_id: number) {
        const url = `request_project_update_statuses/${project_id}/reject/`
        return axiosClient.post(url)
    },
    getMembersByProject(project_id: number) {
        const url = `projects/${project_id}/members/`
        return axiosClient.get<ApiResponse<ProjectMember[]>>(url)
    },
    getProjectHistories(project_id: number, payload: {
        page?: number
        page_size?: number
    }) {
        const url = `projects/${project_id}/history/`
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<ProjectHistory[]>>(url, { params })
    },
    getMyApprovals(payload: {
        page?: number
        page_size?: number
        q?: string,
        project_id?: number,
        status?: number
    }) {
        const url = "projects/task_details/"
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<ProjectTask[]>>(url, { params })
    },
}

export default projectApi