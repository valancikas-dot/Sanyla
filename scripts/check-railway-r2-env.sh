#!/bin/bash

echo "🔍 Checking R2 environment variables..."

required_vars=(
  "R2_ACCOUNT_ID"
  "R2_ACCESS_KEY_ID"
  "R2_SECRET_ACCESS_KEY"
  "R2_BUCKET"
  "R2_PUBLIC_BASE_URL"
  "NEXT_PUBLIC_APP_URL"
  "DATABASE_URL"
)

missing=0

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing: $var"
    ((missing++))
  else
    if [[ "$var" == *"SECRET"* ]] || [[ "$var" == *"KEY"* ]] || [[ "$var" == "DATABASE_URL" ]]; then
      echo "✅ $var: [SET - hidden]"
    else
      echo "✅ $var: ${!var}"
    fi
  fi
done

echo ""
if [ $missing -eq 0 ]; then
  echo "✅ All required environment variables are set!"
  exit 0
else
  echo "❌ $missing required variables are missing!"
  exit 1
fi
