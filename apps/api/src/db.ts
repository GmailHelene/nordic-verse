import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import fs from 'node:fs';
import path from 'node:path';

type User = {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
};

type Profile = {
  id: number;
  userId: number;
  displayName: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
};

type MapItem = {
  id: number;
  userId: number;
  name: string;
  json: string;
  createdAt: string;
};

type Score = {
  id: number;
  userId: number;
  mapId: number;
  score: number;
  createdAt: string;
};

type Friendship = {
  id: number;
  userId: number;
  friendId: number;
  status: string;
  createdAt: string;
};

type Data = {
  users: User[];
  profiles: Profile[];
  maps: MapItem[];
  scores: Score[];
  friendships: Friendship[];
  lastId: number;
};

const dbFile = path.resolve(process.cwd(), 'data', 'db.json');
const dbDir = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const adapter = new JSONFileSync<Data>(dbFile);
const db = new LowSync<Data>(adapter);

db.read();
if (!db.data) {
  db.data = {
    users: [],
    profiles: [],
    maps: [],
    scores: [],
    friendships: [],
    lastId: 1
  };
  db.write();
}

export function initDb() {
  if (!db.data) {
    db.data = {
      users: [],
      profiles: [],
      maps: [],
      scores: [],
      friendships: [],
      lastId: 1
    };
    db.write();
  }
}

export function createUser(email: string, passwordHash: string, role = 'user') {
  const id = db.data!.lastId++;
  db.data!.users.push({ id, email, passwordHash, role, createdAt: new Date().toISOString() });
  db.write();
  return id;
}

export function getUserByEmail(email: string) {
  return db.data!.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: number) {
  return db.data!.users.find((user) => user.id === id);
}

export function createProfile(userId: number, displayName: string, avatarUrl = '', bio = '') {
  const id = db.data!.lastId++;
  db.data!.profiles.push({ id, userId, displayName, avatarUrl, bio, createdAt: new Date().toISOString() });
  db.write();
  return id;
}

export function getProfileByUserId(userId: number) {
  return db.data!.profiles.find((profile) => profile.userId === userId);
}

export function updateProfile(userId: number, updates: Partial<Pick<Profile, 'displayName' | 'avatarUrl' | 'bio'>>) {
  const profile = db.data!.profiles.find((item) => item.userId === userId);
  if (!profile) return null;
  if (updates.displayName !== undefined) profile.displayName = updates.displayName;
  if (updates.avatarUrl !== undefined) profile.avatarUrl = updates.avatarUrl;
  if (updates.bio !== undefined) profile.bio = updates.bio;
  db.write();
  return profile;
}

export function createScore(userId: number, mapId: number, score: number) {
  const id = db.data!.lastId++;
  db.data!.scores.push({ id, userId, mapId, score, createdAt: new Date().toISOString() });
  db.write();
  return id;
}

export function getScoresByUser(userId: number) {
  return db.data!.scores
    .filter((item) => item.userId === userId)
    .sort((a, b) => a.score - b.score);
}

export function getLeaderboard(mapId: number, limit = 10) {
  return db.data!.scores
    .filter((item) => item.mapId === mapId)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

export function getAllProfiles() {
  return db.data!.users.map((user) => {
    const profile = db.data!.profiles.find((item) => item.userId === user.id);
    return {
      userId: user.id,
      email: user.email,
      displayName: profile?.displayName || '',
      avatarUrl: profile?.avatarUrl || '',
      bio: profile?.bio || ''
    };
  });
}
