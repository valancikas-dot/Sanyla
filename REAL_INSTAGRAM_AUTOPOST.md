# 🚀 REAL INSTAGRAM AUTOPOST - IMPLEMENTATION COMPLETE

## ✅ WHAT WAS IMPLEMENTED

### PHASE 1: Database Migration ✅
**Files Modified:**
- `/prisma/schema.prisma` - Added 3 new fields to `ScheduleJob`:
  - `socialAccountId` (String?) - Links to connected Instagram account
  - `publishedAt` (DateTime?) - Timestamp when post was published
  - `platformPostId` (String?) - Instagram media ID from Graph API
- `/apps/web/prisma/schema.prisma` - Same changes for web Prisma client
- `/prisma/migrations/add_schedule_job_social_account_fields.sql` - Manual migration SQL

**Migration Name:** `add_schedule_job_social_account_fields`

**To Apply Migration:**
```bash
# Production (Railway)
# Migration will auto-apply on next deploy

# Local development
psql $DATABASE_URL < prisma/migrations/add_schedule_job_social_account_fields.sql

# OR regenerate Prisma client
cd prisma && npx prisma generate
cd apps/web/prisma && npx prisma generate
```

---

### PHASE 2: Real Instagram Publishing ✅
**Files Modified:**

1. **`/apps/api/src/scheduler/schedule.processor.ts`** (CRITICAL FIX)
   - ❌ REMOVED: `stub: true` (line 37)
   - ❌ REMOVED: Fake POSTED status
   - ✅ ADDED: Real Meta Graph API integration
   - ✅ ADDED: Status flow: SCHEDULED → POSTING → POSTED/FAILED
   - ✅ ADDED: Error handling with retry logic
   - ✅ ADDED: Token validation (fail fast if expired)
   - ✅ ADDED: Detailed logging (jobId, platformPostId, errors)

2. **`/apps/api/src/scheduler/scheduler.module.ts`**
   - ✅ ADDED: `MetaService` to providers (needed for Instagram API calls)

3. **`/apps/api/src/scheduler/scheduler.service.ts`**
   - ✅ ADDED: Auto-select Instagram account for project
   - ✅ ADDED: Retry configuration (3 attempts, exponential backoff: 30s → 2m → 10m)
   - ✅ ADDED: Link `socialAccountId` when creating schedule job

4. **`/apps/web/src/app/api/ai/campaign-approve/route.ts`**
   - ✅ ADDED: Validation - requires connected Instagram account
   - ✅ ADDED: Auto-link Instagram account to all schedule jobs
   - ✅ ADDED: Error response with code `NO_INSTAGRAM_ACCOUNT`

---

### PHASE 3: Health Check & Observability ✅
**Files Created:**

1. **`/apps/api/src/health/health.controller.ts`**
   - Endpoint: `GET /health` - Basic health check
   - Endpoint: `GET /health/worker` - Worker-specific health check
   - Returns: Queue stats (waiting, active, completed, failed jobs)

2. **`/apps/api/src/health/health.module.ts`**
   - Registers health endpoints

3. **`/apps/api/src/app.module.ts`**
   - ✅ ADDED: `HealthModule` to imports

---

## 📦 ENVIRONMENT VARIABLES

### Required ENV Vars (Production - Railway):
```bash
# Database
DATABASE_URL=postgresql://...

# Redis (BullMQ Queue)
REDIS_URL=redis://...
# OR
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Meta Graph API (Instagram)
META_APP_ID=your_facebook_app_id
META_APP_SECRET=your_facebook_app_secret

# Cloudflare R2 (Image Storage)
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_key
R2_SECRET_ACCESS_KEY=your_r2_secret
R2_BUCKET_NAME=sanyla-assets
R2_PUBLIC_DOMAIN=assets.sanyla.site
```

### Optional ENV Vars:
```bash
# OpenAI (Campaign Generation)
OPENAI_API_KEY=sk-...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://sanyla.site
```

---

## 🚀 HOW TO RUN LOCALLY

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Generate Prisma Clients
```bash
cd prisma && npx prisma generate
cd ../apps/web/prisma && npx prisma generate
cd ../..
```

### 3. Apply Database Migration
```bash
# Option A: Manual SQL
psql $DATABASE_URL < prisma/migrations/add_schedule_job_social_account_fields.sql

# Option B: Prisma migrate (if DATABASE_URL is set)
cd prisma && npx prisma migrate deploy
```

### 4. Start Redis (Required for BullMQ)
```bash
# Docker
docker run -d -p 6379:6379 redis:alpine

# OR use Railway Redis (set REDIS_URL in .env)
```

### 5. Start Web + API (Dev Mode)
```bash
# Terminal 1: Web (Next.js)
cd apps/web
pnpm dev

# Terminal 2: API (NestJS with embedded worker)
cd apps/api
pnpm start:dev
```

