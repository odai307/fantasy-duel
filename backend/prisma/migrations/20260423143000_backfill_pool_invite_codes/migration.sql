-- Backfill missing invite codes for legacy pools
DO $$
DECLARE
  row_record RECORD;
  code TEXT;
  i INTEGER;
  alphabet TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
BEGIN
  FOR row_record IN
    SELECT id FROM "pools" WHERE "invite_code" IS NULL
  LOOP
    LOOP
      code := '';
      FOR i IN 1..6 LOOP
        code := code || substr(alphabet, floor(random() * length(alphabet) + 1)::int, 1);
      END LOOP;

      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM "pools" WHERE "invite_code" = code
      );
    END LOOP;

    UPDATE "pools"
    SET "invite_code" = code
    WHERE "id" = row_record.id;
  END LOOP;
END $$;

-- Enforce every pool to always have an invite code
ALTER TABLE "pools"
ALTER COLUMN "invite_code" SET NOT NULL;
