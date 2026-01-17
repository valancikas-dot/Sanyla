# 📊 ANALYTICS EVENTS — IMPLEMENTATION GUIDE

## 🎯 Core Tracking Events

### Event Schema Template

```typescript
interface AnalyticsEvent {
  eventName: string;
  userId: string;
  timestamp: Date;
  properties: Record<string, any>;
}
```

---

## 📝 EVENT DEFINITIONS

### 1. USER_SIGNUP

**When**: User completes registration  
**Where**: After successful NextAuth signup

```typescript
// File: apps/web/src/app/api/auth/[...nextauth]/route.ts
// OR: apps/web/src/components/auth/SignUpForm.tsx

analytics.track('USER_SIGNUP', {
  userId: user.id,
  email: user.email,
  signupMethod: 'email' | 'google',
  language: 'lt' | 'en',
  timestamp: new Date().toISOString(),
  source: 'organic' | 'linkedin' | 'email' | 'referral',
});
```

---

### 2. PROJECT_CREATED

**When**: User creates first project  
**Where**: `apps/web/src/app/api/projects/route.ts`

```typescript
analytics.track('PROJECT_CREATED', {
  userId: user.id,
  projectId: project.id,
  industry: project.industry,
  language: project.language,
  targetAudience: project.targetAudience,
  timestamp: new Date().toISOString(),
  isFirstProject: userProjectCount === 1,
});
```

---

### 3. CAMPAIGN_GENERATED

**When**: AI campaign generation succeeds  
**Where**: `apps/web/src/app/api/ai/campaign-auto/route.ts`

```typescript
// Add after campaign creation success
analytics.track('CAMPAIGN_GENERATED', {
  userId: user.id,
  projectId: project.id,
  campaignId: campaign.id,
  creditsUsed: 30,
  creditsRemaining: user.aiCredits,
  daysGenerated: campaign.days?.length || 0,
  postsGenerated: totalPosts,
  hasImages: autoGenerateImages,
  timestamp: new Date().toISOString(),
});
```

---

### 4. INSTAGRAM_CONNECTED

**When**: User completes Meta OAuth  
**Where**: `apps/web/src/app/api/social/connect/route.ts`

```typescript
analytics.track('INSTAGRAM_CONNECTED', {
  userId: user.id,
  socialAccountId: socialAccount.id,
  platform: 'META',
  instagramUsername: pageData.username,
  followerCount: pageData.followers_count || 0,
  timestamp: new Date().toISOString(),
});
```

---

### 5. POST_SCHEDULED

**When**: User approves post for auto-publish  
**Where**: When ScheduleJob.status changes to 'SCHEDULED'

```typescript
analytics.track('POST_SCHEDULED', {
  userId: user.id,
  scheduleJobId: job.id,
  platform: job.platform,
  scheduledFor: job.scheduledFor,
  timestamp: new Date().toISOString(),
});
```

---

### 6. POST_PUBLISHED

**When**: Post successfully publishes to Instagram  
**Where**: `apps/api/src/social/social.service.ts` (after publish success)

```typescript
analytics.track('POST_PUBLISHED', {
  userId: user.id,
  scheduleJobId: job.id,
  platform: 'META',
  platformPostId: job.platformPostId,
  publishedAt: job.publishedAt,
  timestamp: new Date().toISOString(),
});
```

---

### 7. METRICS_COLLECTED

**When**: Instagram metrics successfully collected  
**Where**: `apps/api/src/analytics/metrics-collection.processor.ts`

```typescript
// Add after metric save
analytics.track('METRICS_COLLECTED', {
  userId: user.id, // Get from job.project.user
  scheduleJobId: job.id,
  metricId: metric.id,
  impressions: metric.impressions,
  likes: metric.likes,
  engagementRate: metric.engagementRate,
  timestamp: new Date().toISOString(),
});
```

---

### 8. POST_REWRITTEN

**When**: User rewrites underperforming post  
**Where**: `apps/web/src/app/api/ai/rewrite-post/route.ts`

```typescript
// Add after successful rewrite
analytics.track('POST_REWRITTEN', {
  userId: user.id,
  scheduleJobId: scheduleJobId,
  originalEngagementRate: engagementRate,
  creditsUsed: 5,
  creditsRemaining: user.aiCredits - 5,
  optimizedContentId: optimizedContentItem.id,
  timestamp: new Date().toISOString(),
});
```

---

### 9. CREDITS_PURCHASED

**When**: Stripe payment succeeds  
**Where**: `apps/web/src/app/api/billing/checkout-success/route.ts`

```typescript
// Add after successful credit addition
analytics.track('CREDITS_PURCHASED', {
  userId: user.id,
  pack: pack, // 'starter' | 'pro' | 'power'
  credits: credits,
  price: checkoutSession.amount_total / 100, // Convert cents to EUR
  currency: 'EUR',
  stripeSessionId: sessionId,
  previousBalance: user.aiCredits,
  newBalance: result.newBalance,
  timestamp: new Date().toISOString(),
});
```

---

### 10. CREDITS_DEPLETED

**When**: User tries action but has insufficient credits  
**Where**: `apps/web/src/app/api/ai/campaign-auto/route.ts`

```typescript
// When credits check fails
analytics.track('CREDITS_DEPLETED', {
  userId: user.id,
  creditsRequired: CAMPAIGN_CREDIT_COST,
  creditsAvailable: user.aiCredits,
  action: 'CAMPAIGN_GENERATION',
  timestamp: new Date().toISOString(),
});
```

