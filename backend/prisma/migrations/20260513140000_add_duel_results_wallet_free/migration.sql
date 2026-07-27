-- Add duel result lifecycle fields (wallet-free settlement)
CREATE TYPE "DuelResult" AS ENUM ('PENDING', 'CREATOR_WIN', 'OPPONENT_WIN', 'DRAW');

ALTER TABLE "duels"
  ADD COLUMN "result" "DuelResult" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "created_by_score" INTEGER,
  ADD COLUMN "opponent_score" INTEGER;

CREATE INDEX "duels_status_result_idx" ON "duels"("status", "result");
