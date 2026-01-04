import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

type EmailItem = {
  id: number
  email: string
}

export default function Email() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null)
  const [emails, setEmails] = useState<EmailItem[]>([])

  useEffect(() => {
    initDb()
  }, [])

  const initDb = async () => {
    const database = await SQLite.openDatabaseAsync('sample.db')

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL
      );
    `)

    setDb(database)
    fetchEmails(database)
  }

  const fetchEmails = async (database = db) => {
    if (!database) return
    const rows = await database.getAllAsync<EmailItem>(
      'SELECT * FROM emails ORDER BY id DESC;'
    )
    setEmails(rows)
  }

  const addEmail = async () => {
    if (!db) return
    await db.runAsync(
      'INSERT INTO emails (email) VALUES (?);',
      [`user${Date.now()}@example.com`]
    )
    fetchEmails()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SQLite Sample (Email)</Text>

      <Button title="Add Email" onPress={addEmail} />

      {emails.map(item => (
        <Text key={item.id} style={styles.item}>
          {item.email}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  item: {
    paddingVertical: 4,
  },
})
