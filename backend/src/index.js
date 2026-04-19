require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./auth/authRoutes');
const poolRoutes = require('./pools/poolRoutes');

const app = express();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || '*';

app.use(cors({ origin: frontendUrl === '*' ? true : frontendUrl }));
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

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
