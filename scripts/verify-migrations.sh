#!/bin/bash
# Verify Prisma migrations on Railway production database
# Run: railway run --service web bash scripts/verify-migrations.sh

set -e

echo "🔍 Checking Prisma migration status..."
echo ""

# Change to apps/web directory where Railway runs
cd apps/web

# Check migration status
echo "📊 Migration Status:"
npx prisma migrate status --schema prisma/schema.prisma

echo ""
echo "🔎 Checking schedule_jobs table columns..."

# SQL query to check columns exist
npx prisma db execute --stdin << 'SQL'
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'schedule_jobs'
  AND column_name IN ('socialAccountId', 'publishedAt', 'platformPostId')
ORDER BY column_name;
SQL

echo ""
echo "✅ Verification complete!"
echo ""
echo "Expected output:"
echo "  - socialAccountId | text | YES | NULL"
echo "  - publishedAt     | timestamp without time zone | YES | NULL"
echo "  - platformPostId  | text | YES | NULL"
