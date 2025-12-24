import { cleanParams, Customer, PaginatedResponse } from "@/lib"
import axiosClient from "./axios-client"

const customerApi = {
    getCustomers(payload: {
        page?: number,
        page_size?: number,
        q?: string
    }) {
        const url = 'customers/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<Customer[]>>(url, { params })
    },
}

export default customerApi