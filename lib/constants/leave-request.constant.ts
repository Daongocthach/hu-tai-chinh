import { StatusConfigMap } from "../types"

export const LEAVE_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
}

export const LEAVE_STATUS_OPTIONS = [
  { label: 'approved', value: LEAVE_STATUS.APPROVED },
  { label: 'pending', value: LEAVE_STATUS.PENDING },
  { label: 'rejected', value: LEAVE_STATUS.REJECTED },
]

export const LEAVE_STATUS_MAP: StatusConfigMap = {
  [LEAVE_STATUS.APPROVED]: {
    label: 'approved',
    value: LEAVE_STATUS.APPROVED,
    color: 'success',
    containerColor: 'successContainer',
  },
  [LEAVE_STATUS.PENDING]: {
    label: 'pending',
    value: LEAVE_STATUS.PENDING,
    color: 'warning',
    containerColor: 'warningContainer',
  },
  [LEAVE_STATUS.REJECTED]: {
    label: 'rejected',
    value: LEAVE_STATUS.REJECTED,
    color: 'error',
    containerColor: 'errorContainer',
  },
}


export const LEAVE_TYPE = {
  ANNUAL_LEAVE: 1,
  UNPAID_LEAVE: 2,
  SICK_LEAVE: 3,
}

export const LEAVE_TYPE_OPTIONS = [
  { label: 'annual leave', value: LEAVE_TYPE.ANNUAL_LEAVE },
  { label: 'unpaid leave', value: LEAVE_TYPE.UNPAID_LEAVE },
  { label: 'sick leave', value: LEAVE_TYPE.SICK_LEAVE },
]

