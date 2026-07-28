const express = require('express');

const authController = require('./authController');
const authMiddleware = require('../shared/middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/validate-fpl', authMiddleware, authController.validateFpl);
router.post('/setup-fpl', authMiddleware, authController.setupFpl);
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
