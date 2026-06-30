import { verifyToken, deleteUser, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).end();

  let payload;
  try { payload = await verifyToken(req); }
  catch { return res.status(401).json({ error: 'Unauthorized' }); }

  await deleteUser(payload.sub);
  res.json({ ok: true, message: 'Account and all data permanently deleted.' });
}
