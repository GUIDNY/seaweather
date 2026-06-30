import { sql } from '@vercel/postgres';
import { verifyToken, safeUser, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  let payload;
  try { payload = await verifyToken(req); }
  catch { return res.status(401).json({ error: 'Unauthorized' }); }

  // GET — fetch cloud settings
  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM users WHERE apple_sub = ${payload.sub}`;
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    return res.json(safeUser(rows[0]));
  }

  // PUT — push local settings to cloud
  if (req.method === 'PUT') {
    const { savedIds, spotId, metric, alertsOn, alertH, alertStart, alertEnd, alertSpot } = req.body;

    await sql`
      UPDATE users SET
        saved_ids   = COALESCE(${savedIds ? JSON.stringify(savedIds) : null}::text[]::text[], saved_ids),
        spot_id     = COALESCE(${spotId ?? null}, spot_id),
        metric      = COALESCE(${metric ?? null}, metric),
        alerts_on   = COALESCE(${alertsOn ?? null}, alerts_on),
        alert_h     = COALESCE(${alertH ?? null}, alert_h),
        alert_start = COALESCE(${alertStart ?? null}, alert_start),
        alert_end   = COALESCE(${alertEnd ?? null}, alert_end),
        alert_spot  = COALESCE(${alertSpot ?? null}, alert_spot),
        updated_at  = NOW()
      WHERE apple_sub = ${payload.sub}
    `;
    return res.json({ ok: true });
  }

  res.status(405).end();
}
