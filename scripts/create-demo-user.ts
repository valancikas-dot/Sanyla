import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' },
    });

    if (existingUser) {
      console.log('✅ Demo user already exists!');
      console.log('Email: demo@example.com');
      console.log('Password: demo123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Create demo user
    const user = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: hashedPassword,
        name: 'Demo User',
      },
    });

    console.log('✅ Demo user created successfully!');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');
    console.log('User ID:', user.id);

    // Create default organization
    const org = await prisma.organization.create({
      data: {
        name: 'Demo Organization',
        slug: 'demo-org',
      },
    });

    console.log('✅ Demo organization created!');
    console.log('Organization ID:', org.id);

    // Create membership
    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: 'owner',
      },
    });

    console.log('✅ Membership created!');

    // Create a sample project
    const project = await prisma.project.create({
      data: {
        name: 'Demo Project',
        organizationId: org.id,
        industry: 'E-commerce',
        targetAudience: 'Small business owners',
        language: 'lt',
        tone: 'professional',
        brandColors: ['#7C3AED', '#2563EB'],
      },
    });

    console.log('✅ Demo project created!');
    console.log('Project ID:', project.id);

  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();
