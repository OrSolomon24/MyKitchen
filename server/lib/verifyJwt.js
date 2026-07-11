const { jwtVerify, createRemoteJWKSet, createSecretKey, decodeProtectedHeader } = require('jose');

// Supabase projects sign access tokens with either the legacy shared HS256
// secret or, on newer/migrated projects, an asymmetric key exposed via a
// JWKS endpoint. Detect which one a given token uses from its header and
// verify it locally either way -- this avoids the network round-trip to
// supabase.auth.getUser() that used to happen on every single request.
let remoteJWKS = null;
function getRemoteJWKS() {
  if (!remoteJWKS) {
    remoteJWKS = createRemoteJWKSet(new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`));
  }
  return remoteJWKS;
}

let secretKey = null;
function getSecretKey() {
  if (!secretKey) {
    if (!process.env.SUPABASE_JWT_SECRET) {
      throw new Error('SUPABASE_JWT_SECRET is not set (required to verify legacy HS256 tokens)');
    }
    secretKey = createSecretKey(Buffer.from(process.env.SUPABASE_JWT_SECRET, 'utf-8'));
  }
  return secretKey;
}

async function verifySupabaseJwt(token) {
  const { alg } = decodeProtectedHeader(token);
  const key = alg && alg.startsWith('HS') ? getSecretKey() : getRemoteJWKS();
  const { payload } = await jwtVerify(token, key, { algorithms: [alg] });

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

module.exports = { verifySupabaseJwt };
