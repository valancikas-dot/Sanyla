import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getCreditPackConfig, isValidCreditPack } from '@/lib/billing-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/billing/create-checkout-session
 * 
 * Creates a Stripe Checkout session for purchasing AI credits
 * 
 * Flow:
 * 1. Auth check
 * 2. Validate credit pack selection
 * 3. Create Stripe Checkout Session with metadata
 * 4. Return checkout URL for redirect
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID for metadata
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { pack } = body;

    if (!pack || !isValidCreditPack(pack)) {
      return NextResponse.json(
        { error: 'Invalid credit pack. Must be: starter, pro, or power' },
        { status: 400 }
      );
    }

    // Get pack configuration with Stripe Price ID
    const packConfig = getCreditPackConfig(pack);

    // Determine base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: packConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/billing/cancel`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        pack: pack,
        credits: packConfig.credits.toString(),
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
