import { jwtVerify, SignJWT } from 'jose';
import { put, head, del } from '@vercel/blob';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);
const BUNDLE_ID = 'com.surfy.israel';
const TOKEN_TTL = '90d';

export async function verifyAppleToken(identityToken) {
  const { createRemoteJWKSet } = await import('jose');
  const JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
  const { payload } = await jwtVerify(identityToken, JWKS, {
    issuer: 'https://appleid.apple.com',
    audience: BUNDLE_ID,
  });
  return payload;
}

export async function signToken(appleSub) {
  return new SignJWT({ sub: appleSub })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secret());
}

export async function verifyToken(req) {
  const header = req.headers['authorization'] || '';
  if (!header.startsWith('Bearer ')) throw new Error('No token');
  const { payload } = await jwtVerify(header.slice(7), secret());
  return payload;
}

// Blob key for a user
const userKey = sub => `users/${sub.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;

export async function getUser(sub) {
  try {
    const key = userKey(sub);
    const info = await head(key, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!info) return null;
    const res = await fetch(info.url);
    return await res.json();
  } catch {
    return null;
  }
}

export async function putUser(sub, data) {
  const key = userKey(sub);
  const blob = await put(key, JSON.stringify(data), {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: 'application/json',
    addRandomSuffix: false,
  });
  return blob;
}

export async function deleteUser(sub) {
  const key = userKey(sub);
  try {
    const info = await head(key, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (info) await del(info.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch { /* already gone */ }
}

export function defaultUser(sub, email, name) {
  return {
    sub,
    email: email || null,
    name: name || null,
    savedIds: [],
    spotId: 'netanya',
    metric: true,
    alertsOn: false,
    alertH: 0.8,
    alertStart: '06:00',
    alertEnd: '20:00',
    alertSpot: 'netanya',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function safeUser(u) {
  return {
    name: u.name,
    email: u.email,
    savedIds: u.savedIds ?? [],
    spotId: u.spotId,
    metric: u.metric,
    alertsOn: u.alertsOn,
    alertH: u.alertH,
    alertStart: u.alertStart,
    alertEnd: u.alertEnd,
    alertSpot: u.alertSpot,
  };
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}
