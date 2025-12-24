import { cleanParams, Department, PaginatedResponse } from "@/lib"
import axiosClient from "./axios-client"

const departmentApi = {
    getDepartments(payload: {
        page?: number,
        page_size?: number,
        q?: string
    }) {
        const url = 'departments/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<Department[]>>(url, { params })
    },
}

export default departmentApi