/**
 * Create Super Admin Script
 * Run: node prisma/create-super-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'valancikas@gmail.com';
  const password = 'SuperAdmin2026!'; // Change this to your desired password
  const name = 'Aleksandr Vilcinskas';

  console.log('🔐 Creating Super Admin account...\n');

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create or update user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'super_admin',
      name,
      aiCredits: 999999, // Unlimited credits for super admin
      creditsPlan: 'enterprise',
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: 'super_admin',
      aiCredits: 999999, // Unlimited credits for super admin
      creditsPlan: 'enterprise',
    },
  });

  console.log('✅ Super Admin created successfully!\n');
  console.log('📧 Email:', user.email);
  console.log('👤 Name:', user.name);
  console.log('🔑 Role:', user.role);
  console.log('🆔 ID:', user.id);
  console.log('\n🔐 Login credentials:');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
