// Import dotenv to load environment variables
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import type { Config } from '@libsql/client';

// Load environment variables from .env file
dotenv.config();

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

// Mock database for development when environment variables are not set
const createMockDb = () => {
  let mockData: Interest[] = [];
  let nextId = 1;

  return {
    execute: async (query: any) => {
      // Mock implementation for development
      if (query.sql?.includes('CREATE TABLE')) {
        // Table creation - no-op in mock
        return { rows: [], rowsAffected: 0, lastInsertRowid: 0 };
      }
      
      if (query.sql?.includes('SELECT * FROM interests')) {
        // Get all interests
        return { rows: mockData, rowsAffected: 0, lastInsertRowid: 0 };
      }
      
      if (query.sql?.includes('SELECT SUM(textbox3)')) {
        // Sum of textbox3
        const sum = mockData.reduce((acc, item) => acc + item.textbox3, 0);
        return { rows: [{ sum }], rowsAffected: 0, lastInsertRowid: 0 };
      }
      
      if (query.sql?.includes('SELECT SUM(textbox4)')) {
        // Sum of textbox4
        const sum = mockData.reduce((acc, item) => acc + item.textbox4, 0);
        return { rows: [{ sum }], rowsAffected: 0, lastInsertRowid: 0 };
      }
      
      if (query.sql?.includes('INSERT')) {
        // Insert new interest
        const newInterest: Interest = {
          id: nextId++,
          textbox1: query.args[0],
          textbox2: query.args[1],
          textbox3: query.args[2],
          textbox4: query.args[3],
          textbox5: query.args[4],
          created_at: new Date().toISOString()
        };
        mockData.push(newInterest);
        return { rows: [], rowsAffected: 1, lastInsertRowid: newInterest.id };
      }
      
      if (query.sql?.includes('UPDATE')) {
        // Update interest
        const id = query.args[5];
        const index = mockData.findIndex(item => item.id === id);
        if (index !== -1) {
          mockData[index] = {
            ...mockData[index],
            textbox1: query.args[0],
            textbox2: query.args[1],
            textbox3: query.args[2],
            textbox4: query.args[3],
            textbox5: query.args[4]
          };
          return { rows: [], rowsAffected: 1, lastInsertRowid: 0 };
        }
        return { rows: [], rowsAffected: 0, lastInsertRowid: 0 };
      }
      
      if (query.sql?.includes('DELETE')) {
        // Delete interest
        const id = query.args[0];
        const initialLength = mockData.length;
        mockData = mockData.filter(item => item.id !== id);
        return { rows: [], rowsAffected: initialLength - mockData.length, lastInsertRowid: 0 };
      }
      
      if (query.sql?.includes('SELECT * FROM interests WHERE id')) {
        // Get interest by ID
        const id = query.args[0];
        const interest = mockData.find(item => item.id === id);
        return { rows: interest ? [interest] : [], rowsAffected: 0, lastInsertRowid: 0 };
      }
      
      return { rows: [], rowsAffected: 0, lastInsertRowid: 0 };
    }
  };
};

// Initialize database client
let db: any;

// Check if required environment variables are set
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

console.log('=== DATABASE INITIALIZATION ===');
console.log('Environment variables check:');
console.log('TURSO_DATABASE_URL:', tursoUrl ? 'SET' : 'NOT SET');
console.log('TURSO_AUTH_TOKEN:', tursoAuthToken ? 'SET' : 'NOT SET');

if (tursoUrl && tursoAuthToken) {
  console.log('Using Turso database');
  // Use Turso database
  const config: Config = {
    url: tursoUrl,
    authToken: tursoAuthToken,
  };
  
  db = createClient(config);
  
  // Initialize the database with the required table
  try {
    console.log('Creating/verifying table structure...');
    await db.execute(`
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
    console.log('Table structure verified');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Failed to initialize database');
  }
} else {
  // Use mock database for development
  console.log('Using mock database');
  console.warn('TURSO_DATABASE_URL and/or TURSO_AUTH_TOKEN not set. Using mock database.');
  db = createMockDb();
}

console.log('=== DATABASE INITIALIZATION COMPLETE ===');

// Database operations
export const createInterest = async (interest: Omit<Interest, 'id' | 'created_at'>): Promise<number> => {
  try {
    const result = await db.execute({
      sql: `INSERT INTO interests (textbox1, textbox2, textbox3, textbox4, textbox5) VALUES (?, ?, ?, ?, ?)`,
      args: [interest.textbox1, interest.textbox2, interest.textbox3, interest.textbox4, interest.textbox5]
    });
    return Number(result.lastInsertRowid);
  } catch (error) {
    console.error('Error creating interest:', error);
    throw new Error('Failed to create interest');
  }
};

export const getAllInterests = async (): Promise<Interest[]> => {
  try {
    const result = await db.execute('SELECT * FROM interests ORDER BY created_at DESC');
    return result.rows.map((row: any) => ({
      id: row.id as number,
      textbox1: row.textbox1 as string,
      textbox2: row.textbox2 as string,
      textbox3: row.textbox3 as number,
      textbox4: row.textbox4 as number,
      textbox5: row.textbox5 as string,
      created_at: row.created_at as string
    }));
  } catch (error) {
    console.error('Error fetching interests:', error);
    throw new Error('Failed to fetch interests');
  }
};

export const getInterestById = async (id: number): Promise<Interest | null> => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM interests WHERE id = ?',
      args: [id]
    });
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id as number,
      textbox1: row.textbox1 as string,
      textbox2: row.textbox2 as string,
      textbox3: row.textbox3 as number,
      textbox4: row.textbox4 as number,
      textbox5: row.textbox5 as string,
      created_at: row.created_at as string
    };
  } catch (error) {
    console.error('Error fetching interest:', error);
    throw new Error('Failed to fetch interest');
  }
};

export const updateInterest = async (id: number, interest: Omit<Interest, 'id' | 'created_at'>): Promise<number> => {
  try {
    const result = await db.execute({
      sql: `UPDATE interests SET textbox1 = ?, textbox2 = ?, textbox3 = ?, textbox4 = ?, textbox5 = ? WHERE id = ?`,
      args: [interest.textbox1, interest.textbox2, interest.textbox3, interest.textbox4, interest.textbox5, id]
    });
    return result.rowsAffected;
  } catch (error) {
    console.error('Error updating interest:', error);
    throw new Error('Failed to update interest');
  }
};

export const deleteInterest = async (id: number): Promise<number> => {
  try {
    const result = await db.execute({
      sql: 'DELETE FROM interests WHERE id = ?',
      args: [id]
    });
    return result.rowsAffected;
  } catch (error) {
    console.error('Error deleting interest:', error);
    throw new Error('Failed to delete interest');
  }
};

export const getSumOfTextbox3 = async (): Promise<number> => {
  try {
    const result = await db.execute('SELECT SUM(textbox3) as sum FROM interests');
    if (result.rows.length === 0 || result.rows[0].sum === null) {
      return 0;
    }
    return result.rows[0].sum as number;
  } catch (error) {
    console.error('Error calculating sum of textbox3:', error);
    throw new Error('Failed to calculate sum of textbox3');
  }
};

export const getSumOfTextbox4 = async (): Promise<number> => {
  try {
    const result = await db.execute('SELECT SUM(textbox4) as sum FROM interests');
    if (result.rows.length === 0 || result.rows[0].sum === null) {
      return 0;
    }
    return result.rows[0].sum as number;
  } catch (error) {
    console.error('Error calculating sum of textbox4:', error);
    throw new Error('Failed to calculate sum of textbox4');
  }
};

export default db;