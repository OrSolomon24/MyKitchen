// jose v6 ships ESM-only, but the rest of this codebase is CommonJS -- load
// it lazily via dynamic import() (works from CJS) instead of require().
let josePromise = null;
function getJose() {
  if (!josePromise) {
    josePromise = import('jose');
  }
  return josePromise;
}

// Supabase projects sign access tokens with either the legacy shared HS256
// secret or, on newer/migrated projects, an asymmetric key exposed via a
// JWKS endpoint. Detect which one a given token uses from its header and
// verify it locally either way -- this avoids the network round-trip to
// supabase.auth.getUser() that used to happen on every single request.
let remoteJWKS = null;
function getRemoteJWKS(createRemoteJWKSet) {
  if (!remoteJWKS) {
    remoteJWKS = createRemoteJWKSet(new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`));
  }
  return remoteJWKS;
}

let secretKey = null;
function getSecretKey(createSecretKey) {
  if (!secretKey) {
    if (!process.env.SUPABASE_JWT_SECRET) {
      throw new Error('SUPABASE_JWT_SECRET is not set (required to verify legacy HS256 tokens)');
    }
    secretKey = createSecretKey(Buffer.from(process.env.SUPABASE_JWT_SECRET, 'utf-8'));
  }
  return secretKey;
}

async function verifySupabaseJwt(token) {
  const { jwtVerify, createRemoteJWKSet, createSecretKey, decodeProtectedHeader } = await getJose();
  const { alg } = decodeProtectedHeader(token);
  const key = alg && alg.startsWith('HS') ? getSecretKey(createSecretKey) : getRemoteJWKS(createRemoteJWKSet);
  const { payload } = await jwtVerify(token, key, { algorithms: [alg] });

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

module.exports = { verifySupabaseJwt };
