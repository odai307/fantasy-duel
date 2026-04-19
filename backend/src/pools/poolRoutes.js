const express = require('express');

const poolController = require('./poolController');
const authMiddleware = require('../shared/middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, poolController.createPool);
router.get('/', poolController.listPools);
router.get('/:id', poolController.getPoolById);

module.exports = router;
