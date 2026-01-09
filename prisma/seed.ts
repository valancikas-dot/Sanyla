import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Starting seed...');

  // Clean existing data (optional - comment out if you want to keep existing data)
  await prisma.auditLog.deleteMany();
  await prisma.scheduleJob.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.contentBatch.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.project.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashPassword('demo123'),
      name: 'Demo User',
    },
  });

  console.log('Created user:', user.email);

  // Create demo organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Organization',
      slug: 'demo-org',
    },
  });

  console.log('Created organization:', org.name);

  // Create membership
  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: org.id,
      role: 'owner',
    },
  });

  // Create demo project
  const project = await prisma.project.create({
    data: {
      name: 'Demo Coffee Shop',
      industry: 'Food & Beverage',
      country: 'Lithuania',
      city: 'Vilnius',
      website: 'https://democoffee.lt',
      offer: 'Premium specialty coffee and pastries',
      prices: '€3-€8 per item',
      targetAudience: 'Young professionals aged 25-40, coffee enthusiasts',
      language: 'lt',
      tone: 'friendly, warm, approachable',
      brandColors: ['#6F4E37', '#FFF8DC', '#8B4513'],
      competitors: 'Starbucks, local cafes',
      organizationId: org.id,
    },
  });

  console.log('Created project:', project.name);

  // Create a sample content batch
  const batch = await prisma.contentBatch.create({
    data: {
      name: 'Week 1 Content',
      description: 'Initial content batch for week 1',
      projectId: project.id,
    },
  });

  // Create sample strategy content
  await prisma.contentItem.create({
    data: {
      type: 'STRATEGY',
      title: '30-Day Marketing Strategy',
      content: {
        overview: 'Sample 30-day strategy for Demo Coffee Shop',
        weeks: [
          { week: 1, focus: 'Brand awareness', tactics: ['Social media posts', 'Local partnerships'] },
          { week: 2, focus: 'Customer engagement', tactics: ['Contest', 'User generated content'] },
          { week: 3, focus: 'Product promotion', tactics: ['New menu items', 'Special offers'] },
          { week: 4, focus: 'Community building', tactics: ['Events', 'Loyalty program'] },
        ],
      },
      projectId: project.id,
    },
  });

  console.log('Created sample content items');

  console.log('Seed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: demo123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
