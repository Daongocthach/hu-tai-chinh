import { EmailRepo } from '@/database/email.repo'
import { EmailItem } from '@/lib/types/logic.type'
import { useEffect, useState } from 'react'

export const useEmails = () => {
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setEmails(await EmailRepo.getAll())
    setLoading(false)
  }

  const add = async (email: string) => {
    await EmailRepo.insert(email)
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return { emails, add, loading, refresh: load }
}
