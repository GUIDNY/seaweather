import { list } from '@vercel/blob';
import { verifyToken, cors } from '../_lib/auth.js';

const ADMIN_SUB = 'email:bd12123@gmail.com';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const payload = await verifyToken(req);
    if (payload.sub !== ADMIN_SUB) return res.status(403).json({ error: 'Forbidden' });

    // List all user blobs
    const { blobs } = await list({
      prefix: 'users/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const users = await Promise.all(blobs.map(async b => {
      try {
        const u = await fetch(b.url).then(r => r.json());
        return {
          email: u.email || '—',
          name: u.name || null,
          spotId: u.spotId || null,
          createdAt: u.createdAt || null,
        };
      } catch { return null; }
    }));

    res.status(200).json({
      total: blobs.length,
      users: users
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    });
  } catch(e) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