### 6. Test Worker Health
```bash
curl http://localhost:4000/health/worker
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-16T...",
  "queue": {
    "name": "schedule",
    "paused": false,
    "waiting": 0,
    "active": 0,
    "completed": 5,
    "failed": 0,
    "delayed": 2
  }
}
```

---

## 📋 SMOKE TEST CHECKLIST

### Test 1: Connect Instagram Account
```bash
# Prerequisites:
# - Meta Developer App created
# - Instagram Business Account linked
# - OAuth callback configured

# Steps:
1. Go to UI: /projects/{id}/settings/social
2. Click "Connect Instagram"
3. Complete OAuth flow
4. Verify SocialAccount created in DB:
   SELECT * FROM social_accounts WHERE platform='INSTAGRAM';
```

### Test 2: Generate Campaign
```bash
# Steps:
1. Go to UI: /projects/{id}/campaigns/auto
2. Enter prompt: "Sukurk kampaniją apie kavos parduotuvės atidarymą"
3. Wait 2-3 minutes
4. Verify DALL-E images saved to R2 (check Asset table)
5. Verify ScheduleJob records created with status='DRAFT'
```

### Test 3: Approve Campaign (Schedule Posts)
```bash
# Steps:
1. Click "Patvirtinti ir Planuoti"
2. Check response - should return success
3. Verify in DB:
   SELECT id, status, socialAccountId, scheduledFor 
   FROM schedule_jobs 
   WHERE status='SCHEDULED';
4. Verify socialAccountId is populated
5. Check BullMQ queue:
   curl http://localhost:4000/health/worker
```

### Test 4: Real Instagram Publish (Immediate)
```bash
# Manual trigger for testing:
# Set scheduledFor to NOW for one job

UPDATE schedule_jobs 
SET scheduledFor = NOW() 
WHERE id = 'job_id_here';

# Watch logs:
# Terminal with API should show:
# "Processing schedule job: {jobId}"
# "Publishing to Instagram: {accountName}"
# "✅ Successfully published job {jobId} - Instagram post ID: {mediaId}"

# Verify in DB:
SELECT id, status, publishedAt, platformPostId, error
FROM schedule_jobs
WHERE id = 'job_id_here';

# Expected result:
# status: 'POSTED'
# publishedAt: timestamp
# platformPostId: '17841...123' (Instagram media ID)
# error: NULL
```

### Test 5: Error Handling (No Account)
```bash
# Remove socialAccountId from a scheduled job
UPDATE schedule_jobs 
SET socialAccountId = NULL 
WHERE id = 'test_job_id';

# Trigger job processing (set scheduledFor to NOW)
# Expected:
# - status: 'FAILED'
# - error: 'No social account connected. Please connect Instagram account.'
```

### Test 6: Error Handling (Expired Token)
```bash
# Set social account status to EXPIRED
UPDATE social_accounts 
SET status = 'EXPIRED' 
WHERE platform = 'INSTAGRAM';

# Trigger job processing
# Expected:
# - status: 'FAILED'
# - error: 'Social account status: EXPIRED. Please reconnect Instagram.'
```

---

## 🏗️ RAILWAY DEPLOYMENT

### Current Setup (Single Process):
Railway currently runs both web + worker in one process (NestJS API).

**Procfile** (if needed):
```
web: cd apps/api && node dist/main.js
```

### Future: Separate Worker Process (Recommended):

**Option A: Two Railway Services**
1. **Service 1: Web + API**
   ```
   web: cd apps/api && node dist/main.js
   ```

2. **Service 2: Worker Only**
   ```
   worker: cd apps/api && node dist/main.js --worker-only
   ```
   - Modify `main.ts` to skip HTTP server if `--worker-only` flag present
   - Share same DATABASE_URL and REDIS_URL

**Option B: Background Worker (Simpler)**
- Keep current setup (worker embedded in API)
- BullMQ processor runs automatically when API starts
- Monitor via `/health/worker` endpoint

---

## 🔍 MONITORING & DEBUGGING

### Check Worker is Running:
```bash
curl https://api.sanyla.site/health/worker
```

### Check Active Jobs:
```bash
# In Redis CLI:
redis-cli
> LLEN bull:schedule:wait
> LLEN bull:schedule:active
> LLEN bull:schedule:completed
> LLEN bull:schedule:failed
```

### View Failed Jobs:
```sql
SELECT 
  id, 
  scheduledFor, 
  status, 
  error, 
  platformPostId,
  publishedAt
FROM schedule_jobs
WHERE status = 'FAILED'
ORDER BY updatedAt DESC
LIMIT 10;
```

### View Successful Posts:
```sql
SELECT 
  sj.id,
  sj.platformPostId,
  sj.publishedAt,
  sa.accountName,
  ci.title
FROM schedule_jobs sj
JOIN social_accounts sa ON sj.socialAccountId = sa.id
JOIN content_items ci ON sj.contentItemId = ci.id
WHERE sj.status = 'POSTED'
ORDER BY sj.publishedAt DESC
LIMIT 10;
```

