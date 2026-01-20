#!/bin/bash
# Railway DB schema verification script
# Run this to verify database schema after deployment

echo "=== Railway DB Schema Check ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Check for schedule_jobs.socialAccountId column
echo "Checking schedule_jobs table schema..."
psql "$DATABASE_URL" -c "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'schedule_jobs' ORDER BY ordinal_position;" || {
  echo "❌ Failed to query schedule_jobs table"
  exit 1
}

echo ""
echo "Checking for socialAccountId column specifically..."
COLUMN_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'schedule_jobs' AND column_name = 'socialAccountId';")

if [ "$COLUMN_EXISTS" -gt 0 ]; then
  echo "✅ schedule_jobs.socialAccountId column exists"
else
  echo "❌ schedule_jobs.socialAccountId column MISSING!"
  echo "   Run: cd apps/web && npx prisma migrate deploy"
  exit 1
fi

echo ""
echo "=== Check complete ==="
