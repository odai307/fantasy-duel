const express = require('express');

const leaderboardController = require('./leaderboardController');

const router = express.Router();

router.get('/', leaderboardController.listLeaderboard);

module.exports = router;
