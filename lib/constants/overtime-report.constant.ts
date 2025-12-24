import { StatusConfigMap } from "../types"

export const OVERTIME_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
}

export const OVERTIME_STATUS_MAP: StatusConfigMap = {
  [OVERTIME_STATUS.APPROVED]: {
    label: 'approved',
    value: OVERTIME_STATUS.APPROVED,
    color: 'success',
    containerColor: 'successContainer',
  },
  [OVERTIME_STATUS.PENDING]: {
    label: 'pending',
    value: OVERTIME_STATUS.PENDING,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [OVERTIME_STATUS.REJECTED]: {
    label: 'rejected',
    value: OVERTIME_STATUS.REJECTED,
    color: 'error',
    containerColor: 'errorContainer',
  },
}

export const OVERTIME_TYPE = {
  REGULAR: 1,
  NIGHT_SHIFT: 2,
  WEEKEND: 3,
  HOLIDAY: 4,
}

export const OVERTIME_TYPE_MAP: StatusConfigMap = {
  [OVERTIME_TYPE.REGULAR]: {
    label: 'regular',
    value: OVERTIME_TYPE.REGULAR,
    color: 'success',
    containerColor: 'successContainer',
  },
  [OVERTIME_TYPE.NIGHT_SHIFT]: {
    label: 'night shift',
    value: OVERTIME_TYPE.NIGHT_SHIFT,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [OVERTIME_TYPE.WEEKEND]: {
    label: 'weekend',
    value: OVERTIME_TYPE.WEEKEND,
    color: 'error',
    containerColor: 'errorContainer',
  },
  [OVERTIME_TYPE.HOLIDAY]: {
    label: 'holiday',
    value: OVERTIME_TYPE.HOLIDAY,
    color: 'primary',
    containerColor: 'primaryContainer',
  },
}

export const OVERTIME_TYPE_OPTIONS = [
  { label: 'regular', value: OVERTIME_TYPE.REGULAR },
  { label: 'night shift', value: OVERTIME_TYPE.NIGHT_SHIFT },
  { label: 'weekend', value: OVERTIME_TYPE.WEEKEND },
  { label: 'holiday', value: OVERTIME_TYPE.HOLIDAY },
]

export const OVERTIME_STATUS_OPTIONS = [
  { label: 'approved', value: OVERTIME_STATUS.APPROVED },
  { label: 'pending', value: OVERTIME_STATUS.PENDING },
  { label: 'rejected', value: OVERTIME_STATUS.REJECTED },
]

export const OVERTIME_QUICK_TIME_RANGE_MAP: StatusConfigMap = {
  'week': {
    label: 'this week',
    value: 'week',
    color: 'primary',
    containerColor: 'primaryContainer',
  },
  'month': {
    label: 'this month',
    value: 'month',
    color: 'success',
    containerColor: 'successContainer',
  },
  'last_30_days': {
    label: 'last 30 days',
    value: 'last_30_days',
    color: 'warning',
    containerColor: 'warningContainer',
  },
}