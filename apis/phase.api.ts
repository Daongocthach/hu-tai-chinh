import { ApiResponse, PhaseDetails } from "@/lib"
import axiosClient from "./axios-client"

const phaseApi = {
    getPhase(phase_id: number) {
        const url = `phases/${phase_id}/`
        return axiosClient.get<ApiResponse<PhaseDetails>>(url)
    }
}

export default phaseApi