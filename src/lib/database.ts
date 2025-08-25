import Database from 'better-sqlite3';
import { join } from 'path';
import { cwd } from 'process';

// Create or connect to the database
const dbPath = join(cwd(), 'interests.db');
const db = new Database(dbPath);

// Initialize the database with the required table
db.exec(`
  CREATE TABLE IF NOT EXISTS interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    textbox1 TEXT,
    textbox2 TEXT,
    textbox3 REAL,
    textbox4 REAL,
    textbox5 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Define the Interest type
export interface Interest {
  id?: number;
  textbox1: string;
  textbox2: string;
  textbox3: number;
  textbox4: number;
  textbox5: string;
  created_at?: string;
}

// Database operations
export const createInterest = (interest: Omit<Interest, 'id' | 'created_at'>): number => {
  const stmt = db.prepare(`
    INSERT INTO interests (textbox1, textbox2, textbox3, textbox4, textbox5)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(interest.textbox1, interest.textbox2, interest.textbox3, interest.textbox4, interest.textbox5);
  return result.lastInsertRowid as number;
};

export const getAllInterests = (): Interest[] => {
  const stmt = db.prepare('SELECT * FROM interests ORDER BY created_at DESC');
  return stmt.all() as Interest[];
};

export const getInterestById = (id: number): Interest | undefined => {
  const stmt = db.prepare('SELECT * FROM interests WHERE id = ?');
  return stmt.get(id) as Interest | undefined;
};

export const updateInterest = (id: number, interest: Omit<Interest, 'id' | 'created_at'>): number => {
  const stmt = db.prepare(`
    UPDATE interests
    SET textbox1 = ?, textbox2 = ?, textbox3 = ?, textbox4 = ?, textbox5 = ?
    WHERE id = ?
  `);
  const result = stmt.run(interest.textbox1, interest.textbox2, interest.textbox3, interest.textbox4, interest.textbox5, id);
  return result.changes;
};

export const deleteInterest = (id: number): number => {
  const stmt = db.prepare('DELETE FROM interests WHERE id = ?');
  const result = stmt.run(id);
  return result.changes;
};

export const getSumOfTextbox3 = (): number => {
  const stmt = db.prepare('SELECT SUM(textbox3) as sum FROM interests');
  const result = stmt.get() as { sum: number };
  return result.sum || 0;
};

export const getSumOfTextbox4 = (): number => {
  const stmt = db.prepare('SELECT SUM(textbox4) as sum FROM interests');
  const result = stmt.get() as { sum: number };
  return result.sum || 0;
};

export default db;