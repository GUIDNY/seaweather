import { jwtVerify, SignJWT } from 'jose';
import { sql } from '@vercel/postgres';

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

export async function signToken(appleSub, userId) {
  return new SignJWT({ sub: appleSub, uid: userId })
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

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      apple_sub   TEXT UNIQUE NOT NULL,
      email       TEXT,
      name        TEXT,
      saved_ids   TEXT[]  DEFAULT '{}',
      spot_id     TEXT    DEFAULT 'netanya',
      metric      BOOLEAN DEFAULT true,
      alerts_on   BOOLEAN DEFAULT false,
      alert_h     NUMERIC DEFAULT 0.8,
      alert_start TEXT    DEFAULT '06:00',
      alert_end   TEXT    DEFAULT '20:00',
      alert_spot  TEXT    DEFAULT 'netanya',
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export function safeUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    savedIds: u.saved_ids ?? [],
    spotId: u.spot_id,
    metric: u.metric,
    alertsOn: u.alerts_on,
    alertH: parseFloat(u.alert_h),
    alertStart: u.alert_start,
    alertEnd: u.alert_end,
    alertSpot: u.alert_spot,
  };
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}
