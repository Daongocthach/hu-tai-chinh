import { ApiResponse, cleanParams, NotificationProps, PaginatedResponse } from "@/lib"
import axiosClient from "./axios-client"

const notificationApi = {
    getNotifications(payload: {
        page?: number,
        page_size?: number,
        is_read?: boolean,
        type?: number
    }) {
        const url = 'notifications/'
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<NotificationProps[]>>(url, { params })
    },
    unreadNotificationsCount() {
        const url = 'notifications/unread_notification_count/'
        return axiosClient.get<ApiResponse<number>>(url)
    },
    markAsRead(id: number) {
        const url = `notifications/${id}/mark_as_read/`
        return axiosClient.post(url)
    },
    markAllAsRead() {
        const url = 'notifications/mark_all_as_read/'
        return axiosClient.post(url)
    },
}

export default notificationApi