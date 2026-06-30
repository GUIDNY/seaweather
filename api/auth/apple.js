import { verifyAppleToken, signToken, getUser, putUser, defaultUser, safeUser, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { identityToken, userInfo } = req.body;
  if (!identityToken) return res.status(400).json({ error: 'identityToken required' });

  try {
    const payload = await verifyAppleToken(identityToken);
    const sub = payload.sub;
    const email = payload.email || userInfo?.email || null;
    const name = userInfo?.name
      ? `${userInfo.name.firstName ?? ''} ${userInfo.name.lastName ?? ''}`.trim() || null
      : null;

    // Upsert user in blob storage
    let user = await getUser(sub);
    if (!user) {
      user = defaultUser(sub, email, name);
    } else {
      user.email = email || user.email;
      user.name = name || user.name;
      user.updatedAt = new Date().toISOString();
    }
    await putUser(sub, user);

    const token = await signToken(sub);
    res.status(200).json({ token, user: safeUser(user) });
  } catch (e) {
    console.error('Apple auth error:', e);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
