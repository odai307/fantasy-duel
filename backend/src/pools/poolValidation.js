const { z } = require('zod');
const { makeError } = require('../shared/errors');

const poolVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);
const listFilterSchema = z.enum(['all', 'high_stakes', 'free_entry']);

const createPoolSchema = z.object({
  name: z.string().trim().min(1, 'Pool name is required').max(80, 'Pool name is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional().nullable(),
  gameweek: z.coerce.number().int().min(1, 'Gameweek must be at least 1'),
  entryFee: z.coerce.number().min(0, 'Entry fee cannot be negative'),
  maxParticipants: z.coerce.number().int().min(2).max(10000).optional().nullable(),
  visibility: poolVisibilitySchema.default('PUBLIC'),
  inviteCode: z.string().trim().min(4).max(24).optional().nullable(),
});

const listPoolsQuerySchema = z.object({
  filter: listFilterSchema.optional().default('all'),
  gameweek: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
});

const poolLeaderboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

const poolIdParamsSchema = z.object({
  id: z.string().uuid('Invalid pool id'),
});

const joinPoolSchema = z.object({
  inviteCode: z.string().trim().min(4).max(24).optional().nullable(),
});

const joinPoolByCodeSchema = z.object({
  inviteCode: z.string().trim().min(4, 'Invite code is required').max(24),
});

function parseOrThrow(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw makeError(400, 'Validation failed', 'VALIDATION_ERROR', result.error.flatten());
  }

  return result.data;
}

function validateCreatePoolInput(payload) {
  return parseOrThrow(createPoolSchema, payload);
}

function validateListPoolsQuery(payload) {
  return parseOrThrow(listPoolsQuerySchema, payload);
}

function validatePoolIdParams(payload) {
  return parseOrThrow(poolIdParamsSchema, payload);
}

function validatePoolLeaderboardQuery(payload) {
  return parseOrThrow(poolLeaderboardQuerySchema, payload);
}

function validateJoinPoolInput(payload) {
  return parseOrThrow(joinPoolSchema, payload || {});
}

function validateJoinPoolByCodeInput(payload) {
  return parseOrThrow(joinPoolByCodeSchema, payload || {});
}

module.exports = {
  validateCreatePoolInput,
  validateListPoolsQuery,
  validatePoolIdParams,
  validatePoolLeaderboardQuery,
  validateJoinPoolInput,
  validateJoinPoolByCodeInput,
};
