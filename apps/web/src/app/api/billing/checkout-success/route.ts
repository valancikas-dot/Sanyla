import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/billing/checkout-success
 * 
 * Processes successful Stripe Checkout payment
 * Adds credits to user account after verifying payment
 * 
 * SECURITY:
 * - Validates session_id with Stripe API (never trust frontend)
 * - Verifies userId matches session
 * - Idempotent: prevents double-crediting on page refresh
 * 
 * Flow:
 * 1. Auth check
 * 2. Retrieve Stripe Checkout Session
 * 3. Verify payment_status = "paid"
 * 4. Verify userId matches
 * 5. Check idempotency (stripeSessionId in CreditLog)
 * 6. Atomic transaction: add credits + create log
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, aiCredits: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // CRITICAL: Retrieve session from Stripe API (never trust frontend)
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    // Verify payment status
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed', status: checkoutSession.payment_status },
        { status: 400 }
      );
    }

    // Verify userId matches (security check)
    const stripeUserId = checkoutSession.metadata?.userId;
    if (stripeUserId !== user.id) {
      return NextResponse.json(
        { error: 'User ID mismatch. Potential security issue.' },
        { status: 403 }
      );
    }

    // Get credits amount from metadata
    const creditsStr = checkoutSession.metadata?.credits;
    const pack = checkoutSession.metadata?.pack;

    if (!creditsStr || !pack) {
      return NextResponse.json(
        { error: 'Invalid checkout session metadata' },
        { status: 400 }
      );
    }

    const credits = parseInt(creditsStr, 10);
    if (isNaN(credits) || credits <= 0) {
      return NextResponse.json(
        { error: 'Invalid credits amount in metadata' },
        { status: 400 }
      );
    }

    // IDEMPOTENCY CHECK: Prevent double-crediting on page refresh
    const existingLog = await prisma.creditLog.findFirst({
      where: {
        userId: user.id,
        action: 'CREDITS_PURCHASE',
        metadata: {
          path: ['stripeSessionId'],
          equals: sessionId,
        },
      },
    });

    if (existingLog) {
      // Already processed - return success without adding credits again
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        message: 'Credits already added for this purchase',
        credits,
        pack,
        currentBalance: user.aiCredits,
      });
    }

    // ATOMIC TRANSACTION: Add credits + create log
    const result = await prisma.$transaction(async (tx) => {
      // Add credits to user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { aiCredits: { increment: credits } },
        select: { aiCredits: true },
      });

      // Create credit log
      await tx.creditLog.create({
        data: {
          userId: user.id,
          action: 'CREDITS_PURCHASE',
          cost: -credits, // Negative because credits added (not spent)
          metadata: {
            pack,
            credits,
            stripeSessionId: sessionId,
            stripePaymentIntentId: checkoutSession.payment_intent as string,
            amount: checkoutSession.amount_total,
            currency: checkoutSession.currency,
          },
        },
      });

      return {
        newBalance: updatedUser.aiCredits,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully added ${credits} credits to your account`,
      credits,
      pack,
      previousBalance: user.aiCredits,
      newBalance: result.newBalance,
    });
  } catch (error) {
    console.error('Checkout success handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process payment', details: errorMessage },
      { status: 500 }
    );
  }
}
