const { z } = require('zod');
const { makeError } = require('../shared/errors');

const emailSchema = z.string().trim().toLowerCase().email('Invalid email address');

const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fplTeamId: z.preprocess((value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : Number(trimmed);
    }

    return value;
  }, z.number().int().positive().optional()),
});

const setupFplSchema = z.object({
  fplTeamId: z.preprocess((value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : Number(trimmed);
    }

    return value;
  }, z.number().int().positive())
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});
function parseOrThrow(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw makeError(400, 'Validation failed', 'VALIDATION_ERROR', result.error.flatten());
  }

  return result.data;
}

function validateRegisterInput(payload) {
  return parseOrThrow(registerSchema, payload);
}

function validateSetupFplInput(payload) {
  return parseOrThrow(setupFplSchema, payload);
}

function validateLoginInput(payload) {
  return parseOrThrow(loginSchema, payload);
}

module.exports = {
  validateRegisterInput,
  validateSetupFplInput,
  validateLoginInput
};
