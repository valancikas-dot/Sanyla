/**
 * Add missing columns to Railway database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Adding missing columns to database...\n');

  try {
    // Add aiCredits column if doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'users' AND column_name = 'aiCredits') THEN
              ALTER TABLE "users" ADD COLUMN "aiCredits" INTEGER NOT NULL DEFAULT 100;
          END IF;
      END $$;
    `);

    // Add creditsPlan column if doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'users' AND column_name = 'creditsPlan') THEN
              ALTER TABLE "users" ADD COLUMN "creditsPlan" TEXT NOT NULL DEFAULT 'free';
          END IF;
      END $$;
    `);

    console.log('✅ Columns added successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
