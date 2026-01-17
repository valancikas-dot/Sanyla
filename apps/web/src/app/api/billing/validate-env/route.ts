/**
 * Internal endpoint to validate Stripe environment setup
 * Call this before going live to catch configuration errors
 * 
 * GET /api/billing/validate-env
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CREDIT_PACKS } from '@/lib/billing-config';

export async function GET() {
  try {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check environment variables
    const requiredEnvVars = [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_PRICE_STARTER',
      'STRIPE_PRICE_PRO',
      'STRIPE_PRICE_POWER',
      'NEXT_PUBLIC_APP_URL',
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`Missing environment variable: ${envVar}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        status: 'error',
        errors,
        warnings,
      }, { status: 500 });
    }

    // 2. Check if using live keys
    const secretKey = process.env.STRIPE_SECRET_KEY!;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

    if (secretKey.startsWith('sk_test_')) {
      warnings.push('Using TEST secret key. Switch to sk_live_xxx for production.');
    }
    if (publishableKey.startsWith('pk_test_')) {
      warnings.push('Using TEST publishable key. Switch to pk_live_xxx for production.');
    }

    // 3. Validate Stripe connection
    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });

    let account;
    try {
      account = await stripe.accounts.retrieve();
    } catch (error: any) {
      errors.push(`Stripe API error: ${error.message}`);
      return NextResponse.json({
        status: 'error',
        errors,
        warnings,
      }, { status: 500 });
    }

    // 4. Validate price IDs exist
    const priceIds = [
      { id: process.env.STRIPE_PRICE_STARTER!, name: 'starter' as const },
      { id: process.env.STRIPE_PRICE_PRO!, name: 'pro' as const },
      { id: process.env.STRIPE_PRICE_POWER!, name: 'power' as const },
    ];

    for (const { id, name } of priceIds) {
      try {
        const price = await stripe.prices.retrieve(id);
        
        // Validate price matches config
        const pack = CREDIT_PACKS[name];
        if (!pack) {
          errors.push(`No config found for pack: ${name}`);
          continue;
        }

        const expectedAmount = pack.price * 100; // Convert to cents
        if (price.unit_amount !== expectedAmount) {
          warnings.push(
            `Price mismatch for ${name}: Stripe has €${(price.unit_amount || 0) / 100}, ` +
            `config expects €${pack.price}`
          );
        }

        if (price.currency !== 'eur') {
          warnings.push(`Price ${name} currency is ${price.currency}, expected EUR`);
        }
      } catch (error: any) {
        errors.push(`Invalid price ID for ${name}: ${error.message}`);
      }
    }

    // 5. Check APP_URL format
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    if (!appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
      errors.push('NEXT_PUBLIC_APP_URL must start with http:// or https://');
    }
    if (appUrl.endsWith('/')) {
      warnings.push('NEXT_PUBLIC_APP_URL should not end with /');
    }
    if (appUrl.includes('localhost') && secretKey.startsWith('sk_live_')) {
      warnings.push('Using LIVE Stripe keys with localhost URL. This may cause redirect issues.');
    }

    if (errors.length > 0) {
      return NextResponse.json({
        status: 'error',
        errors,
        warnings,
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Stripe configuration is valid',
      account: {
        id: account.id,
        email: account.email,
        country: account.country,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      },
      prices: priceIds.map(p => p.id),
      mode: secretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST',
      warnings,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      errors: [error.message],
      warnings: [],
    }, { status: 500 });
  }
}
