function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function ensureObject(value, context) {
  if (!isObject(value)) {
    throw contractError(`${context} must be an object`);
  }
  return value;
}

function ensureArray(value, context) {
  if (!Array.isArray(value)) {
    throw contractError(`${context} must be an array`);
  }
  return value;
}

function ensureString(value, context) {
  if (typeof value !== 'string') {
    throw contractError(`${context} must be a string`);
  }
  return value;
}

function ensureOptionalString(value, context) {
  if (value === null || value === undefined) return value;
  return ensureString(value, context);
}

function ensureNumber(value, context) {
  if (!Number.isFinite(Number(value))) {
    throw contractError(`${context} must be a finite number`);
  }
  return Number(value);
}

function ensureBoolean(value, context) {
  if (typeof value !== 'boolean') {
    throw contractError(`${context} must be a boolean`);
  }
  return value;
}

function ensurePagination(value, context = 'pagination') {
  const pagination = ensureObject(value, context);
  ensureNumber(pagination.page, `${context}.page`);
  ensureNumber(pagination.limit, `${context}.limit`);
  ensureNumber(pagination.total, `${context}.total`);
  ensureNumber(pagination.totalPages, `${context}.totalPages`);
  return pagination;
}

function ensureUserSummary(value, context = 'user') {
  const user = ensureObject(value, context);
  ensureString(user.id, `${context}.id`);
  ensureOptionalString(user.firstName, `${context}.firstName`);
  ensureOptionalString(user.lastName, `${context}.lastName`);
  return user;
}

function ensurePool(value, context = 'pool') {
  const pool = ensureObject(value, context);
  ensureString(pool.id, `${context}.id`);
  ensureString(pool.name, `${context}.name`);
  ensureNumber(pool.gameweek, `${context}.gameweek`);
  ensureNumber(pool.entryFee, `${context}.entryFee`);
  ensureOptionalString(pool.visibility, `${context}.visibility`);
  ensureOptionalString(pool.status, `${context}.status`);
  if (pool.createdBy !== null && pool.createdBy !== undefined) {
    ensureUserSummary(pool.createdBy, `${context}.createdBy`);
  }
  if (pool.participantCount !== null && pool.participantCount !== undefined) {
    ensureNumber(pool.participantCount, `${context}.participantCount`);
  }
  return pool;
}

function ensureDuel(value, context = 'duel') {
  const duel = ensureObject(value, context);
  ensureString(duel.id, `${context}.id`);
  ensureNumber(duel.gameweek, `${context}.gameweek`);
  ensureNumber(duel.entryFee, `${context}.entryFee`);
  ensureOptionalString(duel.status, `${context}.status`);
  if (duel.createdBy !== null && duel.createdBy !== undefined) {
    ensureUserSummary(duel.createdBy, `${context}.createdBy`);
  }
  if (duel.opponent !== null && duel.opponent !== undefined) {
    ensureUserSummary(duel.opponent, `${context}.opponent`);
  }
  return duel;
}

function ensurePoolLeaderboardEntry(value, context = 'leaderboard[]') {
  const entry = ensureObject(value, context);
  ensureNumber(entry.rank, `${context}.rank`);
  ensureNumber(entry.points, `${context}.points`);
  ensureNumber(entry.gameweekPoints, `${context}.gameweekPoints`);
  ensureBoolean(entry.isCurrentUser, `${context}.isCurrentUser`);
  ensureUserSummary(entry.user, `${context}.user`);
  return entry;
}

function contractError(message) {
  const error = new Error(`API contract mismatch: ${message}`);
  error.code = 'API_CONTRACT_MISMATCH';
  error.status = 500;
  return error;
}

export function validateAuthResponse(data, context) {
  const payload = ensureObject(data, context);
  ensureUserSummary(payload.user, `${context}.user`);
  if (context === 'login') {
    ensureString(payload.token, `${context}.token`);
  }
  return payload;
}

export function validatePoolListResponse(data) {
  const payload = ensureObject(data, 'listPools response');
  ensureArray(payload.pools, 'listPools response.pools').forEach((pool, index) => {
    ensurePool(pool, `listPools response.pools[${index}]`);
  });
  ensurePagination(payload.pagination, 'listPools response.pagination');
  return payload;
}

export function validatePoolByIdResponse(data) {
  const payload = ensureObject(data, 'getPoolById response');
  ensurePool(payload.pool, 'getPoolById response.pool');
  return payload;
}

export function validatePoolLeaderboardResponse(data) {
  const payload = ensureObject(data, 'getPoolLeaderboard response');
  ensureString(payload.poolId, 'getPoolLeaderboard response.poolId');
  ensureArray(payload.leaderboard, 'getPoolLeaderboard response.leaderboard').forEach((entry, index) => {
    ensurePoolLeaderboardEntry(entry, `getPoolLeaderboard response.leaderboard[${index}]`);
  });
  ensurePagination(payload.pagination, 'getPoolLeaderboard response.pagination');
  return payload;
}

export function validateDuelListResponse(data) {
  const payload = ensureObject(data, 'listDuels response');
  ensureArray(payload.duels, 'listDuels response.duels').forEach((duel, index) => {
    ensureDuel(duel, `listDuels response.duels[${index}]`);
  });
  ensurePagination(payload.pagination, 'listDuels response.pagination');
  return payload;
}

export function validateDuelByIdResponse(data) {
  const payload = ensureObject(data, 'getDuelById response');
  ensureDuel(payload.duel, 'getDuelById response.duel');
  return payload;
}

export function validateLeaderboardResponse(data) {
  const payload = ensureObject(data, 'getLeaderboard response');
  ensureOptionalString(payload.period, 'getLeaderboard response.period');
  ensureArray(payload.leaderboard, 'getLeaderboard response.leaderboard').forEach((entry, index) => {
    const row = ensureObject(entry, `getLeaderboard response.leaderboard[${index}]`);
    ensureNumber(row.rank, `getLeaderboard response.leaderboard[${index}].rank`);
    ensureUserSummary(row.user, `getLeaderboard response.leaderboard[${index}].user`);
    ensureNumber(row.totalPoints, `getLeaderboard response.leaderboard[${index}].totalPoints`);
    ensureNumber(row.gameweekPoints, `getLeaderboard response.leaderboard[${index}].gameweekPoints`);
    ensureNumber(row.poolsJoined, `getLeaderboard response.leaderboard[${index}].poolsJoined`);
    ensureNumber(row.duelsCreated, `getLeaderboard response.leaderboard[${index}].duelsCreated`);
    ensureNumber(row.duelsPlayed, `getLeaderboard response.leaderboard[${index}].duelsPlayed`);
  });
  ensurePagination(payload.pagination, 'getLeaderboard response.pagination');
  return payload;
}

export function validateJoinResult(data, context = 'join response') {
  const payload = ensureObject(data, context);
  if (payload.message !== null && payload.message !== undefined) {
    ensureString(payload.message, `${context}.message`);
  }
  return payload;
}
