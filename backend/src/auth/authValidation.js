const { z } = require('zod');

const emailSchema = z.string().trim().toLowerCase().email('Invalid email address');

const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
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

function validateRegisterInput(payload) {
  return parseOrThrow(registerSchema, payload);
}

function validateLoginInput(payload) {
  return parseOrThrow(loginSchema, payload);
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
