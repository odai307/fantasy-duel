const { createClient } = require('redis');
const env = require('./config/env');

const store = new Map();
const inflight = new Map();
let redisClient = null;
let redisReady = false;

async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: env.redisUrl,
  });

  redisClient.on('error', (error) => {
    redisReady = false;
    console.error('[cache] redis error; falling back to in-memory cache', {
      message: error?.message || String(error),
    });
  });

  redisClient.on('ready', () => {
    redisReady = true;
    console.log('[cache] redis connected');
  });

  await redisClient.connect();
  redisReady = true;
  return redisClient;
}

function nowMs() {
  return Date.now();
}

function getMemory(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= nowMs()) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

function setMemory(key, value, ttlMs) {
  const safeTtlMs = Number(ttlMs);
  if (!Number.isFinite(safeTtlMs) || safeTtlMs <= 0) {
    return;
  }

  store.set(key, {
    value,
    expiresAt: nowMs() + safeTtlMs,
  });
}

async function getRedis(key) {
  try {
    const client = await getRedisClient();
    if (!client || !redisReady) {
      return null;
    }

    const value = await client.get(key);
    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

async function setRedis(key, value, ttlMs) {
  const safeTtlMs = Number(ttlMs);
  if (!Number.isFinite(safeTtlMs) || safeTtlMs <= 0) {
    return;
  }

  try {
    const client = await getRedisClient();
    if (!client || !redisReady) {
      return;
    }

    const ttlSeconds = Math.max(1, Math.ceil(safeTtlMs / 1000));
    await client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    // no-op; fallback cache remains available
  }
}

async function get(key) {
  const redisValue = await getRedis(key);
  if (redisValue !== null) {
    return redisValue;
  }

  return getMemory(key);
}

async function set(key, value, ttlMs) {
  setMemory(key, value, ttlMs);
  await setRedis(key, value, ttlMs);
}

async function getOrSet(key, ttlMs, producer) {
  const cached = await get(key);
  if (cached !== null) return cached;

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const pending = Promise.resolve()
    .then(producer)
    .then(async (value) => {
      await set(key, value, ttlMs);
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, pending);
  return pending;
}

module.exports = {
  get,
  set,
  getOrSet,
};
