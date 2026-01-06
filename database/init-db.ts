import * as SQLite from 'expo-sqlite'

let db: SQLite.SQLiteDatabase | null = null

export const initDatabase = async () => {
  if (db) return db

  db = await SQLite.openDatabaseAsync('sample.db')

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL
    );
  `)

  return db
}

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}
