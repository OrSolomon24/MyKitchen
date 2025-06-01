// utils/cache.js

const cache = new Map();

function setCache(key, data, ttlInMs) {
  const expires = Date.now() + ttlInMs;
  cache.set(key, { data, expires });
  console.log(`✅ [CACHE] Set "${key}" (expires in ${Math.floor(ttlInMs / 1000)}s)`);
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) {
    console.log(`🔍 [CACHE] MISS "${key}"`);
    return null;
  }

  if (Date.now() > entry.expires) {
    cache.delete(key);
    console.log(`⌛ [CACHE] EXPIRED "${key}"`);
    return null;
  }

  console.log(`💾 [CACHE] HIT "${key}"`);
  return entry.data;
}

function clearCache(key) {
  cache.delete(key);
  console.log(`🗑️ [CACHE] Cleared "${key}"`);
}

function clearAllCache() {
  cache.clear();
  console.log(`🧹 [CACHE] Cleared ALL`);
}

module.exports = {
  setCache,
  getCache,
  clearCache,
  clearAllCache,
};