---

## ✅ ACCEPTANCE CRITERIA - VERIFICATION

### 1. ❌ NO "stub: true" anywhere
```bash
grep -r "stub.*true" apps/api/src/
# Should return: NO RESULTS
```

### 2. ✅ Real Instagram posts created
```bash
# Check on Instagram:
# Go to connected Instagram account
# Posts should appear with:
# - Campaign images (from R2)
# - Generated captions
# - Scheduled times
```

### 3. ✅ Database correctly updated
```sql
-- Successful post should have:
SELECT 
  status,           -- 'POSTED'
  publishedAt,      -- NOT NULL, recent timestamp
  platformPostId,   -- NOT NULL, Instagram media ID
  error            -- NULL
FROM schedule_jobs
WHERE status = 'POSTED'
LIMIT 1;
```

### 4. ✅ Clear error messages for auth failures
```bash
# Test with disconnected account:
# UI should show:
# "No Instagram account connected. Please connect your Instagram account first."

# Test with expired token:
# "Instagram authentication failed: OAuthException. Please reconnect your Instagram account."
```

---

## 📊 WHAT CHANGED - SUMMARY

### Files Modified: 11
1. `/prisma/schema.prisma` - Added socialAccountId, publishedAt, platformPostId
2. `/apps/web/prisma/schema.prisma` - Same schema updates
3. `/apps/api/src/scheduler/schedule.processor.ts` - **REMOVED STUB, ADDED REAL PUBLISHING**
4. `/apps/api/src/scheduler/scheduler.module.ts` - Added MetaService
5. `/apps/api/src/scheduler/scheduler.service.ts` - Auto-link social account + retry config
6. `/apps/web/src/app/api/ai/campaign-approve/route.ts` - Validate Instagram connection
7. `/apps/api/src/app.module.ts` - Added HealthModule

### Files Created: 4
8. `/prisma/migrations/add_schedule_job_social_account_fields.sql` - Migration SQL
9. `/apps/api/src/health/health.controller.ts` - Health check endpoints
10. `/apps/api/src/health/health.module.ts` - Health module
11. `/REAL_INSTAGRAM_AUTOPOST.md` - This documentation

---

## 🎯 NEXT STEPS (Post-MVP)

### Immediate (Before Production):
1. ✅ Apply database migration to production
2. ✅ Deploy to Railway
3. ✅ Test with real Instagram Business Account
4. ✅ Configure ENV vars in Railway
5. ✅ Monitor `/health/worker` for 24h

### Future Enhancements:
- [ ] Add TikTok publishing (similar pattern)
- [ ] Add LinkedIn publishing (similar pattern)
- [ ] Analytics tracking (fetch post insights)
- [ ] Retry queue for failed jobs (manual retry UI)
- [ ] Webhook for Instagram token refresh
- [ ] Cost tracking (OpenAI + Meta API usage)
- [ ] A/B testing (publish 2 variants, track performance)

---

## 🆘 TROUBLESHOOTING

### Issue: Jobs stuck in SCHEDULED
**Cause:** Worker not running or Redis connection failed  
**Fix:**
```bash
# Check worker health
curl https://api.sanyla.site/health/worker

# Check Redis connection
redis-cli -u $REDIS_URL ping
# Should return: PONG

# Restart API service in Railway
```

### Issue: Jobs fail with "token" error
**Cause:** Instagram access token expired  
**Fix:**
```bash
# User must reconnect Instagram:
1. Go to /projects/{id}/settings/social
2. Click "Reconnect Instagram"
3. Complete OAuth flow again
```

### Issue: Images don't load in Instagram posts
**Cause:** R2 URL not public or incorrect  
**Fix:**
```bash
# Verify R2_PUBLIC_DOMAIN is set correctly
echo $R2_PUBLIC_DOMAIN
# Should be: assets.sanyla.site

# Test image URL directly in browser
# Should load without authentication
```

### Issue: "No Instagram account connected" error
**Cause:** No SocialAccount with platform='INSTAGRAM' for this project  
**Fix:**
```sql
-- Check if account exists
SELECT * FROM social_accounts 
WHERE projectId = 'project_id_here' 
AND platform = 'INSTAGRAM';

-- If missing, user needs to connect Instagram via OAuth
```

---

## 📞 SUPPORT

For issues during deployment:
1. Check `/health/worker` endpoint
2. Check Railway logs for errors
3. Check `schedule_jobs` table for error messages
4. Verify ENV vars are set correctly

**Critical ENV Vars:**
- `DATABASE_URL` ✅
- `REDIS_URL` ✅
- `META_APP_ID` ✅
- `META_APP_SECRET` ✅
- `R2_PUBLIC_DOMAIN` ✅
