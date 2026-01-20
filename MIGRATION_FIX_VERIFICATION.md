# Production Database Migration Fix - Verification Guide

## Deployment Status

**Commit**: `cde86e4`  
**Deployed**: January 18, 2026  
**Fix**: socialAccountId column migration  
**Expected build time**: 2-3 minutes  

---

## What Was Fixed

**Problem**: `Invalid prisma.scheduleJob.create() invocation: The column schedule_jobs.socialAccountId does not exist`

**Root Cause**: Migration file was not in Prisma-recognized format (`YYYYMMDD_*/migration.sql`)

**Solution**: 
1. Converted loose SQL file to proper Prisma migration directory
2. Added `migration_lock.toml` 
3. Updated Railway build to run `prisma migrate deploy` automatically

---

## Verification Steps (Run After Railway Deploy Completes)

### 1. Check Railway Deployment Logs

```bash
railway logs --tail
```

**Look for these SUCCESS indicators:**

```
✔ Prisma Migrate
✔ 1 migration found in prisma/migrations
✔ Applying migration `20260118_add_schedule_job_social_account_fields`
✔ The following migration have been applied:
  └─ 20260118_add_schedule_job_social_account_fields
✔ Migration completed successfully
```

**If you see ERRORS:**
- `Migration failed` → Check SQL syntax or FK constraint issues
- `Table already exists` → Migration may have been partially applied
- `Database connection failed` → Check DATABASE_URL env var

---

### 2. Verify Columns Exist in Production Database

```bash
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'schedule_jobs' 
  AND column_name IN ('socialAccountId', 'publishedAt', 'platformPostId')
ORDER BY column_name;
SQL
```

**Expected Output:**
```
column_name      | data_type                   | is_nullable | column_default
-----------------|----------------------------|-------------|---------------
platformPostId   | text                       | YES         | NULL
publishedAt      | timestamp without time zone| YES         | NULL
socialAccountId  | text                       | YES         | NULL
```

**If columns are missing**: Migration didn't run. Check Railway logs for errors.

---

### 3. Verify Foreign Key Constraint

```bash
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'schedule_jobs'
  AND kcu.column_name = 'socialAccountId';
SQL
```

**Expected Output:**
```
constraint_name                       | table_name    | column_name      | foreign_table_name | foreign_column_name
--------------------------------------|---------------|------------------|-------------------|--------------------
schedule_jobs_socialAccountId_fkey    | schedule_jobs | socialAccountId  | social_accounts   | id
```

---

### 4. Check Prisma Migration Tracking Table

```bash
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT 
  migration_name, 
  finished_at, 
  applied_steps_count,
  logs
FROM "_prisma_migrations" 
WHERE migration_name LIKE '%social_account%'
ORDER BY finished_at DESC;
SQL
```

**Expected Output:**
```
migration_name                                  | finished_at              | applied_steps_count | logs
-----------------------------------------------|--------------------------|---------------------|------
20260118_add_schedule_job_social_account_fields | 2026-01-18 XX:XX:XX.XXX | 1                   | NULL
```

**Timestamp should be TODAY** (January 18, 2026).

---

### 5. Test Campaign Creation (Production)

1. **Navigate to**: https://sanyla.site
2. **Login** as admin or test user
3. **Go to**: Project → Chat → "sukurk 7 dienų kampaniją"
4. **Select**: Start date/time
5. **Click**: "Generuoti ir planuoti"

**Expected Result**: ✅ Campaign creates successfully, no database errors

**If error persists**:
- Check browser console for different error
- Check Railway logs for Prisma query errors
- Verify Prisma client was regenerated (should happen automatically)

---

### 6. Verify Prisma Client Schema (Optional)

```bash
railway run --service web node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fields = Object.keys(prisma.scheduleJob.fields);
console.log('ScheduleJob fields:', fields);
const hasFields = ['socialAccountId', 'publishedAt', 'platformPostId'].every(f => fields.includes(f));
console.log('Has required fields:', hasFields);
process.exit(hasFields ? 0 : 1);
"
```

**Expected Output:**
```
ScheduleJob fields: [id, scheduledFor, platform, status, payload, error, contentItemId, projectId, socialAccountId, publishedAt, platformPostId, createdAt, updatedAt, ...]
Has required fields: true
```

---

## Troubleshooting

### Issue: Migration shows as "Already applied" but columns don't exist

**Cause**: Partial manual migration was applied previously.

**Fix**:
```bash
# Manually run the migration SQL
railway run --service web npx prisma db execute --stdin << 'SQL'
ALTER TABLE "schedule_jobs" 
ADD COLUMN IF NOT EXISTS "socialAccountId" TEXT,
ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "platformPostId" TEXT;
SQL

# Then add FK constraint
railway run --service web npx prisma db execute --stdin << 'SQL'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'schedule_jobs_socialAccountId_fkey'
  ) THEN
    ALTER TABLE "schedule_jobs" 
    ADD CONSTRAINT "schedule_jobs_socialAccountId_fkey" 
    FOREIGN KEY ("socialAccountId") 
    REFERENCES "social_accounts"("id") 
    ON DELETE SET NULL;
  END IF;
END $$;
SQL
```

### Issue: Foreign key constraint fails

**Cause**: `social_accounts` table doesn't exist.

**Fix**: Check if earlier migration created this table:
```bash
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'social_accounts';
SQL
```

If missing, you need to create it or update the migration to remove FK constraint.

### Issue: Campaign still fails after migration

**Cause**: Different error (not database schema).

**Fix**: Check Railway logs for actual error:
```bash
railway logs --tail | grep -i "prisma\|error"
```

Common issues:
- Invalid data being inserted
- Missing required fields
- Prisma client not regenerated (restart Railway service)

---

## Post-Deployment Checklist

- [ ] Railway deployment completed successfully
- [ ] Migration logs show "Applied successfully"
- [ ] All 3 columns exist in `schedule_jobs` table
- [ ] Foreign key constraint exists
- [ ] `_prisma_migrations` table has new entry
- [ ] Campaign creation works in production
- [ ] No new errors in Railway logs

---

## Rollback Plan (If Something Goes Wrong)

### Option 1: Revert Git Commit

```bash
git revert cde86e4
git push origin main
```

Railway will redeploy without migration changes.

### Option 2: Manually Drop Columns (Nuclear Option)

```bash
railway run --service web npx prisma db execute --stdin << 'SQL'
ALTER TABLE "schedule_jobs" 
DROP COLUMN IF EXISTS "socialAccountId",
DROP COLUMN IF EXISTS "publishedAt",
DROP COLUMN IF EXISTS "platformPostId";
SQL
```

**⚠️ WARNING**: This will delete any data in these columns.

---

## Next Deploy (To Prevent This Issue)

Future migrations should:

1. **Always use Prisma CLI**:
   ```bash
   cd apps/web
   npx prisma migrate dev --name describe_change
   ```

2. **Never create loose `.sql` files** in `/prisma/migrations/`

3. **Always commit migration directories** with format `YYYYMMDD_name/migration.sql`

4. **Verify `migration_lock.toml` exists** before pushing

5. **Test locally first**:
   ```bash
   npx prisma migrate deploy  # Apply pending migrations
   pnpm run build:web         # Verify build works
   ```

---

## Contact Points

- **Railway Dashboard**: https://railway.app/dashboard
- **Production URL**: https://sanyla.site
- **Database**: Check Railway → Project → PostgreSQL service

**Estimated time to fix**: 2-3 minutes (Railway build time)  
**Risk level**: LOW (nullable columns, no data loss)  
**Downtime**: ZERO (DDL is non-blocking for ADD COLUMN)
