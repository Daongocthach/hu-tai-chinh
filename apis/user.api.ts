import { cleanParams, PaginatedResponse, User } from "@/lib"
import axiosClient from "./axios-client"

const userApi = {
    getUsers(payload: {
        page?: number,
        page_size?: number,
        q?: string,
        status?: boolean,
        role?: number
    }) {
        const url = 'users/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<User[]>>(url, { params })
    },
    requestActivateAccount() {
        const url = `users/request_active_account/`
        return axiosClient.post(url)
    },
    disableAccount(user_id: number) {
        const url = `admin/users/${user_id}/disable_account/`
        return axiosClient.put(url)
    },
    activeAccount(user_id: number) {
        const url = `admin/users/${user_id}/active_account`
        return axiosClient.put(url)
    }
}

export default userApi