---

## 🔧 IMPLEMENTATION OPTIONS

### Option 1: PostHog (Recommended)

```bash
pnpm add posthog-js posthog-node
```

**Client-side** (`apps/web/src/lib/analytics.ts`):
```typescript
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://eu.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

export const analytics = {
  track: (event: string, properties: any) => {
    posthog.capture(event, properties);
  },
  identify: (userId: string, traits: any) => {
    posthog.identify(userId, traits);
  },
};
```

**Server-side** (`apps/api/src/common/analytics.service.ts`):
```typescript
import { PostHog } from 'posthog-node';

export class AnalyticsService {
  private posthog: PostHog;

  constructor() {
    this.posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
      host: 'https://eu.posthog.com',
    });
  }

  track(userId: string, event: string, properties: any) {
    this.posthog.capture({
      distinctId: userId,
      event,
      properties,
    });
  }
}
```

---

### Option 2: Simple Database Logging

**Create table**:
```sql
CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_event ON analytics_events(event_name);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
```

**Prisma schema**:
```prisma
model AnalyticsEvent {
  id         String   @id @default(cuid())
  userId     String
  eventName  String
  properties Json?
  createdAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([eventName])
  @@index([createdAt])
  @@map("analytics_events")
}
```

**Helper**:
```typescript
// apps/web/src/lib/analytics.ts
import { prisma } from '@/lib/prisma';

export const analytics = {
  async track(userId: string, eventName: string, properties: any) {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventName,
        properties,
      },
    });
  },
};
```

---

### Option 3: Google Analytics 4

```bash
pnpm add @next/third-parties
```

```typescript
// apps/web/src/app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

**Track events**:
```typescript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const analytics = {
  track: (event: string, properties: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
  },
};
```

---

## 📊 DASHBOARD QUERIES

### Conversion Funnel

```sql
SELECT 
  event_name,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_events
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '14 days'
GROUP BY event_name
ORDER BY 
  CASE event_name
    WHEN 'USER_SIGNUP' THEN 1
    WHEN 'PROJECT_CREATED' THEN 2
    WHEN 'CAMPAIGN_GENERATED' THEN 3
    WHEN 'INSTAGRAM_CONNECTED' THEN 4
    WHEN 'POST_PUBLISHED' THEN 5
    WHEN 'CREDITS_PURCHASED' THEN 6
  END;
```

---

### Daily Signups

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as signups
FROM analytics_events
WHERE event_name = 'USER_SIGNUP'
  AND created_at >= NOW() - INTERVAL '14 days'
GROUP BY DATE(created_at)
ORDER BY date;
```

---

### Revenue Tracking

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as purchases,
  SUM((properties->>'price')::numeric) as revenue,
  SUM((properties->>'credits')::integer) as credits_sold
FROM analytics_events
WHERE event_name = 'CREDITS_PURCHASED'
  AND created_at >= NOW() - INTERVAL '14 days'
GROUP BY DATE(created_at)
ORDER BY date;
```

---

### User Journey

```sql
SELECT 
  user_id,
  event_name,
  created_at,
  properties
FROM analytics_events
WHERE user_id = 'user_xxx'
ORDER BY created_at;
```

---

## 🎯 GOALS & ALERTS

### Setup Alerts

**Low conversion rate** (< 30% signup → campaign):
```sql
WITH funnel AS (
  SELECT 
    COUNT(DISTINCT CASE WHEN event_name = 'USER_SIGNUP' THEN user_id END) as signups,
    COUNT(DISTINCT CASE WHEN event_name = 'CAMPAIGN_GENERATED' THEN user_id END) as campaigns
  FROM analytics_events
  WHERE created_at >= NOW() - INTERVAL '7 days'
)
SELECT 
  signups,
  campaigns,
  ROUND((campaigns::numeric / signups * 100), 2) as conversion_rate
FROM funnel;
-- Alert if conversion_rate < 30
```

---

**Daily revenue goal** (€30+):
```sql
SELECT 
  DATE(created_at) as date,
  SUM((properties->>'price')::numeric) as revenue
FROM analytics_events
WHERE event_name = 'CREDITS_PURCHASED'
  AND DATE(created_at) = CURRENT_DATE
GROUP BY DATE(created_at);
-- Alert if revenue < 30
```

---

## 🚀 QUICK START

1. **Choose tracking method** (PostHog recommended)
2. **Add environment variables**:
   ```bash
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
   POSTHOG_API_KEY=phx_xxx
   ```
3. **Create analytics helper** (`apps/web/src/lib/analytics.ts`)
4. **Add track calls** to each event location
5. **Test in development** with debug mode
6. **Deploy and monitor**

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Install analytics package (PostHog/GA4)
- [ ] Create analytics helper file
- [ ] Add USER_SIGNUP tracking
- [ ] Add PROJECT_CREATED tracking
- [ ] Add CAMPAIGN_GENERATED tracking
- [ ] Add INSTAGRAM_CONNECTED tracking
- [ ] Add POST_PUBLISHED tracking
- [ ] Add METRICS_COLLECTED tracking
- [ ] Add POST_REWRITTEN tracking
- [ ] Add CREDITS_PURCHASED tracking
- [ ] Test all events in development
- [ ] Create dashboard/queries
- [ ] Set up alerts for key metrics

---

**READY TO TRACK** 📊
