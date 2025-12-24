import { User } from "./user.type"

export type Department = {
  created_by: User
  created: string
  id: number
  members: User[]
  modified: string
  name: string
}