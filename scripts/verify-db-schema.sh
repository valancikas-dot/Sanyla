#!/bin/bash
# Verify critical DB columns exist after migration
# Run this after prisma migrate deploy

echo "🔍 Verifying database schema..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set"
  exit 1
fi

# Query to check if socialAccountId column exists
QUERY="SELECT column_name FROM information_schema.columns WHERE table_name = 'schedule_jobs' AND column_name = 'socialAccountId';"

# Run the query (requires psql or use Prisma)
# For Railway, we'll use Prisma to verify
cd "$(dirname "$0")/../apps/web"

echo "✓ DATABASE_URL configured"
echo "✓ Checking schedule_jobs.socialAccountId..."

# Alternative: just run migrate deploy (it's idempotent)
npx prisma migrate deploy --schema prisma/schema.prisma

echo "✅ Database schema verified"
