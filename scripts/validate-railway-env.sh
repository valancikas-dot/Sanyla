#!/bin/bash
# Railway Environment Validation Script
# Checks critical environment variables before deployment

echo "=== Railway Environment Validation ==="

# Critical variables
CRITICAL_VARS=(
  "DATABASE_URL"
  "NEXTAUTH_SECRET"
  "OPENAI_API_KEY"
)

# Recommended variables
RECOMMENDED_VARS=(
  "NEXT_PUBLIC_APP_URL"
  "NEXTAUTH_URL"
  "R2_ACCOUNT_ID"
  "R2_ACCESS_KEY_ID"
  "R2_SECRET_ACCESS_KEY"
  "R2_BUCKET"
  "STRIPE_SECRET_KEY"
  "STRIPE_PUBLISHABLE_KEY"
)

MISSING_CRITICAL=0
MISSING_RECOMMENDED=0

echo ""
echo "Checking CRITICAL variables:"
for var in "${CRITICAL_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ $var - MISSING (CRITICAL)"
    MISSING_CRITICAL=$((MISSING_CRITICAL + 1))
  else
    echo "✅ $var - OK"
  fi
done

echo ""
echo "Checking RECOMMENDED variables:"
for var in "${RECOMMENDED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "⚠️  $var - MISSING (recommended)"
    MISSING_RECOMMENDED=$((MISSING_RECOMMENDED + 1))
  else
    echo "✅ $var - OK"
  fi
done

echo ""
echo "=== Summary ==="
echo "Critical missing: $MISSING_CRITICAL"
echo "Recommended missing: $MISSING_RECOMMENDED"

if [ $MISSING_CRITICAL -gt 0 ]; then
  echo ""
  echo "🔴 CRITICAL: Deployment will FAIL without critical variables!"
  exit 1
fi

if [ $MISSING_RECOMMENDED -gt 0 ]; then
  echo ""
  echo "🟡 WARNING: Some features may not work without recommended variables."
  echo "   - R2 uploads will fallback to temporary DALL-E URLs (expire in 1h)"
  echo "   - Stripe billing may not work"
  exit 0
fi

echo ""
echo "✅ All environment variables configured!"
exit 0
