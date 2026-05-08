function toFiniteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildScorePatch(previousGameweekPoints, nextGameweekPoints) {
  const previous = toFiniteNumber(previousGameweekPoints, 0);
  const next = toFiniteNumber(nextGameweekPoints, 0);
  return {
    gameweekPoints: next,
    delta: next - previous,
  };
}

async function syncParticipantScoresForGameweek(tx, participants, nextGameweekPoints) {
  const next = toFiniteNumber(nextGameweekPoints, 0);

  for (const participant of participants) {
    const patch = buildScorePatch(participant.gameweekPoints, next);
    await tx.poolParticipant.update({
      where: { id: participant.id },
      data: {
        gameweekPoints: patch.gameweekPoints,
        points: {
          increment: patch.delta,
        },
        updatedAt: new Date(),
      },
    });
  }

  return participants.length;
}

module.exports = {
  buildScorePatch,
  syncParticipantScoresForGameweek,
};
