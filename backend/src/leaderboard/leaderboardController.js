const leaderboardService = require('./leaderboardService');
const { validateLeaderboardQuery } = require('./leaderboardValidation');
const asyncHandler = require('../shared/middleware/asyncHandler');

const listLeaderboard = asyncHandler(async (req, res) => {
  const query = validateLeaderboardQuery(req.query);
  const result = await leaderboardService.listLeaderboard(query);
  return res.status(200).json(result);
});

module.exports = {
  listLeaderboard,
};
