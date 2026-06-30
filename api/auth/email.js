import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { signToken, getUser, putUser, defaultUser, safeUser, cors } from '../_lib/auth.js';

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashBuf = Buffer.from(hash, 'hex');
  const derived = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuf, derived);
}

const emailSub = email => 'email:' + email.toLowerCase().trim();

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { action, email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'נדרש אימייל וסיסמה' });
  if (password.length < 8) return res.status(400).json({ error: 'הסיסמה חייבת להכיל לפחות 8 תווים' });

  const sub = emailSub(email);

  if (action === 'register') {
    const existing = await getUser(sub);
    if (existing && existing.passwordHash) return res.status(409).json({ error: 'כתובת האימייל כבר רשומה' });

    const user = defaultUser(sub, email.toLowerCase().trim(), name?.trim() || null);
    user.passwordHash = hashPassword(password);
    await putUser(sub, user);

    const token = await signToken(sub);
    return res.status(200).json({ token, user: safeUser(user) });
  }

  if (action === 'login') {
    const user = await getUser(sub);
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
    if (!verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });

    const token = await signToken(sub);
    return res.status(200).json({ token, user: safeUser(user) });
  }

  res.status(400).json({ error: 'action חייב להיות register או login' });
}
