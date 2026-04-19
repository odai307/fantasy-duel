const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../shared/config/db');
const env = require('../shared/config/env');

function makeError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function toSafeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    fplTeamId: user.fplTeamId,
    walletBalance: user.walletBalance,
    createdAt: user.createdAt
  };
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

async function register({ firstName, lastName, email, password }) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw makeError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash
    }
  });

  return {
    user: toSafeUser(user)
  };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw makeError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw makeError(401, 'Invalid email or password');
  }

  const token = signAccessToken(user);

  return {
    user: toSafeUser(user),
    token
  };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw makeError(404, 'User not found');
  }

  return {
    user: toSafeUser(user)
  };
}

module.exports = {
  register,
  login,
  getMe
};
