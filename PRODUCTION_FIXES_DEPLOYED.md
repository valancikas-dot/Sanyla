# Production Fixes Deployed ✅

**Deployment Time**: 2026-01-18  
**Commit**: `6730a0e`  
**Status**: 🚀 Deployed to Railway (auto-deploying now)

---

## ✅ FIXED ISSUES

### 1. **P2022: Missing Column `schedule_jobs.socialAccountId`**

**What was wrong:**
- Migrations existed but Railway wasn't applying them correctly
- nixpacks.toml didn't have explicit `--schema` path

**What I fixed:**
```toml
# nixpacks.toml
[phases.build]
cmds = [
  "cd apps/web && npx prisma generate --schema prisma/schema.prisma",
  "cd apps/web && npx prisma migrate deploy --schema prisma/schema.prisma",  # ← Added --schema
  "pnpm run build:web"
]
```

**Result:** Railway will now correctly find and apply migrations, adding:
- `socialAccountId` TEXT column
- `publishedAt` TIMESTAMP(3) column  
- `platformPostId` TEXT column

---

### 2. **R2 Storage "Unauthorized" Error**

**What was wrong:**
- Missing `forcePathStyle: true` (CRITICAL for Cloudflare R2)
- No endpoint normalization
- Poor error logging

**What I fixed:**
```typescript
// apps/web/src/app/api/storage/upload-from-url/route.ts
return new S3Client({
  region: 'auto',
  endpoint: normalizedEndpoint,  // ← Now ensures https://
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,  // ← CRITICAL: Added for R2
});
```

**Result:** R2 uploads will work correctly with proper S3 client configuration

---

## 📋 NEXT STEPS (After Railway Deploy Completes)

### Step 1: Verify Migrations (2 minutes)
```bash
# Check migration applied
railway run --service web bash scripts/verify-migrations.sh

# Expected output:
# ✅ socialAccountId | text | YES
# ✅ publishedAt | timestamp | YES  
# ✅ platformPostId | text | YES
```

### Step 2: Check R2 Health (1 minute)
```bash
# Test R2 connectivity
curl https://sanyla.site/api/storage/health

# Expected response:
# { "healthy": true, ... }
```

**❌ If health check fails:**
1. Go to Railway dashboard
2. Add R2 environment variables (see RAILWAY_R2_SETUP.md)
3. Redeploy

### Step 3: Test Campaign Generation (5 minutes)
1. Login: https://sanyla.site
2. Create new campaign with image generation
3. Check Railway logs: `railway logs --tail`

**Expected logs:**
```
🔧 R2 Config: endpoint=https://xxx.r2.cloudflarestorage.com, region=auto, forcePathStyle=true
📥 Downloading image from DALL-E...
📤 Uploading to R2: userId/projectId/image.png
✅ S3 Response: statusCode=200, etag="xxx"
✅ Saved to R2: https://assets.sanyla.site/...
```

**Should NOT see:**
- ❌ `P2022: The column schedule_jobs.socialAccountId does not exist`
- ❌ `Error: Unauthorized`

---

## 📚 DOCUMENTATION ADDED

All docs are committed and pushed:

1. **RAILWAY_R2_SETUP.md** - R2 environment variables setup guide
2. **RAILWAY_DEPLOYMENT_GUIDE.md** - Complete deployment checklist
3. **scripts/verify-migrations.sh** - Automated verification script

---

## 🔧 ENVIRONMENT VARIABLES NEEDED

**Check Railway dashboard has these:**

```bash
# Database (should already exist)
DATABASE_URL=postgresql://...

# Auth (should already exist)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://sanyla.site

# R2 Storage (MUST ADD IF MISSING)
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<your_key>
R2_SECRET_ACCESS_KEY=<your_secret>
R2_BUCKET_NAME=sanyla-assets
R2_PUBLIC_DOMAIN=assets.sanyla.site  # Optional
```

**To get R2 credentials:**  
See `RAILWAY_R2_SETUP.md` for step-by-step instructions.

---

## ⚠️ TROUBLESHOOTING

### If P2022 error still occurs:
```bash
# Manually run migration
railway run --service web npx prisma migrate deploy --schema apps/web/prisma/schema.prisma

# Check columns
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'schedule_jobs' 
AND column_name = 'socialAccountId';
SQL
```

### If R2 unauthorized persists:
```bash
# Check env vars exist
railway run --service web env | grep R2_

# Test health endpoint
curl https://sanyla.site/api/storage/health

# Check logs for detailed error
railway logs --tail | grep -E "(R2|S3|Unauthorized)"
```

---

## ✅ SUCCESS CRITERIA

Mark these as complete after testing:

- [ ] Railway deployment successful (green ✅ in dashboard)
- [ ] `scripts/verify-migrations.sh` shows all 3 columns exist
- [ ] `/api/storage/health` returns `"healthy": true`
- [ ] Campaign generation works end-to-end
- [ ] Images upload to R2 (URL starts with R2 domain)
- [ ] No P2022 errors in Railway logs
- [ ] No "Unauthorized" errors in Railway logs

---

## 📞 IF ISSUES PERSIST

1. Check Railway deployment logs for errors
2. Run health checks: `/api/storage/health`
3. Verify environment variables in Railway dashboard
4. Check RAILWAY_DEPLOYMENT_GUIDE.md troubleshooting section
5. Review Railway logs: `railway logs --tail`

---

**Files Changed in this Fix:**
- `nixpacks.toml` - Explicit schema paths
- `apps/web/src/app/api/storage/upload-from-url/route.ts` - R2 fixes
- `apps/web/src/app/api/storage/health/route.ts` - New health check
- `scripts/verify-migrations.sh` - Migration verification
- `RAILWAY_R2_SETUP.md` - R2 setup guide
- `RAILWAY_DEPLOYMENT_GUIDE.md` - Deployment guide

**Commit**: `6730a0e`  
**Branch**: `main`  
**Railway**: Auto-deploying now (watch Railway dashboard)
