const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log('🔄 Running migration...');
    
    const sql = fs.readFileSync(
      path.join(__dirname, '../db-migrations/add-content-calendar.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('Created tables:');
    console.log('  - content_calendar');
    console.log('  - social_accounts');
    console.log('  - content_analytics');
    console.log('  - competitor_analysis');
    console.log('  - ai_insights');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
