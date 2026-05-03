-- CreateEnum
CREATE TYPE "DuelStatus" AS ENUM ('OPEN', 'LOCKED', 'CLOSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "duels" (
    "id" TEXT NOT NULL,
    "invite_code" TEXT NOT NULL,
    "status" "DuelStatus" NOT NULL DEFAULT 'OPEN',
    "gameweek" INTEGER NOT NULL,
    "entry_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "created_by_id" TEXT NOT NULL,
    "opponent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "locked_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "duels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "duels_invite_code_key" ON "duels"("invite_code");

-- CreateIndex
CREATE INDEX "duels_created_by_id_idx" ON "duels"("created_by_id");

-- CreateIndex
CREATE INDEX "duels_opponent_id_idx" ON "duels"("opponent_id");

-- CreateIndex
CREATE INDEX "duels_status_created_at_idx" ON "duels"("status", "created_at");

-- CreateIndex
CREATE INDEX "duels_gameweek_idx" ON "duels"("gameweek");

-- AddForeignKey
ALTER TABLE "duels" ADD CONSTRAINT "duels_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duels" ADD CONSTRAINT "duels_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
