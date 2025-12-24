import { User } from "./user.type"

export type Leave = {
  id: number
  user: User
  leave_date: string
  start_time: string
  end_time: string
  leave_hours: number
  reason: string
  leave_type: number
  status: number
  confirmed_by: User
  confirmed_at: string
  rejection_reason: string
  evidence_image: string
}

export type LeaveRequestsFilterValues = {
  quick_time_range: string
  status: number
  leave_type: number
  duration_type: string
  leave_date_range_before: Date
  leave_date_range_after: Date
  user: number
}