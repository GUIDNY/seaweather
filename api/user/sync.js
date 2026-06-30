import { verifyToken, getUser, putUser, safeUser, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  let payload;
  try { payload = await verifyToken(req); }
  catch { return res.status(401).json({ error: 'Unauthorized' }); }

  if (req.method === 'GET') {
    const user = await getUser(payload.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(safeUser(user));
  }

  if (req.method === 'PUT') {
    const user = await getUser(payload.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { savedIds, spotId, metric, alertsOn, alertH, alertStart, alertEnd, alertSpot } = req.body;
    if (savedIds !== undefined) user.savedIds = savedIds;
    if (spotId !== undefined) user.spotId = spotId;
    if (metric !== undefined) user.metric = metric;
    if (alertsOn !== undefined) user.alertsOn = alertsOn;
    if (alertH !== undefined) user.alertH = alertH;
    if (alertStart !== undefined) user.alertStart = alertStart;
    if (alertEnd !== undefined) user.alertEnd = alertEnd;
    if (alertSpot !== undefined) user.alertSpot = alertSpot;
    user.updatedAt = new Date().toISOString();

    await putUser(payload.sub, user);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
