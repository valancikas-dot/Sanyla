-- Add missing columns to users table if they don't exist

-- Add aiCredits column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'aiCredits') THEN
        ALTER TABLE "users" ADD COLUMN "aiCredits" INTEGER NOT NULL DEFAULT 100;
    END IF;
END $$;

-- Add creditsPlan column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'creditsPlan') THEN
        ALTER TABLE "users" ADD COLUMN "creditsPlan" TEXT NOT NULL DEFAULT 'free';
    END IF;
END $$;

-- Update existing schema
UPDATE "users" SET "aiCredits" = 100 WHERE "aiCredits" IS NULL;
UPDATE "users" SET "creditsPlan" = 'free' WHERE "creditsPlan" IS NULL;
