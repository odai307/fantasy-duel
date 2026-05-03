const { z } = require('zod');
const { makeError } = require('../shared/errors');

const createDuelSchema = z.object({
  gameweek: z.coerce.number().int().min(1, 'Gameweek must be at least 1'),
  entryFee: z.coerce.number().min(0, 'Entry fee cannot be negative').default(0),
  inviteCode: z.string().trim().min(4).max(24).optional().nullable(),
});

const joinByCodeSchema = z.object({
  inviteCode: z.string().trim().min(4, 'Invite code is required').max(24),
});

const duelIdParamsSchema = z.object({
  id: z.string().uuid('Invalid duel id'),
});

const listDuelsQuerySchema = z.object({
  status: z.enum(['all', 'open', 'locked', 'closed', 'cancelled']).optional().default('all'),
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

function validateCreateDuelInput(payload) {
  return parseOrThrow(createDuelSchema, payload || {});
}

function validateJoinByCodeInput(payload) {
  return parseOrThrow(joinByCodeSchema, payload || {});
}

function validateDuelIdParams(payload) {
  return parseOrThrow(duelIdParamsSchema, payload || {});
}

function validateListDuelsQuery(payload) {
  return parseOrThrow(listDuelsQuerySchema, payload || {});
}

module.exports = {
  validateCreateDuelInput,
  validateJoinByCodeInput,
  validateDuelIdParams,
  validateListDuelsQuery,
};
