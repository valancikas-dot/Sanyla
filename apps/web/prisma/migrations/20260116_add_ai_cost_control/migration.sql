-- AI Cost Control & Campaign Tracking
-- Migration: add_ai_cost_control
-- Date: 2026-01-16

-- Step 1: Add AI credits fields to users table
ALTER TABLE "users" 
ADD COLUMN "aiCredits" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN "creditsPlan" TEXT NOT NULL DEFAULT 'free';

-- Step 2: Create campaigns table
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "prompt" TEXT NOT NULL,
    "aiCost" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create credit_logs table (renamed from usage_logs to avoid conflict)
CREATE TABLE "credit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_logs_pkey" PRIMARY KEY ("id")
);

-- Step 4: Add foreign key constraints
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_projectId_fkey" 
    FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_batchId_fkey" 
    FOREIGN KEY ("batchId") REFERENCES "content_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "credit_logs" ADD CONSTRAINT "credit_logs_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Create indexes for performance
CREATE INDEX "campaigns_userId_idx" ON "campaigns"("userId");
CREATE INDEX "campaigns_projectId_idx" ON "campaigns"("projectId");
CREATE INDEX "campaigns_createdAt_idx" ON "campaigns"("createdAt");

CREATE INDEX "credit_logs_userId_idx" ON "credit_logs"("userId");
CREATE INDEX "credit_logs_action_idx" ON "credit_logs"("action");
CREATE INDEX "credit_logs_createdAt_idx" ON "credit_logs"("createdAt");

-- Step 6: Add helpful comments
COMMENT ON TABLE "campaigns" IS 'Tracks AI-generated campaigns with cost and status';
COMMENT ON TABLE "credit_logs" IS 'Audit log for AI credit usage (separate from organization usage_logs)';
COMMENT ON COLUMN "users"."aiCredits" IS 'Remaining AI generation credits';
COMMENT ON COLUMN "users"."creditsPlan" IS 'Subscription tier: free, pro, enterprise';
