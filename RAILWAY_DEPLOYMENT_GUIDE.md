# Railway Production Deployment - Fix Guide

## Issues Fixed

### ✅ Issue A: Prisma P2022 - Missing Column `schedule_jobs.socialAccountId`
**Root Cause**: Migrations existed but Railway wasn't running them correctly  
**Solution**: Explicit schema path in nixpacks.toml + migrations in apps/web/prisma/migrations/

### ✅ Issue B: R2 Storage "Unauthorized" Error
**Root Cause**: Missing `forcePathStyle: true` for R2 compatibility  
**Solution**: Added R2-specific S3Client config + detailed error logging + health check endpoint

---

## Pre-Deployment Checklist

### 1. Verify Environment Variables in Railway

Go to Railway > sanyla.site > Variables and ensure these exist:

#### Database (should already exist)
```bash
DATABASE_URL=postgresql://...
```

#### NextAuth
```bash
NEXTAUTH_SECRET=<random_string>
NEXTAUTH_URL=https://sanyla.site
```

#### OpenAI
```bash
OPENAI_API_KEY=sk-...
```

#### Cloudflare R2 (NEW - follow RAILWAY_R2_SETUP.md)
```bash
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<your_access_key>
R2_SECRET_ACCESS_KEY=<your_secret_key>
R2_BUCKET_NAME=sanyla-assets
R2_PUBLIC_DOMAIN=assets.sanyla.site  # Optional
```

**Action**: If R2 vars missing, follow [RAILWAY_R2_SETUP.md](./RAILWAY_R2_SETUP.md) to create them.

### 2. Verify Local Changes

```bash
# Check git status
git status

# Should show changes to:
# - nixpacks.toml (explicit schema paths)
# - apps/web/src/app/api/storage/upload-from-url/route.ts (R2 fixes)
# - apps/web/src/app/api/storage/health/route.ts (NEW)
# - RAILWAY_R2_SETUP.md (NEW)
# - scripts/verify-migrations.sh (NEW)
# - RAILWAY_DEPLOYMENT_GUIDE.md (this file)
```

---

## Deployment Steps

### Step 1: Commit and Push Changes

```bash
cd /Users/aleksandrvilcinskas/Desktop/Sanyla

git add nixpacks.toml \
  apps/web/src/app/api/storage/upload-from-url/route.ts \
  apps/web/src/app/api/storage/health/route.ts \
  RAILWAY_R2_SETUP.md \
  scripts/verify-migrations.sh \
  RAILWAY_DEPLOYMENT_GUIDE.md

git commit -m "fix(production): Fix P2022 migration error and R2 unauthorized

CRITICAL FIXES:
1. Explicit Prisma schema paths in nixpacks.toml
   - Added --schema prisma/schema.prisma to migrate deploy
   - Added prisma generate before migrate
   - Ensures Railway finds and applies migrations correctly

2. R2 Storage fixes (Unauthorized error)
   - Added forcePathStyle: true (CRITICAL for R2)
   - Normalize endpoint to include https://
   - Detailed S3 SDK error logging
   - Better env var validation with missing list
   - Added /api/storage/health endpoint for testing

3. Documentation
   - RAILWAY_R2_SETUP.md with step-by-step R2 config
   - verify-migrations.sh script for database checks
   - This deployment guide

TESTING:
- Railway will run: cd apps/web && npx prisma migrate deploy --schema prisma/schema.prisma
- Migration 20260118_add_schedule_job_social_account_fields will apply
- R2 uploads will work with proper S3Client config
- Health check: curl https://sanyla.site/api/storage/health

VERIFICATION (after deploy):
railway run --service web bash scripts/verify-migrations.sh
curl https://sanyla.site/api/storage/health"

git push origin main
```

### Step 2: Monitor Railway Deployment

Railway will automatically deploy when you push to main.

**Watch build logs:**
```bash
# In Railway dashboard, click on deployment
# OR use Railway CLI:
railway logs --tail
```

**Look for these SUCCESS indicators:**

1. **Prisma generate**:
```
✔ Generated Prisma Client
```

2. **Prisma migrate deploy**:
```
Applying migration `20260118_add_schedule_job_social_account_fields`
✅ Applied 1 migration in XXXms
```

3. **Build success**:
```
Creating optimized production build
✓ Compiled successfully
```

**STOP if you see:**
- ❌ `Migration failed`
- ❌ `Foreign key constraint fails` (means social_accounts table missing)
- ❌ `Build failed`

### Step 3: Verify Migrations Applied

**Option A: Using Railway CLI**
```bash
railway run --service web bash scripts/verify-migrations.sh
```

Expected output:
```
🔍 Checking Prisma migration status...
Database schema is up to date!

🔎 Checking schedule_jobs table columns...
socialAccountId     | text | YES | NULL
publishedAt         | timestamp without time zone | YES | NULL  
platformPostId      | text | YES | NULL

✅ Verification complete!
```

**Option B: Manual SQL Query**
```bash
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'schedule_jobs'
AND column_name IN ('socialAccountId', 'publishedAt', 'platformPostId');
SQL
```

### Step 4: Test R2 Storage Health

```bash
curl https://sanyla.site/api/storage/health
```

**Expected response** (all ✅):
```json
{
  "healthy": true,
  "timestamp": "2026-01-18T...",
  "checks": {
    "environment": {
      "R2_ENDPOINT": "✅ Set",
      "R2_ACCESS_KEY_ID": "✅ Set",
      "R2_SECRET_ACCESS_KEY": "✅ Set",
      "R2_BUCKET_NAME": "sanyla-assets"
    },
    "bucket": {
      "status": "✅ Accessible",
      "bucket": "sanyla-assets"
    },
    "upload": {
      "status": "✅ Success",
      "key": "_health-check/1737XXXXXX.txt",
      "httpStatusCode": 200
    }
  }
}
```

