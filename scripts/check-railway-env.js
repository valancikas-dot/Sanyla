#!/usr/bin/env node
/**
 * Railway Environment Variables Checker
 * Validates that all required env vars are set for production
 */

const REQUIRED_ENV = {
  // Database
  DATABASE_URL: 'PostgreSQL connection string',
  
  // NextAuth
  NEXTAUTH_URL: 'Public app URL (e.g., https://sanyla.site)',
  NEXTAUTH_SECRET: 'NextAuth secret key',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: 'Google OAuth client ID',
  GOOGLE_CLIENT_SECRET: 'Google OAuth client secret',
  
  // OpenAI
  OPENAI_API_KEY: 'OpenAI API key for AI generation',
  
  // Cloudflare R2 (optional but recommended)
  R2_ACCOUNT_ID: 'Cloudflare account ID',
  R2_ACCESS_KEY_ID: 'R2 access key ID',
  R2_SECRET_ACCESS_KEY: 'R2 secret access key',
  R2_BUCKET_NAME: 'R2 bucket name (default: sanyla-assets)',
  R2_ENDPOINT: 'R2 endpoint URL',
  R2_PUBLIC_DOMAIN: 'R2 public domain (e.g., assets.sanyla.site)',
};

const OPTIONAL_ENV = {
  NEXT_PUBLIC_APP_URL: 'Same as NEXTAUTH_URL (fallback)',
  NODE_ENV: 'production',
};

console.log('🔍 Checking Railway Environment Variables...\n');

let missingRequired = [];
let missingOptional = [];
let r2Configured = true;

// Check required vars
for (const [key, description] of Object.entries(REQUIRED_ENV)) {
  if (key.startsWith('R2_')) {
    // R2 vars are optional as group
    if (!process.env[key]) {
      r2Configured = false;
    }
    continue;
  }
  
  if (!process.env[key]) {
    missingRequired.push(`  ❌ ${key}: ${description}`);
  } else {
    console.log(`  ✅ ${key}`);
  }
}

console.log('');

// Check R2 configuration
console.log('📦 Cloudflare R2 Storage (optional):');
if (r2Configured) {
  console.log('  ✅ R2 fully configured');
} else {
  console.log('  ⚠️  R2 not configured (images will use temporary DALL-E URLs)');
  console.log('  ℹ️  To enable permanent storage:');
  for (const [key, description] of Object.entries(REQUIRED_ENV)) {
    if (key.startsWith('R2_') && !process.env[key]) {
      console.log(`     - Set ${key}: ${description}`);
    }
  }
}

console.log('');

// Check optional vars
console.log('📋 Optional variables:');
for (const [key, description] of Object.entries(OPTIONAL_ENV)) {
  if (!process.env[key]) {
    console.log(`  ⚠️  ${key}: ${description}`);
  } else {
    console.log(`  ✅ ${key}`);
  }
}

console.log('\n' + '='.repeat(60) + '\n');

if (missingRequired.length > 0) {
  console.log('❌ MISSING REQUIRED VARIABLES:');
  missingRequired.forEach(line => console.log(line));
  console.log('\n⚠️  Deployment will fail without these variables!');
  console.log('📖 See RAILWAY_ENV_VARS.md for setup instructions\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!');
  if (!r2Configured) {
    console.log('⚠️  Note: R2 not configured. Images will use temporary URLs.');
  }
  console.log('');
}
