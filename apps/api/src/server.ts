import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb, createUser, getUserByEmail, createProfile, getProfileByUserId, getUserById, getAllProfiles } from './db.js';

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'nordic-local-secret';

initDb();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

app.post('/auth/register', (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Email, password and displayName are required.' });
  }

  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'E-post er allerede registrert.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = createUser(email, passwordHash);
  createProfile(userId, displayName, '', '');
  return res.status(201).json({ success: true, userId });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email og password kreves.' });
  }

  const user = getUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Ugyldig e-post eller passord.' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token });
});

app.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Manglende autorisasjon.' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    const user = getUserById(payload.userId);
    if (!user) {
      return res.status(404).json({ error: 'Bruker ikke funnet.' });
    }

    const profile = getProfileByUserId(user.id);
    return res.json({ user: { id: user.id, email: user.email, role: user.role }, profile });
  } catch (error) {
    return res.status(401).json({ error: 'Ugyldig eller utløpt token.' });
  }
});

app.get('/profiles', (req, res) => {
  const profiles = getAllProfiles();
  res.json({ profiles });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
