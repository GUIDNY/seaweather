import { sql } from '@vercel/postgres';
import { verifyAppleToken, signToken, initDb, safeUser, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { identityToken, userInfo } = req.body;
  if (!identityToken) return res.status(400).json({ error: 'identityToken required' });

  try {
    const payload = await verifyAppleToken(identityToken);
    const appleSub = payload.sub;
    const email = payload.email || userInfo?.email || null;
    const name = userInfo?.name
      ? `${userInfo.name.firstName ?? ''} ${userInfo.name.lastName ?? ''}`.trim() || null
      : null;

    await initDb();

    const { rows } = await sql`
      INSERT INTO users (apple_sub, email, name)
      VALUES (${appleSub}, ${email}, ${name})
      ON CONFLICT (apple_sub) DO UPDATE SET
        email      = COALESCE(EXCLUDED.email, users.email),
        name       = COALESCE(${name}::text, users.name),
        updated_at = NOW()
      RETURNING *
    `;

    const user = rows[0];
    const token = await signToken(appleSub, user.id);

    res.status(200).json({ token, user: safeUser(user) });
  } catch (e) {
    console.error('Apple auth error:', e);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
