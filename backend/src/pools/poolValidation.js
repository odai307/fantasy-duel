const { z } = require('zod');

const poolVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);
const listFilterSchema = z.enum(['all', 'high_stakes', 'free_entry']);

const createPoolSchema = z.object({
  name: z.string().trim().min(1, 'Pool name is required').max(80, 'Pool name is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional().nullable(),
  gameweek: z.coerce.number().int().min(1, 'Gameweek must be at least 1'),
  entryFee: z.coerce.number().min(0, 'Entry fee cannot be negative'),
  maxParticipants: z.coerce.number().int().min(2).max(10000).optional().nullable(),
  visibility: poolVisibilitySchema.default('PUBLIC'),
  inviteCode: z.string().trim().min(4, 'Invite code must be at least 4 characters').max(24).optional().nullable(),
}).superRefine((input, ctx) => {
  if (input.visibility === 'PRIVATE' && !input.inviteCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invite code is required for private pools',
      path: ['inviteCode'],
    });
  }
});

const listPoolsQuerySchema = z.object({
  filter: listFilterSchema.optional().default('all'),
  gameweek: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
});

const poolIdParamsSchema = z.object({
  id: z.string().uuid('Invalid pool id'),
});

function parseOrThrow(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.details = result.error.flatten();
    throw error;
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

module.exports = {
  validateCreatePoolInput,
  validateListPoolsQuery,
  validatePoolIdParams,
};
