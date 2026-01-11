-- Content Calendar table
CREATE TABLE IF NOT EXISTS content_calendar (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  "scheduledDate" DATE NOT NULL,
  "contentType" TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  caption TEXT,
  hashtags TEXT[],
  "mediaUrls" TEXT[],
  "mediaType" TEXT,
  "targetAudience" TEXT,
  "postingTime" TIME,
  "aiGenerated" BOOLEAN DEFAULT true,
  "approvalNotes" TEXT,
  "performanceScore" DECIMAL(3,2),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "postedAt" TIMESTAMP,
  "approvedAt" TIMESTAMP,
  "approvedBy" TEXT REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_content_calendar_project ON content_calendar("projectId");
CREATE INDEX IF NOT EXISTS idx_content_calendar_date ON content_calendar("scheduledDate");
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);

-- Social Media Accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  "accountName" TEXT,
  "accountId" TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "refreshToken" TEXT,
  "tokenExpiresAt" TIMESTAMP,
  "isActive" BOOLEAN DEFAULT true,
  "pageId" TEXT,
  "businessAccountId" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_accounts_project ON social_accounts("projectId");
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);

-- Analytics table
CREATE TABLE IF NOT EXISTS content_analytics (
  id TEXT PRIMARY KEY,
  "contentId" TEXT NOT NULL REFERENCES content_calendar(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  "postId" TEXT,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  "videoViews" INTEGER DEFAULT 0,
  "engagementRate" DECIMAL(5,2),
  "dataFetchedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_analytics_content ON content_analytics("contentId");

-- Competitor Analysis table
CREATE TABLE IF NOT EXISTS competitor_analysis (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  "competitorName" TEXT NOT NULL,
  "competitorUrl" TEXT,
  platform TEXT NOT NULL,
  "platformAccountId" TEXT,
  "analysisType" TEXT NOT NULL,
  data JSONB NOT NULL,
  insights TEXT[],
  recommendations TEXT[],
  "analyzedAt" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitor_analysis_project ON competitor_analysis("projectId");
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_date ON competitor_analysis("analyzedAt");

-- AI Insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  "insightType" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  "actionItems" TEXT[],
  data JSONB,
  "isRead" BOOLEAN DEFAULT false,
  "isImplemented" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "implementedAt" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_project ON ai_insights("projectId");
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority ON ai_insights(priority);
CREATE INDEX IF NOT EXISTS idx_ai_insights_read ON ai_insights("isRead");
