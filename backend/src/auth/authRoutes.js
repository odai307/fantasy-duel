const express = require('express');

const authController = require('./authController');
const authMiddleware = require('../shared/middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
