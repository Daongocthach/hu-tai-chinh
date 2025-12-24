import { Customer, User } from "./user.type"

export type CommentContentClass = "projectdepartment" | "phase" | "task" | "report"

export type FileDetails = {
  created: string
  id: number
  modified: string
  name: string
  note: string | null
  owner: User
  path: string
}

export type CommentDetails = {
  author: User
  content: string
  content_object: DepartmentDetails | {
    project_department: ProjectDepartment
  } & PhaseDetails | TaskDetails
  created: string
  files: FileDetails[]
  id: number
  images: FileDetails[]
  mention_users: User[]
  modified: string
  videos: FileDetails[]
}

export type ProjectStatusChangeRequest = {
  id: number
  requested_by: User
  confirmed_by: User | null
  old_status: number
  new_status: number
}

export type Group = {
  created: string
  files: File[]
  id: number
  modified: string
  name: string
  project_id: number
  permissions: {
    can_delete: boolean
    can_manage: boolean
    can_update: boolean
    can_view: boolean
  }
  leaders: User[]
  total_reports: number
  users: User[]
}

export type DailyReports = {
  id: number
  name: string
  created: string
  modified: string
  customer: Customer | null
  daily_report_date: string
  priority: number
  status: number
  num_comments: number
  permissions: {
    can_view: boolean
    can_manage: boolean
  }
  group: {
    id: number
    name: string
    users: User[]
    leaders: User[]
  }
}

export type Subtask = {
  content: string
  created_by: User
  is_completed: boolean
  user_task: number
  id: number
}

export type TaskDetails = {
  actual_date_end: string | null
  actual_date_start: string | null
  created: string
  completion_percent: number
  date_end: string
  date_start: string
  delay: boolean
  dependent_tasks: {
    date_end: string
    id: number
    name: string
  }[]
  id: number
  leaders: User[]
  modified: string
  name: string
  num_comments: number
  permissions: {
    can_view: boolean
    can_manage: boolean
    can_manage_status: boolean
    can_manage_completion: boolean
  }
  reason_delay: {
    content: string
    created: string
    modified: string
    user: User
  } | null
  status: number
  type: number
  users: User[]
  viewers: User[]
  responsible: User[]
  accountable: User[]
  consulted: User[]
  informed: User[]
  user_follow: User[]
  decision_status: number
  total_times: number
  user_task: number
}


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

export type PhaseDetails = {
  completed_tasks: number
  created: string
  completion_percent: number
  date_end: string
  date_start: string
  id: number
  is_show_children: boolean
  leaders: User[]
  modified: string
  name: string
  num_comments: number
  permissions: {
    can_view: boolean
    can_manage: boolean
  }
  tasks?: TaskDetails[]
  total_tasks: number
  total_delay_tasks: number
  viewers: User[]
}

export type DepartmentDetails = {
  completed_tasks: number
  created: string
  completion_percent: number
  date_end: string | null
  date_start: string | null
  id: number
  is_show_children: boolean
  leaders: User[]
  modified: string
  name: string
  num_comments: number
  permissions: {
    can_view: boolean
    can_manage: boolean
  }
  phases: PhaseDetails[]
  project_department_id: number
  total_delay_tasks: number
  total_tasks: number
  viewers: User[]
}


export type ProjectDepartment = {
  completed_tasks: number
  created_by: User
  created: string
  completion_percent: number
  date_end: string | null
  date_start: string | null
  id: number
  leaders: User[]
  viewers: User[]
  modified: string
  name: string
  project_department_id: number
  total_tasks: number
}

export type Project = {
  completed_tasks: number
  completion_percent: number
  created_by: User
  created: string
  customer: Customer | null
  date_end: string
  date_start: string
  departments: ProjectDepartment[]
  id: number
  leaders: User[]
  modified: string
  name: string
  priority: number
  request_project_change_status: {
    id: number
    requested_by: User
    confirmed_by: User | null
    old_status: number
    new_status: number
  } | null
  status: number
  total_delay_tasks: number
  total_tasks: number
  viewers: User[]
  permissions: {
    can_view: boolean
    can_manage: boolean
    can_manage_files: boolean
  }
}

export type ProjectMember = User & { position: number }

export type ProjectsFilterValues = {
  priority: number[]
  status: number[]
  department: string
  customer: string
  user: string
}

export type ProjectsTasksFilterValues = {
  status: number
  project_id: number
}


export type ProjectTasksCardProps = Project & {
  tasks: TaskDetails[]
}


export type Differences = {
  name?: [string, string]
  date_start?: [string, string]
  date_end?: [string, string]
  status?: [string, string]
  priority?: [string, string]
  manager?: [string, string]
  customer?: [string, string]
  actual_date_start?: [null | string, null | string]
  actual_date_end?: [null | string, null | string]
  delay_date?: [string, string]
  task_type?: [string, string]
  is_delay?: [boolean, boolean]
  completion_percent?: [number, number]
  position?: [null | number, null | number]
}

export type ProjectHistory = {
  history_date: string
  history_type: number
  history_change_reason: string | null
  id: number
  history_object: {
    name: string
  }
  history_user: User | null
  class_name: "Project" | "ProjectDepartment" | "Phase" | "Task" | "File"
  differences: Differences
}

export type ProjectDetails = {
  completed_tasks: number
  completion_percent: number
  created: string
  customer: Customer | null
  date_end: string
  date_start: string
  departments: DepartmentDetails[]
  id: number
  is_show_children: boolean
  leaders: User[]
  modified: string
  name: string
  permissions: {
    can_view: boolean
    can_manage: boolean
    can_manage_files: boolean
  }
  priority: number
  request_project_change_status: ProjectStatusChangeRequest | null
  status: number
  total_delay_tasks: number
  total_tasks: number
  viewers: User[]
}


export type ProjectLogTime = {
  date_end: string | null
  date_start: string | null
  id: number
  log_times: number[]
  leave_requests: number[]
  overtimes: number[]
  members: User[]
  name: string
  status: number
}

export type MyApprovalsFilterValues = {
  status: number
  project_id: number
}

export type ProjectTask = {
  completed_tasks: number
  completion_percent: number
  created: string
  date_end: string | null
  date_start: string | null
  id: number
  is_show_children: boolean
  modified: string
  name: string
  priority: number
  project_department_id: number
  status: number
  tasks: ExtraTaskDetails[]
  total_tasks: number
  total_times: number
}

