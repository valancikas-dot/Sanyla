'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Check, Zap, Star, Crown, ArrowRight } from 'lucide-react';

type BillingPeriod = 'monthly' | 'yearly';

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    nameKey: 'pricing.plans.free.name',
    descriptionKey: 'pricing.plans.free.description',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    color: 'from-gray-500 to-gray-600',
    popular: false,
    features: [
      { key: 'pricing.features.projects', value: '1' },
      { key: 'pricing.features.ai_images', value: '5/mėn' },
      { key: 'pricing.features.ai_videos', value: '0' },
      { key: 'pricing.features.social_accounts', value: '1' },
      { key: 'pricing.features.analytics', value: 'Bazinė' },
      { key: 'pricing.features.languages', value: '17' },
    ],
  },
  {
    id: 'STARTER',
    name: 'Starter',
    nameKey: 'pricing.plans.starter.name',
    descriptionKey: 'pricing.plans.starter.description',
    monthlyPrice: 29,
    yearlyPrice: 290, // ~€24/mėn (2 mėn nemokamai)
    icon: Star,
    color: 'from-purple-500 to-blue-500',
    popular: true,
    features: [
      { key: 'pricing.features.projects', value: '5' },
      { key: 'pricing.features.ai_images', value: '100/mėn' },
      { key: 'pricing.features.ai_videos', value: '10/mėn' },
      { key: 'pricing.features.social_accounts', value: '5' },
      { key: 'pricing.features.analytics', value: 'Pilna' },
      { key: 'pricing.features.calendar', value: '✓' },
      { key: 'pricing.features.support', value: 'Priority' },
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    nameKey: 'pricing.plans.professional.name',
    descriptionKey: 'pricing.plans.professional.description',
    monthlyPrice: 79,
    yearlyPrice: 790, // ~€66/mėn
    icon: Crown,
    color: 'from-orange-500 to-red-500',
    popular: false,
    features: [
      { key: 'pricing.features.projects', value: 'Unlimited' },
      { key: 'pricing.features.ai_images', value: '500/mėn' },
      { key: 'pricing.features.ai_videos', value: '50/mėn' },
      { key: 'pricing.features.social_accounts', value: 'Unlimited' },
      { key: 'pricing.features.advanced_analytics', value: '✓' },
      { key: 'pricing.features.ab_testing', value: '✓' },
      { key: 'pricing.features.team', value: '3 vartotojai' },
      { key: 'pricing.features.api_access', value: '✓' },
      { key: 'pricing.features.white_label', value: '✓' },
    ],
  },
];

export default function PricingPage() {
  const { t } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const handleSubscribe = (planId: string) => {
    // TODO: Integrate with Stripe
    console.log(`Subscribing to ${planId} (${billingPeriod})`);
    alert(`${planId} prenumerata - bus integruota su Stripe`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Pasirinkite savo planą
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Pradėkite nemokamai. Atnaujinkite kai tik pasiruošę.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mėnesinis
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Metinis
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                Sutaupyk 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const displayPrice = billingPeriod === 'yearly' ? (price / 12).toFixed(0) : price;

            return (
              <div
                key={plan.id}
                className={`relative bg-gray-800 rounded-2xl p-8 border-2 transition-all hover:scale-105 ${
                  plan.popular
                    ? 'border-purple-500 shadow-2xl shadow-purple-500/50'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Populiariausias
                    </span>
                  </div>
                )}

                {/* Plan Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">€{displayPrice}</span>
                    <span className="text-gray-400">
                      /{billingPeriod === 'yearly' ? 'mėn*' : 'mėn'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && plan.yearlyPrice > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      *Apmokama metams €{plan.yearlyPrice}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">
                        <span className="font-semibold text-white">{feature.value}</span>{' '}
                        {feature.key.split('.').pop()}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {plan.id === 'FREE' ? 'Pradėti nemokamai' : 'Pasirinkti planą'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-12 text-center border border-purple-500">
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise</h2>
          <p className="text-xl text-gray-200 mb-6">
            Individualūs sprendimai didelėms organizacijoms
          </p>
          <ul className="inline-block text-left mb-8 space-y-2">
            <li className="flex items-center gap-2 text-gray-200">
              <Check className="w-5 h-5 text-green-400" />
              UNLIMITED AI generations
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <Check className="w-5 h-5 text-green-400" />
              UNLIMITED komandos nariai
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <Check className="w-5 h-5 text-green-400" />
              Dedikuotas account manager
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <Check className="w-5 h-5 text-green-400" />
              Custom integracijos
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <Check className="w-5 h-5 text-green-400" />
              SLA garantija
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <Check className="w-5 h-5 text-green-400" />
              On-premise galimybė
            </li>
          </ul>
          <button className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
            Susisiekite dėl kainos
          </button>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Dažniausiai užduodami klausimai
          </h2>
          <div className="space-y-4">
            <details className="bg-gray-800 rounded-lg p-6 cursor-pointer">
              <summary className="font-semibold text-white">
                Ar galiu pakeisti planą bet kada?
              </summary>
              <p className="mt-3 text-gray-300">
                Taip! Galite bet kada atnaujinti arba pakeisti savo planą. Pakeitimai įsigalios
                iškart, o kaina bus proporcingai perskaičiuota.
              </p>
            </details>

            <details className="bg-gray-800 rounded-lg p-6 cursor-pointer">
              <summary className="font-semibold text-white">
                Kas nutinka pasibaigus AI limitams?
              </summary>
              <p className="mt-3 text-gray-300">
                Pasibaigus mėnesiniams limitams, galėsite įsigyti papildomų kreditų arba
                atnaujinti į aukštesnį planą. Jūsų turinys ir duomenys išliks saugūs.
              </p>
            </details>

            <details className="bg-gray-800 rounded-lg p-6 cursor-pointer">
              <summary className="font-semibold text-white">
                Ar yra metinės nuolaidos?
              </summary>
              <p className="mt-3 text-gray-300">
                Taip! Pasirinkus metinį planą, sutaupote 17% lyginant su mėnesiniu mokėjimu.
                Tai ~2 mėnesiai nemokamai!
              </p>
            </details>

            <details className="bg-gray-800 rounded-lg p-6 cursor-pointer">
              <summary className="font-semibold text-white">
                Kokios mokėjimo galimybės?
              </summary>
              <p className="mt-3 text-gray-300">
                Priimame visas pagrindines kredito/debeto korteles per Stripe. Taip pat
                galimas mokėjimas banko pavedimu Enterprise planui.
              </p>
            </details>

            <details className="bg-gray-800 rounded-lg p-6 cursor-pointer">
              <summary className="font-semibold text-white">
                Ar galiu atšaukti bet kada?
              </summary>
              <p className="mt-3 text-gray-300">
                Taip, galite atšaukti bet kada. Prenumerata tęsis iki einamojo laikotarpio
                pabaigos, ir nebūsite apmokestinti už kitą laikotarpį.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
