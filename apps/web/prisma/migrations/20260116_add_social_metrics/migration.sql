-- PHASE 2: Social Media Metrics
-- Migration: add_social_metrics
-- Date: 2026-01-16

-- Step 1: Create social_metrics table
CREATE TABLE "social_metrics" (
    "id" TEXT NOT NULL,
    "scheduleJobId" TEXT NOT NULL,
    "impressions" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "saves" INTEGER,
    "shares" INTEGER,
    "engagementRate" DOUBLE PRECISION,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_metrics_pkey" PRIMARY KEY ("id")
);

-- Step 2: Add foreign key constraint
ALTER TABLE "social_metrics" ADD CONSTRAINT "social_metrics_scheduleJobId_fkey" 
    FOREIGN KEY ("scheduleJobId") REFERENCES "schedule_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 3: Create indexes for performance
CREATE INDEX "social_metrics_scheduleJobId_idx" ON "social_metrics"("scheduleJobId");
CREATE INDEX "social_metrics_collectedAt_idx" ON "social_metrics"("collectedAt");

-- Step 4: Add helpful comments
COMMENT ON TABLE "social_metrics" IS 'Instagram/Facebook post performance metrics collected via Meta Graph API';
COMMENT ON COLUMN "social_metrics"."impressions" IS 'Total times post was seen (reach)';
COMMENT ON COLUMN "social_metrics"."likes" IS 'Like/heart count from Instagram Insights';
COMMENT ON COLUMN "social_metrics"."comments" IS 'Comment count from Instagram Insights';
COMMENT ON COLUMN "social_metrics"."saves" IS 'Bookmark/save count from Instagram Insights';
COMMENT ON COLUMN "social_metrics"."shares" IS 'Share count (if available from API)';
COMMENT ON COLUMN "social_metrics"."engagementRate" IS 'Calculated: (likes + comments*2 + saves*3) / impressions';
COMMENT ON COLUMN "social_metrics"."collectedAt" IS 'When metrics were fetched (allows historical tracking)';
