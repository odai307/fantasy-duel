const express = require('express');

const duelController = require('./duelController');
const authMiddleware = require('../shared/middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, duelController.createDuel);
router.post('/join-by-code', authMiddleware, duelController.joinDuelByCode);
router.get('/', authMiddleware, duelController.listDuels);
router.get('/:id', authMiddleware, duelController.getDuelById);

module.exports = router;
