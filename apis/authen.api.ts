import { ApiResponse, FileProps, SignUpProps, User } from "@/lib"
import axiosClient from "./axios-client"
import publicAxiosClient from "./public-axios-client"

const authenApi = {
    register(data: SignUpProps) {
        const url = 'auth/register/'
        return publicAxiosClient.post<ApiResponse<{ token: string }>>(url, data)
    },
    me() {
        const url = 'auth/me/'
        return axiosClient.get<ApiResponse<User>>(url)
    },
    login(data: { email: string, password: string }) {
        const url = 'auth/login/'
        return publicAxiosClient.post<User>(url, data)
    },
    async logout(refresh_token: string) {
        const url = 'auth/logout/'
        return axiosClient.post(url, { refresh_token })
    },
    updateProfile(data: {
        first_name: string,
        last_name: string,
        employee_code: string
    }) {
        const url = 'auth/me/'
        return axiosClient.put<ApiResponse<{
            first_name: string,
            last_name: string,
            employee_code: string,
        }>>(url, data)
    },
    updateAvatar(file: FileProps) {
        const url = 'auth/avatar/'
        const formData = new FormData()
        formData.append('avatar', {
            uri: file.uri,
            type: file.type,
            name: file.name,
        } as any)

        return axiosClient.put<ApiResponse<User>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    changePassword(data: { old_password: string, new_password: string }) {
        const url = 'auth/password/'
        return axiosClient.put(url, data)
    },
    toggleTwoFactorAuthentication() {
        const url = 'auth/me/toggle_2fa/'
        return axiosClient.put<ApiResponse<{
            qr_code: string,
            uri: string,
        }>>(url)
    },
    sendOTP(payload: {
        email: string
    }) {
        const url = 'auth/send_otp/'
        return publicAxiosClient.post(url, payload)
    },
    verifyOTP(payload: {
        email: string,
        otp: string
    }) {
        const url = 'auth/verify_otp/'
        return publicAxiosClient.post(url, payload)
    },
    forgotPassword(payload: {
        email: string,
    }) {
        const url = 'auth/forgot_password/'
        return publicAxiosClient.post(url, payload)
    },
    verify2FA(payload: {
        email: string,
        otp: string
    }) {
        const url = 'auth/verify_2fa/'
        return publicAxiosClient.post<User>(url, payload)
    },
    requestUnlockAccount(payload: {
        email: string,
    }) {
        const url = 'auth/request_unlock_account/'
        return axiosClient.post(url, payload)
    },
    
}

export default authenApi