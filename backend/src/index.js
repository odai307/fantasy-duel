const express = require('express');
const cors = require('cors');

const authRoutes = require('./auth/authRoutes');
const poolRoutes = require('./pools/poolRoutes');
const duelRoutes = require('./duels/duelRoutes');
const leaderboardRoutes = require('./leaderboard/leaderboardRoutes');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler');
const requestContext = require('./shared/middleware/requestContext');
const requestLogger = require('./shared/middleware/requestLogger');
const env = require('./shared/config/env');

const app = express();

app.use(cors({ origin: env.frontendUrl === '*' ? true : env.frontendUrl }));
app.use(requestContext);
app.use(requestLogger);
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'fantasyduel-backend',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/duels', duelRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});
