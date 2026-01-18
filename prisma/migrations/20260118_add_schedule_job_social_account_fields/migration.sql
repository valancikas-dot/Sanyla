-- Add social account relationship and publishing metadata to ScheduleJob
-- Migration: add_schedule_job_social_account_fields

-- Add new columns to schedule_jobs table
ALTER TABLE "schedule_jobs" 
ADD COLUMN "socialAccountId" TEXT,
ADD COLUMN "publishedAt" TIMESTAMP(3),
ADD COLUMN "platformPostId" TEXT;

-- Add foreign key constraint
ALTER TABLE "schedule_jobs" 
ADD CONSTRAINT "schedule_jobs_socialAccountId_fkey" 
FOREIGN KEY ("socialAccountId") 
REFERENCES "social_accounts"("id") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Create index for performance
CREATE INDEX "schedule_jobs_socialAccountId_idx" ON "schedule_jobs"("socialAccountId");
