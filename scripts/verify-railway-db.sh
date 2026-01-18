#!/bin/bash
# Database Migration Verification for Railway
# Checks if critical columns exist after migration

echo "=== Railway DB Migration Verification ==="

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set!"
  exit 1
fi

echo "✅ DATABASE_URL configured"
echo ""

# Check if schedule_jobs.socialAccountId exists
echo "Checking schedule_jobs.socialAccountId column..."
COLUMN_CHECK=$(cd apps/web && npx prisma db execute --stdin <<< "
  SELECT column_name 
  FROM information_schema.columns 
  WHERE table_name = 'schedule_jobs' 
  AND column_name = 'socialAccountId';
" 2>&1)

if echo "$COLUMN_CHECK" | grep -q "socialAccountId"; then
  echo "✅ schedule_jobs.socialAccountId exists"
else
  echo "❌ schedule_jobs.socialAccountId MISSING!"
  echo "   Run: cd apps/web && npx prisma migrate deploy"
  exit 1
fi

# Check if ContentItem table exists
echo ""
echo "Checking ContentItem table..."
TABLE_CHECK=$(cd apps/web && npx prisma db execute --stdin <<< "
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_name = 'ContentItem';
" 2>&1)

if echo "$TABLE_CHECK" | grep -q "ContentItem"; then
  echo "✅ ContentItem table exists"
else
  echo "⚠️  ContentItem table not found (may be OK for older schema)"
fi

echo ""
echo "=== DB Schema Verification Complete ==="
exit 0
