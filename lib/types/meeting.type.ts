import { User } from './user.type'

export type MeetingRoom = {
  id: number
  name: string
  address: string
  capacity: number
  wifi: boolean
  whiteboard: boolean
  projector: boolean
  television: string
  status: number
  created?: Date
  modified?: Date
  floor: {
    id: number
    name: string
    building: MeetingBuildingType
  }
  image: string
  calendar?: {
    date: string
    meetings: Meeting[]
  }[]
}
type UserWithConfirmed = User & { confirmed: boolean }

export interface Meeting {
  id: number
  title: string
  description: string
  meeting_date: Date
  start_time: string
  end_time: string
  meeting_type: number
  meeting_link: string
  status: number
  attachments: string
  meeting_room: MeetingRoom
  attended: UserWithConfirmed[]
  invited: UserWithConfirmed[]
  confirmed: UserWithConfirmed[]
  rejected: UserWithConfirmed[]
  organizer?: UserWithConfirmed
}

export interface MeetingBuildingType {
  id: number
  name: string
  image: string
  address: string
  floors: {
    id: number
    name: string
  }[]
}

export type CreateMeetingFormInputs = {
  title: string
  meeting_date: string
  start_time: string
  end_time: string
  meeting_type: number
  status: number
  meeting_room: number
  invited: number[]
  meeting_link: string | undefined
  conferencing: 'google_meet' | 'zoom' | undefined
}

export type MeetingRoomsFilterValues = {
  max_capacity: string
  date_selected: Date
  facilities: string[]
  start_time: Date
  end_time: Date
}

export type MeetingsOnlineFilterValues = {
  status: number
  date_start?: Date
  date_end?: Date
}

export type ListAttendFilterValues = {
  status: number
  progress: number[]
}