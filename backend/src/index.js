const express = require('express');
const cors = require('cors');

const authRoutes = require('./auth/authRoutes');
const poolRoutes = require('./pools/poolRoutes');
const duelRoutes = require('./duels/duelRoutes');
const leaderboardRoutes = require('./leaderboard/leaderboardRoutes');
const fplRoutes = require('./fpl/fplRoutes');
const walletRoutes = require('./wallet/walletRoutes');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler');
const requestContext = require('./shared/middleware/requestContext');
const requestLogger = require('./shared/middleware/requestLogger');
const env = require('./shared/config/env');

const app = express();

const allowedOrigins = [env.frontendUrl, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      env.frontendUrl === '*' ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
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
app.use('/api/fpl', fplRoutes);
app.use('/api/wallet', walletRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});
