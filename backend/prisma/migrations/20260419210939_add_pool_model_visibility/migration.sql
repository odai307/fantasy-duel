-- CreateEnum
CREATE TYPE "PoolVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('OPEN', 'LOCKED', 'CLOSED');

-- CreateTable
CREATE TABLE "pools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "gameweek" INTEGER NOT NULL,
    "entry_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "max_participants" INTEGER,
    "visibility" "PoolVisibility" NOT NULL DEFAULT 'PUBLIC',
    "invite_code" TEXT,
    "status" "PoolStatus" NOT NULL DEFAULT 'OPEN',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pools_invite_code_key" ON "pools"("invite_code");

-- CreateIndex
CREATE INDEX "pools_created_by_id_idx" ON "pools"("created_by_id");

-- CreateIndex
CREATE INDEX "pools_visibility_status_idx" ON "pools"("visibility", "status");

-- CreateIndex
CREATE INDEX "pools_gameweek_idx" ON "pools"("gameweek");

-- CreateIndex
CREATE UNIQUE INDEX "pools_created_by_id_gameweek_key" ON "pools"("created_by_id", "gameweek");

-- AddForeignKey
ALTER TABLE "pools" ADD CONSTRAINT "pools_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
