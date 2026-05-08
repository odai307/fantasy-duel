const store = new Map();
const inflight = new Map();

function nowMs() {
  return Date.now();
}

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= nowMs()) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

function set(key, value, ttlMs) {
  const safeTtlMs = Number(ttlMs);
  if (!Number.isFinite(safeTtlMs) || safeTtlMs <= 0) {
    return;
  }

  store.set(key, {
    value,
    expiresAt: nowMs() + safeTtlMs,
  });
}

async function getOrSet(key, ttlMs, producer) {
  const cached = get(key);
  if (cached !== null) return cached;

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const pending = Promise.resolve()
    .then(producer)
    .then((value) => {
      set(key, value, ttlMs);
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
