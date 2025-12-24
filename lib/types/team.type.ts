import { User } from "./user.type"

export type Team = {
  created_by: User
  created: string
  id: number
  users: User[]
  modified: string
  name: string
}