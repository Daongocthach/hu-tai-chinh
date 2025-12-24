import { StatusConfigMap } from "../types"

export const PROJECT_STATUS = {
  NOT_STARTED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CLOSED: 4,
  PENDING: 5,
}

export const PROJECT_STATUS_MAP: StatusConfigMap = {
  [PROJECT_STATUS.NOT_STARTED]: {
    label: 'not started',
    value: PROJECT_STATUS.NOT_STARTED,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  [PROJECT_STATUS.IN_PROGRESS]: {
    label: 'in progress',
    value: PROJECT_STATUS.IN_PROGRESS,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [PROJECT_STATUS.COMPLETED]: {
    label: 'completed',
    value: PROJECT_STATUS.COMPLETED,
    color: 'success',
    containerColor: 'successContainer',
  },
  [PROJECT_STATUS.PENDING]: {
    label: 'pending',
    value: PROJECT_STATUS.PENDING,
    color: 'secondary',
    containerColor: 'secondaryContainer',
  },
  [PROJECT_STATUS.CLOSED]: {
    label: 'closed',
    value: PROJECT_STATUS.CLOSED,
    color: 'onCardDisabled',
    containerColor: 'cardDisabled',
  },
}

export const PROJECT_PRIORITIES = {
  IMPORTANT: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
}

export const PROJECT_PRIORITIES_MAP: StatusConfigMap = {
  [PROJECT_PRIORITIES.IMPORTANT]: {
    label: 'important',
    value: PROJECT_PRIORITIES.IMPORTANT,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  [PROJECT_PRIORITIES.HIGH]: {
    label: 'high',
    value: PROJECT_PRIORITIES.HIGH,
    color: 'error',
    containerColor: 'errorContainer',
  },
  [PROJECT_PRIORITIES.MEDIUM]: {
    label: 'medium',
    value: PROJECT_PRIORITIES.MEDIUM,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [PROJECT_PRIORITIES.LOW]: {
    label: 'low',
    value: PROJECT_PRIORITIES.LOW,
    color: 'success',
    containerColor: 'successContainer',
  },
}

export const TASK_STATUS = {
  NOT_STARTED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  REVIEW_PENDING: 4,
}

export const TASK_STATUS_MAP: StatusConfigMap = {
  [TASK_STATUS.NOT_STARTED]: {
    label: 'not started',
    value: TASK_STATUS.NOT_STARTED,
    color: 'secondary',
    containerColor: 'secondaryContainer',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: 'in progress',
    value: TASK_STATUS.IN_PROGRESS,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [TASK_STATUS.COMPLETED]: {
    label: 'completed',
    value: TASK_STATUS.COMPLETED,
    color: 'success',
    containerColor: 'successContainer',
  },
  [TASK_STATUS.REVIEW_PENDING]: {
    label: 'review pending',
    value: TASK_STATUS.REVIEW_PENDING,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
}

export const PROJECT_PERMISSION_LEVEL = {
  EXECUTIVE_MANAGER: 1,
  DEPARTMENT_MANAGER: 2,
  PHASE_MANAGER: 5,
  TASK_MANAGER: 6,
  STAFF: 3,
  GUEST: 4,
}

export const PROJECT_PERMISSION_LEVEL_MAP = {
  [PROJECT_PERMISSION_LEVEL.EXECUTIVE_MANAGER]: {
    label: 'executive manager',
    value: PROJECT_PERMISSION_LEVEL.EXECUTIVE_MANAGER,
    color: 'secondary',
    containerColor: 'secondaryContainer',
  },
  [PROJECT_PERMISSION_LEVEL.DEPARTMENT_MANAGER]: {
    label: "department manager",
    value: PROJECT_PERMISSION_LEVEL.DEPARTMENT_MANAGER,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [PROJECT_PERMISSION_LEVEL.PHASE_MANAGER]: {
    label: "phase manager",
    value: PROJECT_PERMISSION_LEVEL.PHASE_MANAGER,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  [PROJECT_PERMISSION_LEVEL.TASK_MANAGER]: {
    label: "task manager",
    value: PROJECT_PERMISSION_LEVEL.TASK_MANAGER,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [PROJECT_PERMISSION_LEVEL.STAFF]: {
    label: "staff",
    value: PROJECT_PERMISSION_LEVEL.STAFF,
    color: 'success',
    containerColor: 'successContainer',
  },
  [PROJECT_PERMISSION_LEVEL.GUEST]: {
    label: "guest",
    value: PROJECT_PERMISSION_LEVEL.GUEST,
    color: 'primary',
    containerColor: 'primaryContainer',
  },
}


export const PROJECT_HISTORY = {
  CREATED: 1,
  UPDATED: 2,
  TRASHED: 3,
  DELETED: 4,
  RESTORED: 5,
}

export const PROJECT_HISTORY_MAP = {
  [PROJECT_HISTORY.CREATED]: {
    label: 'created',
    value: PROJECT_HISTORY.CREATED,
    color: 'secondary',
    containerColor: 'secondaryContainer',
  },
  [PROJECT_HISTORY.UPDATED]: {
    label: "updated",
    value: PROJECT_HISTORY.UPDATED,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [PROJECT_HISTORY.TRASHED]: {
    label: "trashed",
    value: PROJECT_HISTORY.TRASHED,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  [PROJECT_HISTORY.DELETED]: {
    label: "deleted",
    value: PROJECT_HISTORY.DELETED,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [PROJECT_HISTORY.RESTORED]: {
    label: "restored",
    value: PROJECT_HISTORY.RESTORED,
    color: 'success',
    containerColor: 'successContainer',
  },
}