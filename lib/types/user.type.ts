export type User = {
    id: number
    email: string
    first_name: string
    last_name: string
    dob: string
    role: number
    avatar: string
    full_name: string
    status: boolean
    is_master: boolean
    is_2fa_verify: boolean
    is_locked: boolean
    is_disabled: boolean
    employee_code: string | null
    refresh_token: string | null
    access_token: string | null
    is_moderator_project_status: boolean
    lock_time: string | null
}

export type Customer = {
    created: string
    id: number
    modified: string
    name: string
}

export type UsersFilterValues = {
  status: number
  role: number
}