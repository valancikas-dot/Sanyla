/**
 * Stripe Credit Packs Configuration
 * 
 * IMPORTANT: Create these products in Stripe Dashboard first
 * Dashboard > Products > Add Product
 * 
 * Then copy the price IDs to .env:
 * STRIPE_PRICE_STARTER=price_xxx
 * STRIPE_PRICE_PRO=price_xxx
 * STRIPE_PRICE_POWER=price_xxx
 */

export type CreditPack = 'starter' | 'pro' | 'power';

export interface CreditPackConfig {
  id: CreditPack;
  name: string;
  credits: number;
  price: number; // in EUR
  priceId: string; // Stripe Price ID from env
  popular?: boolean;
}

/**
 * Get Stripe Price ID from environment
 */
function getPriceId(pack: CreditPack): string {
  const priceIds = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    power: process.env.STRIPE_PRICE_POWER,
  };

  const priceId = priceIds[pack];
  if (!priceId) {
    throw new Error(`Missing Stripe Price ID for ${pack} pack. Check environment variables.`);
  }

  return priceId;
}

/**
 * Credit pack pricing configuration
 */
export const CREDIT_PACKS: Record<CreditPack, Omit<CreditPackConfig, 'priceId'>> = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    credits: 100,
    price: 9,
  },
  pro: {
    id: 'pro',
    name: 'Pro Pack',
    credits: 500,
    price: 39,
    popular: true,
  },
  power: {
    id: 'power',
    name: 'Power Pack',
    credits: 1000,
    price: 69,
  },
};

/**
 * Get complete credit pack config with Stripe Price ID
 */
export function getCreditPackConfig(pack: CreditPack): CreditPackConfig {
  const config = CREDIT_PACKS[pack];
  if (!config) {
    throw new Error(`Invalid credit pack: ${pack}`);
  }

  return {
    ...config,
    priceId: getPriceId(pack),
  };
}

/**
 * Get credit amount from Stripe Price ID
 * Used in success handler to determine how many credits to add
 */
export function getCreditsFromPriceId(priceId: string): number | null {
  const starterPriceId = process.env.STRIPE_PRICE_STARTER;
  const proPriceId = process.env.STRIPE_PRICE_PRO;
  const powerPriceId = process.env.STRIPE_PRICE_POWER;

  if (priceId === starterPriceId) return 100;
  if (priceId === proPriceId) return 500;
  if (priceId === powerPriceId) return 1000;

  return null;
}

/**
 * Validate credit pack name
 */
export function isValidCreditPack(pack: string): pack is CreditPack {
  return pack === 'starter' || pack === 'pro' || pack === 'power';
}
