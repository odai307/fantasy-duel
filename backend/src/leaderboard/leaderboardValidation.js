const { z } = require('zod');
const { makeError } = require('../shared/errors');

const leaderboardQuerySchema = z.object({
  period: z.enum(['all_time', 'this_week']).optional().default('all_time'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
});

function parseOrThrow(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw makeError(400, 'Validation failed', 'VALIDATION_ERROR', result.error.flatten());
  }

  return result.data;
}

function validateLeaderboardQuery(payload) {
  return parseOrThrow(leaderboardQuerySchema, payload || {});
}

module.exports = {
  validateLeaderboardQuery,
};
