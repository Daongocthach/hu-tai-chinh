import { StatusConfigMap } from "../types"

export const ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  WORKER: 3,
  GUEST: 4,
} as const

export const ROLE_MAP: StatusConfigMap = {
  [ROLES.ADMIN]: {
    label: 'admin',
    value: ROLES.ADMIN,
    color: 'primary',
    containerColor: 'primaryContainer',
  },
  [ROLES.MANAGER]: {
    label: 'manager',
    value: ROLES.MANAGER,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  [ROLES.WORKER]: {
    label: 'worker',
    value: ROLES.WORKER,
    color: 'secondary',
    containerColor: 'secondaryContainer',
  },
  [ROLES.GUEST]: {
    label: 'guest',
    value: ROLES.GUEST,
    color: 'error',
    containerColor: 'errorContainer',
  },
}

export const USER_STATUS = {
  APPROVED: 1,
  PENDING: 2,
} as const

export const USER_STATUS_MAP: StatusConfigMap = {
  [USER_STATUS.APPROVED]: {
    label: 'approved',
    value: USER_STATUS.APPROVED,
    color: 'primary',
    containerColor: 'primaryContainer',
  },
  [USER_STATUS.PENDING]: {
    label: 'pending',
    value: USER_STATUS.PENDING,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
}