import { ApiResponse, cleanParams, FileProps, MeetingRoom, PaginatedResponse } from "@/lib";
import axiosClient from "./axios-client";

const roomApi = {
    getRooms(payload: {
        page?: number,
        page_size?: number,
        q?: string,
        customer?: number,
        meeting_date?: string,
        start_time?: string,
        end_time?: string,
        min_capacity?: string,
        max_capacity?: string,
        status?: number,
        wifi?: boolean,
        projector?: boolean,
        television?: boolean,
        whiteboard?: boolean
    }) {
        const url = 'meeting_rooms/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<MeetingRoom[]>>(url, { params })
    },
    getRoomById(id: number) {
        const url = `meeting_rooms/${id}/`
        return axiosClient.get<ApiResponse<MeetingRoom>>(url)
    },
    createRoom(payload: {
        name: string
        capacity: number
        wifi: boolean
        whiteboard: boolean
        projector: boolean
        television: string
        status: number
        floor: number
        building: number
        image?: FileProps
    }) {
        const url = 'meeting_rooms/'
        const formData = new FormData()
        formData.append("name", payload.name)
        formData.append("capacity", payload.capacity.toString())
        formData.append("wifi", payload.wifi.toString())
        formData.append("whiteboard", payload.whiteboard.toString())
        formData.append("projector", payload.projector.toString())
        formData.append("television", payload.television || "")
        formData.append("status", payload.status?.toString() || "1")
        formData.append("floor", payload.floor?.toString())
        formData.append("building", payload.building?.toString())
        formData.append('image', {
            uri: payload.image?.uri,
            name: payload.image?.name,
            type: payload.image?.type,
        } as any)

        return axiosClient.post<ApiResponse<MeetingRoom>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    editRoom(id: number,
        payload: {
            name: string
            capacity: number
            wifi: boolean
            whiteboard: boolean
            projector: boolean
            television: string
            status: number
            floor: number
            building: number
            image?: FileProps
        }) {
        const url = `meeting_rooms/${id}/`
        const formData = new FormData()
        formData.append("name", payload.name);
        formData.append("capacity", payload.capacity.toString())
        formData.append("wifi", payload.wifi.toString())
        formData.append("whiteboard", payload.whiteboard.toString())
        formData.append("projector", payload.projector.toString())
        formData.append("television", payload.television || "")
        formData.append("status", payload.status?.toString() || "1")
        formData.append("floor", payload.floor?.toString())
        formData.append("building", payload.building?.toString())
        formData.append('image', {
            uri: payload.image?.uri,
            name: payload.image?.name,
            type: payload.image?.type,
        } as any)

        return axiosClient.put<ApiResponse<MeetingRoom>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    deleteRoom(id: number) {
        const url = `meeting_rooms/${id}/`
        return axiosClient.delete(url)
    }
}

export default roomApi