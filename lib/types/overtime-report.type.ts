import { Subtask, TaskDetails } from "./project.type"
import { User } from "./user.type"

export type ExtraTaskDetails = TaskDetails & {
  is_show_children: boolean
  phase: {
    id: number
    project_department: {
      id: number
      project: {
        id: number
        name: string
      }
    }
  }
  subtasks: Subtask[] | undefined
  total_subtasks: number
  total_times: number
  num_comments: number
}

export type LogTime = {
  created: string
  id: number
  modified: string
  task: ExtraTaskDetails
  total_hours: number
  user: User
  work_date: string
  work_hours: number
}

export type OverTime = {
  id: number
  user: User
  confirmed_at: string
  confirmed_by: User
  end_time: string
  note: string
  overtime_type: number
  start_time: string
  status: number
  work_date: string
  work_hours: number
  rejection_reason: string
  task: ExtraTaskDetails
}

export type OvertimeReportsFilterValues = {
  status: number
  overtime_type: number
  work_date_range_before: Date
  work_date_range_after: Date
  quick_time_range: string
  project: number
  user: number
}