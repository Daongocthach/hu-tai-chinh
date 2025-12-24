import { MeetingsOnlineFilterValues, StatusConfig } from "../types"

export const ROOM_STATUS = {
  AVAILABLE: 1,
  FIXED: 2,
} as const

export const MEETING_TYPE = {
  MEETING_ROOM: 1,
  MEETING_ONLINE: 2,
} as const

export const MEETING_INVITED_STATUS = {
  UNCONFIRMED: 1,
  CONFIRMED: 2,
  REJECTED: 3,
} as const

export const MEETING_INVITED_STATUS_OPTIONS: Record<string, StatusConfig> = {
  [MEETING_INVITED_STATUS.UNCONFIRMED.toString()]: {
    label: 'unconfirmed',
    value: MEETING_INVITED_STATUS.UNCONFIRMED,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [MEETING_INVITED_STATUS.CONFIRMED.toString()]: {
    label: 'confirmed',
    value: MEETING_INVITED_STATUS.CONFIRMED,
    color: 'success',
    containerColor: 'successContainer',
  },
  [MEETING_INVITED_STATUS.REJECTED.toString()]: {
    label: 'rejected',
    value: MEETING_INVITED_STATUS.REJECTED,
    color: 'error',
    containerColor: 'errorContainer',
  },
} as const

export const MEETING_STATUS = {
  UPCOMING: 1,
  ONGOING: 2,
  COMPLETED: 3,
} as const

export const MEETING_STATUS_OPTIONS: Record<string, StatusConfig> = {
  [MEETING_STATUS.UPCOMING.toString()]: {
    label: 'upcoming',
    value: MEETING_STATUS.UPCOMING,
    color: 'secondary',
    containerColor: 'secondaryContainer',
  },
  [MEETING_STATUS.ONGOING.toString()]: {
    label: 'ongoing',
    value: MEETING_STATUS.ONGOING,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [MEETING_STATUS.COMPLETED.toString()]: {
    label: 'completed',
    value: MEETING_STATUS.COMPLETED,
    color: 'success',
    containerColor: 'successContainer',
  },
} as const



export const ROOM_FACILITIES: Record<string, StatusConfig> = {
  whiteboard: {
    label: 'whiteboard',
    value: 'whiteboard',
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  projector: {
    label: 'projector',
    value: 'projector',
    color: 'error',
    containerColor: 'errorContainer',
  },
  wifi: {
    label: 'wifi',
    value: 'wifi',
    color: 'warning',
    containerColor: 'warningContainer',
  },
  television: {
    label: 'television',
    value: 'television',
    color: 'success',
    containerColor: 'successContainer',
  },
} as const

export const CAPACITY_OPTIONS = [
    { label: 'all', value: '' },
    { label: '<5', value: '5' },
    { label: '<10', value: '10' },
    { label: '<15', value: '15' },
    { label: '<20', value: '20' },
]

export const MEETINGS_ONLINE_DEFAULT_FILTER_VALUES: MeetingsOnlineFilterValues = {
    status: MEETING_STATUS.UPCOMING,
    date_start: undefined,
    date_end: undefined,
}

export const ROOMS_DEFAULT_FILTER_VALUES: MeetingsOnlineFilterValues = {
    status: MEETING_STATUS.UPCOMING,
    date_start: undefined,
    date_end: undefined,
}