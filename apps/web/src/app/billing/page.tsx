'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Stripe Price IDs - Replace these with YOUR actual Price IDs from Stripe Dashboard
// Get them from: https://dashboard.stripe.com/products → Your Product → Pricing section
const STRIPE_PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || 'price_REPLACE_WITH_STARTER_PRICE_ID',
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_REPLACE_WITH_PRO_PRICE_ID',
  power: process.env.NEXT_PUBLIC_STRIPE_PRICE_POWER || 'price_REPLACE_WITH_POWER_PRICE_ID',
};

const CREDIT_PACKS = [
  {
    id: 'starter',
    stripePriceId: STRIPE_PRICE_IDS.starter,
    name: 'Starter Pack',
    price: 9,
    credits: 100,
    description: 'Perfect for trying out Sanyla',
    features: [
      '100 AI credits',
      '~3 full campaigns',
      'Instagram auto-posting',
      'Basic analytics',
    ],
  },
  {
    id: 'pro',
    stripePriceId: STRIPE_PRICE_IDS.pro,
    name: 'Growth Pack',
    price: 39,
    credits: 500,
    description: 'For regular content creators',
    popular: true,
    savings: '13% savings',
    features: [
      '500 AI credits',
      '~16 full campaigns',
      'Instagram auto-posting',
      'Advanced analytics',
      'Priority support',
    ],
  },
  {
    id: 'power',
    stripePriceId: STRIPE_PRICE_IDS.power,
    name: 'Pro Pack',
    price: 69,
    credits: 1000,
    description: 'For agencies & power users',
    savings: '23% savings',
    features: [
      '1000 AI credits',
      '~33 full campaigns',
      'Instagram auto-posting',
      'Advanced analytics',
      'Priority support',
      'Bulk operations',
    ],
  },
];

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packId: string) => {
    try {
      setLoading(packId);

      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Buy AI Credits</h1>
          </div>
          <p className="text-lg text-gray-600">
            One-time purchase. No subscriptions. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {CREDIT_PACKS.map((pack) => (
            <Card
              key={pack.id}
              className={`relative ${
                pack.popular
                  ? 'border-purple-500 border-2 shadow-xl scale-105'
                  : 'border-gray-200'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{pack.name}</CardTitle>
                <CardDescription>{pack.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    €{pack.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {pack.credits} credits
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {pack.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handlePurchase(pack.id)}
                  disabled={loading !== null}
                  className={`w-full ${
                    pack.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : ''
                  }`}
                  size="lg"
                >
                  {loading === pack.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Buy ${pack.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How do credits work?
              </h3>
              <p className="text-gray-600 text-sm">
                Each AI campaign generation costs 30 credits. Post rewrites cost 5 credits.
                Credits never expire.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, debit cards, and digital wallets via Stripe.
                Payment is processed securely and we never store your card details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I get a refund?
              </h3>
              <p className="text-gray-600 text-sm">
                We offer refunds for unused credits within 14 days of purchase.
                See our{' '}
                <button
                  onClick={() => router.push('/refund-policy')}
                  className="text-purple-600 hover:underline font-semibold"
                >
                  Refund Policy
                </button>
                {' '}for details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do credits expire?
              </h3>
              <p className="text-gray-600 text-sm">
                No! Your credits never expire. Use them whenever you need.
              </p>
            </div>
          </div>
        </div>

        {/* Back to dashboard */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
          >
            ← Back to Dashboard
          </Button>
        </div>

        {/* Legal Footer */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-center text-sm text-gray-600 mb-3">
            By purchasing, you agree to our policies:
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => router.push('/terms')}
              className="text-sm text-purple-600 hover:underline font-semibold"
            >
              Terms of Service
            </button>
            <button
              onClick={() => router.push('/privacy-policy')}
              className="text-sm text-purple-600 hover:underline font-semibold"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => router.push('/refund-policy')}
              className="text-sm text-purple-600 hover:underline font-semibold"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
