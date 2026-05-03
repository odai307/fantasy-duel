-- CreateTable
CREATE TABLE "pool_participants" (
    "id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "gameweek_points" INTEGER NOT NULL DEFAULT 0,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pool_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pool_participants_pool_id_user_id_key" ON "pool_participants"("pool_id", "user_id");

-- CreateIndex
CREATE INDEX "pool_participants_pool_id_idx" ON "pool_participants"("pool_id");

-- CreateIndex
CREATE INDEX "pool_participants_user_id_idx" ON "pool_participants"("user_id");

-- CreateIndex
CREATE INDEX "pool_participants_pool_id_points_idx" ON "pool_participants"("pool_id", "points");

-- AddForeignKey
ALTER TABLE "pool_participants" ADD CONSTRAINT "pool_participants_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pool_participants" ADD CONSTRAINT "pool_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill
INSERT INTO "pool_participants" ("id", "pool_id", "user_id", "points", "gameweek_points", "joined_at", "updated_at")
SELECT
    p."id" || ':' || p."created_by_id",
    p."id",
    p."created_by_id",
    0,
    0,
    p."created_at",
    NOW()
FROM "pools" p
LEFT JOIN "pool_participants" pp
    ON pp."pool_id" = p."id"
    AND pp."user_id" = p."created_by_id"
WHERE pp."id" IS NULL;
