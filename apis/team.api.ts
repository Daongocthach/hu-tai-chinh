import { cleanParams } from "@/lib/utils"
import axiosClient from "./axios-client"

const teamsApi = {
    getTeams(payload:{
        page?: number, 
        page_size?: number, 
        q?: string
    }) {
        const url = 'teams/'
        const params = cleanParams(payload)
        return axiosClient.get(url, { params })
    },
}

export default teamsApi