export const LEAVE_TYPE_MAP: StatusConfigMap = {
  [LEAVE_TYPE.ANNUAL_LEAVE]: {
    label: 'annual leave',
    value: LEAVE_TYPE.ANNUAL_LEAVE,
    color: 'primary',
    containerColor: 'primaryContainer',
  },
  [LEAVE_TYPE.UNPAID_LEAVE]: {
    label: 'unpaid leave',
    value: LEAVE_TYPE.UNPAID_LEAVE,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  [LEAVE_TYPE.SICK_LEAVE]: {
    label: 'sick leave',
    value: LEAVE_TYPE.SICK_LEAVE,
    color: 'error',
    containerColor: 'errorContainer',
  },
}

// export const LEAVE_TYPE = {
//   PERSONAL_BUSINESS: 1,
//   SICK_LEAVE: 2,
//   WORK_ACCIDENT_LEAVE: 3,
//   ANNUAL_LEAVE: 4,
//   MARRIAGE_LEAVE: 5,
//   MATERNITY_LEAVE: 6,
//   BEREAVEMENT_LEAVE: 7,
//   BUSINESS_TRIP: 8,
//   LATE_ARRIVAL: 9,
//   EARLY_DEPARTURE: 10,
//   UNAUTHORIZED_ABSENCE: 11,
//   COMPENSATORY_LEAVE: 12,
//   MILITARY_HEALTH_CHECK: 13,
//   EARLY_MATERNITY_LEAVE: 15,
//   SPECIAL_LEAVE: 16,
//   OTHER: 98,
//   LONG_TERM_LEAVE: 99,
// }

// export const LEAVE_TYPE_OPTIONS = [
//   { label: 'personal business', value: LEAVE_TYPE.PERSONAL_BUSINESS },
//   { label: 'sick leave', value: LEAVE_TYPE.SICK_LEAVE },
//   { label: 'work accident leave', value: LEAVE_TYPE.WORK_ACCIDENT_LEAVE },
//   { label: 'annual leave', value: LEAVE_TYPE.ANNUAL_LEAVE },
//   { label: 'marriage leave', value: LEAVE_TYPE.MARRIAGE_LEAVE },
//   { label: 'maternity leave', value: LEAVE_TYPE.MATERNITY_LEAVE },
//   { label: 'bereavement leave', value: LEAVE_TYPE.BEREAVEMENT_LEAVE },
//   { label: 'business trip', value: LEAVE_TYPE.BUSINESS_TRIP },
//   { label: 'late arrival', value: LEAVE_TYPE.LATE_ARRIVAL },
//   { label: 'early departure', value: LEAVE_TYPE.EARLY_DEPARTURE },
//   { label: 'unauthorized absence', value: LEAVE_TYPE.UNAUTHORIZED_ABSENCE },
//   { label: 'compensatory leave', value: LEAVE_TYPE.COMPENSATORY_LEAVE },
//   { label: 'military health check', value: LEAVE_TYPE.MILITARY_HEALTH_CHECK },
//   { label: 'early maternity leave', value: LEAVE_TYPE.EARLY_MATERNITY_LEAVE },
//   { label: 'special leave', value: LEAVE_TYPE.SPECIAL_LEAVE },
//   { label: 'other', value: LEAVE_TYPE.OTHER },
//   { label: 'long term leave', value: LEAVE_TYPE.LONG_TERM_LEAVE },
// ]

// export const LEAVE_TYPE_MAP: StatusConfigMap = {
//   [LEAVE_TYPE.PERSONAL_BUSINESS]: {
//     label: 'personal business',
//     value: LEAVE_TYPE.PERSONAL_BUSINESS,
//     color: '#2563EB',   
//     containerColor: '#DBEAFE',
//   },
//   [LEAVE_TYPE.SICK_LEAVE]: {
//     label: 'sick leave',
//     value: LEAVE_TYPE.SICK_LEAVE,
//     color: '#DC2626', 
//     containerColor: '#FEE2E2',
//   },
//   [LEAVE_TYPE.WORK_ACCIDENT_LEAVE]: {
//     label: 'work accident leave',
//     value: LEAVE_TYPE.WORK_ACCIDENT_LEAVE,
//     color: '#B45309',  
//     containerColor: '#FEF3C7',
//   },
//   [LEAVE_TYPE.ANNUAL_LEAVE]: {
//     label: 'annual leave',
//     value: LEAVE_TYPE.ANNUAL_LEAVE,
//     color: '#16A34A',   
//     containerColor: '#DCFCE7',
//   },
//   [LEAVE_TYPE.MARRIAGE_LEAVE]: {
//     label: 'marriage leave',
//     value: LEAVE_TYPE.MARRIAGE_LEAVE,
//     color: '#DB2777',   
//     containerColor: '#FCE7F3',
//   },
//   [LEAVE_TYPE.MATERNITY_LEAVE]: {
//     label: 'maternity leave',
//     value: LEAVE_TYPE.MATERNITY_LEAVE,
//     color: '#EC4899',
//     containerColor: '#FCE7F3',
//   },
//   [LEAVE_TYPE.BEREAVEMENT_LEAVE]: {
//     label: 'bereavement leave',
//     value: LEAVE_TYPE.BEREAVEMENT_LEAVE,
//     color: '#4B5563',
//     containerColor: '#E5E7EB',
//   },
//   [LEAVE_TYPE.BUSINESS_TRIP]: {
//     label: 'business trip',
//     value: LEAVE_TYPE.BUSINESS_TRIP,
//     color: '#0EA5E9',
//     containerColor: '#E0F2FE',
//   },
//   [LEAVE_TYPE.LATE_ARRIVAL]: {
//     label: 'late arrival',
//     value: LEAVE_TYPE.LATE_ARRIVAL,
//     color: '#F59E0B',
//     containerColor: '#FEF3C7',
//   },
//   [LEAVE_TYPE.EARLY_DEPARTURE]: {
//     label: 'early departure',
//     value: LEAVE_TYPE.EARLY_DEPARTURE,
//     color: '#8B5CF6',
//     containerColor: '#EDE9FE',
//   },
//   [LEAVE_TYPE.UNAUTHORIZED_ABSENCE]: {
//     label: 'unauthorized absence',
//     value: LEAVE_TYPE.UNAUTHORIZED_ABSENCE,
//     color: '#7C2D12',
//     containerColor: '#FED7AA',
//   },
//   [LEAVE_TYPE.COMPENSATORY_LEAVE]: {
//     label: 'compensatory leave',
//     value: LEAVE_TYPE.COMPENSATORY_LEAVE,
//     color: '#06B6D4',
//     containerColor: '#CFFAFE',
//   },
//   [LEAVE_TYPE.MILITARY_HEALTH_CHECK]: {
//     label: 'military health check',
//     value: LEAVE_TYPE.MILITARY_HEALTH_CHECK,
//     color: '#65A30D',
//     containerColor: '#ECFCCB',
//   },
//   [LEAVE_TYPE.EARLY_MATERNITY_LEAVE]: {
//     label: 'early maternity leave',
//     value: LEAVE_TYPE.EARLY_MATERNITY_LEAVE,
//     color: '#14B8A6',
//     containerColor: '#CCFBF1',
//   },
//   [LEAVE_TYPE.SPECIAL_LEAVE]: {
//     label: 'special leave',
//     value: LEAVE_TYPE.SPECIAL_LEAVE,
//     color: '#FACC15',
//     containerColor: '#FEF9C3',
//   },
//   [LEAVE_TYPE.OTHER]: {
//     label: 'other',
//     value: LEAVE_TYPE.OTHER,
//     color: '#6B7280',
//     containerColor: '#F3F4F6',
//   },
//   [LEAVE_TYPE.LONG_TERM_LEAVE]: {
//     label: 'long term leave',
//     value: LEAVE_TYPE.LONG_TERM_LEAVE,
//     color: '#111827',
//     containerColor: '#E5E7EB',
//   },
// }


export const OVERTIME_TYPE = {
  REGULAR: 1,
  NIGHT_SHIFT: 2,
  WEEKEND: 3,
  HOLIDAY: 4,
}

export const LEAVE_DURATION = {
  FULL_DAY: 'full_day',
  HALF_DAY: 'half_day',
  PARTIAL: 'partial',
}

export const LEAVE_DURATION_MAP: StatusConfigMap = {
  [LEAVE_DURATION.FULL_DAY]: {
    label: 'full day',
    value: LEAVE_DURATION.FULL_DAY,
    color: 'primary',
    containerColor: 'primaryContainer',
  },
  [LEAVE_DURATION.HALF_DAY]: {
    label: 'half day',
    value: LEAVE_DURATION.HALF_DAY,
    color: 'tertiary',
    containerColor: 'tertiaryContainer',
  },
  [LEAVE_DURATION.PARTIAL]: {
    label: 'partial',
    value: LEAVE_DURATION.PARTIAL,
    color: 'secondary',
    containerColor: 'secondaryContainer',
  },
}

export const LEAVE_QUICK_TIME_RANGE_MAP: StatusConfigMap = {
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
  'next_month': {
    label: 'next month',
    value: 'next_month',
    color: 'warning',
    containerColor: 'warningContainer',
  },
}