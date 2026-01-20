#!/bin/bash
set -e

echo "🔍 Verifying Railway database migrations..."

cd apps/web

echo "📊 Migration status:"
npx prisma migrate status

echo ""
echo "🗃️ Checking schedule_jobs.socialAccountId column:"
npx prisma db execute --stdin <<SQL
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'schedule_jobs' 
  AND column_name = 'socialAccountId';
SQL

echo ""
echo "✅ Verification complete!"
