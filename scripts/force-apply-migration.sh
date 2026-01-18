#!/bin/bash
# Force apply specific migration to Railway production DB
# Usage: railway run bash scripts/force-apply-migration.sh

set -e

echo "=== Force Apply Migration: socialAccountId ==="

if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL not set!"
  exit 1
fi

echo "✅ DATABASE_URL configured"
echo ""

cd apps/web

echo "📋 Current migration status:"
npx prisma migrate status --schema prisma/schema.prisma || true

echo ""
echo "🔄 Applying migrations..."
npx prisma migrate deploy --schema prisma/schema.prisma

echo ""
echo "✅ Verifying socialAccountId column exists:"
npx prisma db execute --stdin --schema prisma/schema.prisma <<SQL
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'schedule_jobs' 
  AND column_name IN ('socialAccountId', 'publishedAt', 'platformPostId');
SQL

echo ""
echo "✅ Migration force-apply complete!"
