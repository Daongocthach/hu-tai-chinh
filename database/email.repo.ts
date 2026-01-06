import { EmailItem } from '@/lib/types/logic.type'
import { getDb } from './init-db'

export const EmailRepo = {
  async getAll(): Promise<EmailItem[]> {
    const db = await getDb()
    return db.getAllAsync<EmailItem>(
      'SELECT * FROM emails ORDER BY id DESC'
    )
  },

  async insert(email: string) {
    const db = await getDb()
    await db.runAsync(
      'INSERT INTO emails (email) VALUES (?);',
      [email]
    )
  },
}
