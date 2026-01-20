import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/user/credits
 * 
 * Returns current user's AI credits balance and plan info.
 * Used by CreditsDisplay component to show remaining credits.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's credit information
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: {
        aiCredits: true,
        creditsPlan: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      credits: user.aiCredits,
      plan: user.creditsPlan,
      costPerCampaign: 30, // Matches CAMPAIGN_CREDIT_COST from campaign-auto
    });

  } catch (error: any) {
    console.error('Credits fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits', details: error.message },
      { status: 500 }
    );
  }
}
