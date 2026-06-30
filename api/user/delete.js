// Apple App Store REQUIREMENT: apps must allow users to delete their account.
// This endpoint permanently removes all user data.
import { sql } from '@vercel/postgres';
import { verifyToken, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).end();

  let payload;
  try { payload = await verifyToken(req); }
  catch { return res.status(401).json({ error: 'Unauthorized' }); }

  await sql`DELETE FROM users WHERE apple_sub = ${payload.sub}`;
  res.json({ ok: true, message: 'Account and all data permanently deleted.' });
}
