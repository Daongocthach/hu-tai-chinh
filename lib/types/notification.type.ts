import { Leave } from './leave-request.type'
import { Meeting } from './meeting.type'
import { OverTime } from './overtime-report.type'
import {
  CommentDetails,
  DailyReports,
  DepartmentDetails,
  Group,
  PhaseDetails,
  ProjectDetails,
  ProjectStatusChangeRequest,
  TaskDetails
} from './project.type'
import { User } from './user.type'

export type NotificationProps = {
  created: string
  data: {
    project_name?: string
    task_name?: string
    date?: string
    comment?: CommentDetails & {
      content_class: "projectdepartment" | "phase" | "task"
      content_object:
      | DepartmentDetails
      | PhaseDetails
      | (TaskDetails & { phase: { id: number } })
    }
    project_department?: DepartmentDetails
    file_quantity?: number
    message?: {
      en: string
      scn: string
      tcn: string
      vi: string
    }
    project?: ProjectDetails
    sender?: User
    task?: TaskDetails & { phase: { id: number } }
    phase?: PhaseDetails
    department?: DepartmentDetails
    dependent_task?: TaskDetails & { phase: { id: number } }
    request_project_change_status?: ProjectStatusChangeRequest
    meeting?: Meeting
    group?: Group
    report?: DailyReports
    leave_request?: Leave
    overtime?: OverTime
  }
  id: number
  is_read: boolean
  modified: string
  notify_type: number
  type: number
  user: User
}
