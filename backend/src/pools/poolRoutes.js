const express = require('express');

const poolController = require('./poolController');
const authMiddleware = require('../shared/middleware/authMiddleware');
const optionalAuthMiddleware = require('../shared/middleware/optionalAuthMiddleware');

const router = express.Router();

router.post('/', authMiddleware, poolController.createPool);
router.post('/join-by-code', authMiddleware, poolController.joinPoolByCode);
router.post('/:id/join', authMiddleware, poolController.joinPool);
router.get('/', optionalAuthMiddleware, poolController.listPools);
router.get('/:id/leaderboard', optionalAuthMiddleware, poolController.getPoolLeaderboard);
router.get('/:id', optionalAuthMiddleware, poolController.getPoolById);

module.exports = router;
