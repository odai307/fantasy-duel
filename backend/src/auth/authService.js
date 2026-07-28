const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../shared/config/db');
const env = require('../shared/config/env');
const { makeError } = require('../shared/errors');
const { validateFplTeamId } = require('../fpl/fplService');

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

async function register({ firstName, lastName, email, password, fplTeamId }) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw makeError(409, 'Email already in use');
  }

  // Validate FPL team ID if provided
  let fplData = null;
  if (fplTeamId) {
    const validation = await validateFplTeamId(fplTeamId);
    if (!validation.isValid) {
      throw makeError(400, validation.error);
    }

    const existingUserByFpl = await prisma.user.findFirst({
      where: { fplTeamId }
    });

    if (existingUserByFpl) {
      throw makeError(409, 'This FPL team is already connected to another account');
    }

    fplData = {
      fplTeamId,
      fplTeamName: validation.teamInfo.teamName,
      fplManagerName: validation.teamInfo.playerName,
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      ...(fplData || {}),
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

async function setupFpl(userId, fplTeamId) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw makeError(404, 'User not found');
  }

  if (user.fplTeamId) {
    throw makeError(400, 'FPL team already connected');
  }

  // Check if another user already has this FPL team ID
  const existingUser = await prisma.user.findFirst({
    where: { fplTeamId }
  });

  if (existingUser) {
    throw makeError(409, 'This FPL team is already connected to another account');
  }

  // Validate FPL team ID
  const validation = await validateFplTeamId(fplTeamId);
  if (!validation.isValid) {
    throw makeError(400, validation.error);
  }

  // Update user with FPL data
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      fplTeamId,
      fplTeamName: validation.teamInfo.teamName,
      fplManagerName: validation.teamInfo.playerName,
    }
  });

  return {
    message: 'FPL team connected successfully',
    user: toSafeUser(updatedUser),
    teamInfo: validation.teamInfo
  };
}

async function validateFplTeam(fplTeamId) {
  const validation = await validateFplTeamId(fplTeamId);
  if (!validation.isValid) {
    throw makeError(400, validation.error);
  }

  return {
    teamInfo: validation.teamInfo
  };
}

async function updateProfile(userId, { firstName, lastName }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw makeError(404, 'User not found');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(firstName ? { firstName: firstName.trim() } : {}),
      ...(lastName ? { lastName: lastName.trim() } : {}),
    },
  });

  return {
    message: 'Profile updated successfully',
    user: toSafeUser(updatedUser),
  };
}

module.exports = {
  register,
  login,
  getMe,
  validateFplTeam,
  setupFpl,
  updateProfile,
};
