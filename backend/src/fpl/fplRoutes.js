const express = require('express');
const router = express.Router();
const authMiddleware = require('../shared/middleware/authMiddleware');
const fplController = require('./fplController');

// FPL Identity & Lineup Endpoints
router.get('/team-info', authMiddleware, fplController.getCurrentUserFplTeamInfo);
router.get('/current-gameweek', fplController.getCurrentGameweekRoute);
router.get('/open-gameweeks', fplController.getOpenGameweeksRoute);
router.get('/fixtures/upcoming', fplController.getUpcomingFixturesRoute);
router.get('/entry/:teamId/lineup', fplController.getEntryLineupRoute);
router.get('/team-score', authMiddleware, fplController.getMyTeamScore);

// Score Synchronization Endpoints
router.post('/sync-my-scores', authMiddleware, fplController.syncMyFplScores);
router.post('/sync-all-scores', authMiddleware, fplController.syncAllFplScores);

module.exports = router;