**If health check fails**, check Railway logs:
```bash
railway logs --tail | grep -E "(R2|S3|storage)"
```

### Step 5: End-to-End Campaign Test

1. **Login to production**: https://sanyla.site
2. **Go to project**: Click any project
3. **Open chat**: Navigate to chat interface
4. **Generate campaign**:
   - Type: "sukurk 7 dienų kampaniją apie produktą"
   - Select future date/time
   - Click "Generuoti ir planuoti"

**Expected SUCCESS**:
- ✅ Campaign generates without errors
- ✅ DALL-E images generated
- ✅ Images uploaded to R2 (check URL starts with `https://assets.sanyla.site/` or `https://sanyla-assets.r2.dev/`)
- ✅ Schedule jobs created with `socialAccountId` field
- ✅ No P2022 errors in Railway logs

**Check Railway logs during test**:
```bash
railway logs --tail | grep -E "(Campaign|P2022|R2|upload)"
```

Should see:
```
🔧 R2 Config: endpoint=https://xxx.r2.cloudflarestorage.com, region=auto, forcePathStyle=true
📥 Downloading image from DALL-E...
📤 Uploading to R2: userId/projectId/image.png
✅ S3 Response: statusCode=200, etag="xxx"
✅ Saved to R2: https://assets.sanyla.site/userId/projectId/image.png
```

Should NOT see:
- ❌ `P2022: The column schedule_jobs.socialAccountId does not exist`
- ❌ `Error: Unauthorized` (R2)
- ❌ `InvalidAccessKeyId`
- ❌ `SignatureDoesNotMatch`

---

## Troubleshooting

### P2022 Error Still Occurs

**Diagnosis:**
```bash
# Check if migration was actually applied
railway run --service web npx prisma migrate status --schema apps/web/prisma/schema.prisma

# Check database directly
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'schedule_jobs' AND column_name = 'socialAccountId';
SQL
```

**If column doesn't exist:**
```bash
# Manually run migration
railway run --service web npx prisma migrate deploy --schema apps/web/prisma/schema.prisma
```

**If migration fails with FK constraint error:**
- Check `social_accounts` table exists
- Verify foreign key constraint in migration.sql
- May need to apply migrations in order

### R2 "Unauthorized" Error Persists

**Check environment variables:**
```bash
railway run --service web env | grep R2_
```

**Test R2 connection:**
```bash
curl https://sanyla.site/api/storage/health
```

**If status shows ❌:**
1. Verify Cloudflare R2 API token permissions (Object Read & Write)
2. Check bucket name matches exactly
3. Ensure endpoint format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
4. Test with Railway CLI:
```bash
railway run --service web node -e "
const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});
client.send(new HeadBucketCommand({ Bucket: process.env.R2_BUCKET_NAME }))
  .then(() => console.log('✅ R2 connection works!'))
  .catch(e => console.error('❌ R2 error:', e.message));
"
```

### Railway Build Fails

**Check build logs for:**
- TypeScript errors (check imports for S3Client, HeadBucketCommand)
- Missing dependencies (`@aws-sdk/client-s3` should be in package.json)
- Prisma errors (schema syntax)

**Fix and redeploy:**
```bash
# Fix locally, then
git add .
git commit -m "fix: <describe fix>"
git push origin main
```

---

## Rollback Plan

If deployment breaks production:

### Option 1: Rollback via Railway Dashboard
1. Go to Railway > Deployments
2. Find previous working deployment
3. Click "Redeploy"

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
```

### Option 3: Manual Migration Rollback
```bash
# SSH into Railway (if needed)
railway run --service web npx prisma migrate rollback

# Or manually drop columns
railway run --service web npx prisma db execute --stdin << 'SQL'
ALTER TABLE schedule_jobs DROP COLUMN IF EXISTS "socialAccountId";
ALTER TABLE schedule_jobs DROP COLUMN IF EXISTS "publishedAt";
ALTER TABLE schedule_jobs DROP COLUMN IF EXISTS "platformPostId";
SQL
```

---

## Success Criteria ✅

- [ ] Railway deployment successful (green checkmark)
- [ ] `npx prisma migrate status` shows "Database schema is up to date"
- [ ] SQL query confirms `socialAccountId`, `publishedAt`, `platformPostId` columns exist
- [ ] `/api/storage/health` returns `"healthy": true`
- [ ] Campaign generation works end-to-end
- [ ] Images upload to R2 successfully (URL starts with R2 domain)
- [ ] No P2022 errors in production logs
- [ ] No "Unauthorized" R2 errors in production logs

---

## After Successful Deployment

1. **Update documentation** (optional):
   - Mark P2022 issue as RESOLVED in project status docs
   - Update CHANGELOG.md with fix details

2. **Monitor for 24 hours**:
   ```bash
   railway logs --tail | grep -E "(error|Error|ERROR|P2022)"
   ```

3. **Test edge cases**:
   - Multiple campaigns in rapid succession
   - Large images (>5MB)
   - Network timeouts
   - Invalid DALL-E URLs

4. **Performance baseline**:
   - Campaign generation time (should be <30s)
   - R2 upload time (should be <5s per image)
   - Database query time (should be <100ms)

---

## Contact

If issues persist after following this guide:
- Check Railway logs: `railway logs --tail`
- Run health checks: scripts in this repo
- Review error messages: Focus on S3 SDK errors and Prisma errors
- Verify environment variables: `railway run --service web env`

**Last updated**: 2026-01-18  
**Railway Project**: sanyla.site  
**Database**: PostgreSQL on Railway  
**Storage**: Cloudflare R2
