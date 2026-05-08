const test = require('node:test');
const assert = require('node:assert/strict');

const { buildScorePatch, syncParticipantScoresForGameweek } = require('./scoreSyncUtils');

test('buildScorePatch computes positive delta for first sync', () => {
  const patch = buildScorePatch(0, 61);
  assert.equal(patch.gameweekPoints, 61);
  assert.equal(patch.delta, 61);
});

test('buildScorePatch computes zero delta when score is unchanged (idempotent re-sync)', () => {
  const patch = buildScorePatch(61, 61);
  assert.equal(patch.gameweekPoints, 61);
  assert.equal(patch.delta, 0);
});

test('buildScorePatch computes negative delta when corrected score is lower', () => {
  const patch = buildScorePatch(70, 65);
  assert.equal(patch.gameweekPoints, 65);
  assert.equal(patch.delta, -5);
});

test('syncParticipantScoresForGameweek applies per-participant deltas', async () => {
  const updates = [];
  const tx = {
    poolParticipant: {
      update: async (payload) => {
        updates.push(payload);
        return payload;
      },
    },
  };

  const participants = [
    { id: 'p1', gameweekPoints: 50 },
    { id: 'p2', gameweekPoints: 61 },
    { id: 'p3', gameweekPoints: 75 },
  ];

  const updatedCount = await syncParticipantScoresForGameweek(tx, participants, 61);
  assert.equal(updatedCount, 3);
  assert.equal(updates.length, 3);

  const incrementById = Object.fromEntries(
    updates.map((entry) => [entry.where.id, entry.data.points.increment]),
  );

  assert.equal(incrementById.p1, 11);
  assert.equal(incrementById.p2, 0);
  assert.equal(incrementById.p3, -14);
});
