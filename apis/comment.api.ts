import { ApiResponse, cleanParams, CommentContentClass, CommentDetails, FileProps, PaginatedResponse, User } from "@/lib"
import axiosClient from "./axios-client"

const commentApi = {
    getComments(payload: {
        content_class: CommentContentClass
        object_id: number
        page?: number
        page_size?: number
    }) {
        const url = `comments/${payload.content_class}/${payload.object_id}/`
        const params = cleanParams(payload)
        return axiosClient.get<PaginatedResponse<CommentDetails>>(url, { params })
    },
    getMembersByContentClass(params: {
        content_class: CommentContentClass
        object_id: number
    }) {
        const { content_class, object_id } = params
        const url =
            content_class === "projectdepartment"
                ? `/project_departments/${object_id}/members/`
                : content_class === "report"
                    ? `/groups/${object_id}/members/`
                    : content_class === "phase"
                        ? `/phases/${object_id}/members/`
                        : `/tasks/${object_id}/members/`
        return axiosClient.get<ApiResponse<User[]>>(url)
    },
    sendComment(payload: {
        content: string
        content_class: CommentContentClass
        object_id: number
        mention_users?: number[]
        images?: FileProps[]
        videos?: FileProps[]
        files?: FileProps[]
    }) {
        const url = 'comments/'
        const formData = new FormData()
        formData.append('content', payload.content)
        formData.append('content_class', payload.content_class)
        formData.append('object_id', payload.object_id.toString())
        if (payload.mention_users) {
            payload.mention_users.forEach((userId) => {
                formData.append('mention_users', userId.toString())
            })
        }
        if (payload.images) {
            payload.images.forEach((file) => {
                formData.append('images', {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                } as any)
            })
        }
        if (payload.videos) {
            payload.videos.forEach((file) => {
                formData.append('videos', {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                } as any)
            })
        }
        if (payload.files) {
            payload.files.forEach((file) => {
                formData.append('files', {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                } as any)
            })
        }

        return axiosClient.post<ApiResponse<CommentDetails>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    editComment(commentId: number, payload: {
        content: string
        content_class: CommentContentClass
        mention_users: number[]
        object_id: number
    }) {
        const url = `comments/${commentId}/`
        return axiosClient.patch<ApiResponse<CommentDetails>>(url, payload)
    },
    deleteComment(commentId: number) {
        const url = `comments/${commentId}/`
        return axiosClient.delete(url)
    }
}

export default commentApi
