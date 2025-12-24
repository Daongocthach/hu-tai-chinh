import { cleanParams, MeetingBuildingType, PaginatedResponse } from "@/lib"
import axiosClient from "./axios-client"

const buildingApi = {
    getBuildings(page?: number, page_size?: number) {
        const url = 'buildings/'
        const params = cleanParams({ page, page_size })
        return axiosClient.get<PaginatedResponse<MeetingBuildingType>>(url, { params })
    },
}

export default buildingApi
