#!/usr/bin/env node

/**
 * Sanyla Platform Setup Verification
 * Checks if all required environment variables and services are configured
 */

const https = require('https');
const { Pool } = require('pg');

const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'OPENAI_API_KEY',
];

const OPTIONAL_VARS = [
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'CRON_SECRET',
];

const REQUIRED_TABLES = [
  'users',
  'organizations',
  'projects',
  'content_calendar',
  'social_accounts',
  'content_analytics',
  'ai_insights',
];

console.log('🔍 Sanyla Platform Setup Verification\n');
console.log('='.repeat(50));

// Check environment variables
console.log('\n📋 Environment Variables:\n');

let missingRequired = [];
let missingOptional = [];

REQUIRED_VARS.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName} - Set`);
  } else {
    console.log(`  ❌ ${varName} - MISSING (REQUIRED)`);
    missingRequired.push(varName);
  }
});

console.log('\n📋 Optional Variables (for full automation):\n');

OPTIONAL_VARS.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName} - Set`);
  } else {
    console.log(`  ⚠️  ${varName} - Not set (automation limited)`);
    missingOptional.push(varName);
  }
});

// Check database connection
async function checkDatabase() {
  console.log('\n🗄️  Database Connection:\n');
  
  if (!process.env.DATABASE_URL) {
    console.log('  ❌ DATABASE_URL not set - skipping database checks');
    return false;
  }

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    await pool.query('SELECT NOW()');
    console.log('  ✅ Database connection successful');

    // Check tables
    console.log('\n📊 Database Tables:\n');
    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`
    );

    const existingTables = result.rows.map(r => r.table_name);
    let missingTables = [];

    REQUIRED_TABLES.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - MISSING`);
        missingTables.push(table);
      }
    });

    await pool.end();

    if (missingTables.length > 0) {
      console.log(`\n  ⚠️  Run migration: node scripts/run-migration.js`);
      return false;
    }

    return true;
  } catch (error) {
    console.log(`  ❌ Database error: ${error.message}`);
    return false;
  }
}

// Check OpenAI API
async function checkOpenAI() {
  console.log('\n🤖 OpenAI API:\n');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('  ❌ OPENAI_API_KEY not set');
    return false;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const hasGPT4 = data.data.some(m => m.id.includes('gpt-4'));
      const hasDALLE = data.data.some(m => m.id.includes('dall-e'));
      
      console.log(`  ✅ API Key valid`);
      console.log(`  ${hasGPT4 ? '✅' : '❌'} GPT-4 access`);
      console.log(`  ${hasDALLE ? '✅' : '⚠️'} DALL-E access`);
      return true;
    } else {
      console.log(`  ❌ API Key invalid (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

// Main verification
async function verify() {
  const dbOk = await checkDatabase();
  const aiOk = await checkOpenAI();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:\n');

  if (missingRequired.length === 0 && dbOk && aiOk) {
    console.log('  ✅ Core setup complete - platform ready!');
  } else {
    console.log('  ❌ Setup incomplete - see errors above');
  }

  if (missingOptional.length > 0) {
    console.log(`  ⚠️  ${missingOptional.length} optional features not configured:`);
    missingOptional.forEach(v => console.log(`     - ${v}`));
    console.log('\n  💡 For full automation, setup:');
    console.log('     1. Facebook/Instagram: https://developers.facebook.com/apps/');
    console.log('     2. LinkedIn: https://www.linkedin.com/developers/apps/');
    console.log('     3. See QUICK-SETUP.md for details');
  } else {
    console.log('  ✅ All optional features configured!');
    console.log('  🚀 Full automation enabled!');
  }

  console.log('\n📚 Next steps:');
  if (missingRequired.length > 0) {
    console.log('  1. Set missing required variables');
    console.log('  2. Run this script again');
  } else if (missingOptional.length > 0) {
    console.log('  1. Follow QUICK-SETUP.md to enable automation');
    console.log('  2. Setup cron job (see RAILWAY-CRON-SETUP.md)');
  } else {
    console.log('  1. Deploy to Railway');
    console.log('  2. Setup cron job (see RAILWAY-CRON-SETUP.md)');
    console.log('  3. Start using https://sanyla.site! 🎉');
  }

  console.log('\n');
  process.exit(missingRequired.length > 0 ? 1 : 0);
}

verify().catch(error => {
  console.error('\n❌ Verification failed:', error);
  process.exit(1);
});
