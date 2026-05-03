const { PrismaClient } = require('@prisma/client');
const env = require('./env');

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: env.nodeEnv === 'development' ? ['query', 'warn', 'error'] : ['error']
});

if (env.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
