import Database from 'better-sqlite3';
import path from 'node:path';

const dbFile = path.resolve(process.cwd(), 'data', 'nordic-verse.db');
const db = new Database(dbFile);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      displayName TEXT NOT NULL,
      avatarUrl TEXT,
      bio TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS maps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      json TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      mapId INTEGER NOT NULL,
      score INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(mapId) REFERENCES maps(id)
    );

    CREATE TABLE IF NOT EXISTS friendships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      friendId INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'accepted',
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(friendId) REFERENCES users(id)
    );
  `);
}

export function createUser(email: string, passwordHash: string, role = 'user') {
  const stmt = db.prepare(`INSERT INTO users (email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?)`);
  const result = stmt.run(email, passwordHash, role, new Date().toISOString());
  return result.lastInsertRowid as number;
}

export function getUserByEmail(email: string) {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email);
}

export function getUserById(id: number) {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(id);
}

export function createProfile(userId: number, displayName: string, avatarUrl = '', bio = '') {
  const stmt = db.prepare(`INSERT INTO profiles (userId, displayName, avatarUrl, bio, createdAt) VALUES (?, ?, ?, ?, ?)`);
  const result = stmt.run(userId, displayName, avatarUrl, bio, new Date().toISOString());
  return result.lastInsertRowid as number;
}

export function getProfileByUserId(userId: number) {
  const stmt = db.prepare(`SELECT * FROM profiles WHERE userId = ?`);
  return stmt.get(userId);
}

export function getAllProfiles() {
  const stmt = db.prepare(`SELECT u.id as userId, u.email, p.displayName, p.avatarUrl, p.bio FROM users u LEFT JOIN profiles p ON u.id = p.userId`);
  return stmt.all();
}
