'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getLegalTranslation } from '@/lib/i18n/legal-translations';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Euro, Check, X } from 'lucide-react';

export default function RefundPolicyPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const t = (key: string) => getLegalTranslation(language, key as any);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Euro className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t('legal.refund_title')}
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
          >
            {t('legal.back_home')}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Dates */}
        <div className="text-sm text-gray-600 mb-8">
          <p><strong>{t('legal.effective_date')}:</strong> January 16, 2026</p>
          <p><strong>{t('legal.last_updated')}:</strong> January 16, 2026</p>
        </div>

        {/* Summary */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-orange-900 mb-4">
            {t('refund.summary.title')}
          </h2>
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-orange-900">
                  {t(`refund.summary.point${i}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose prose-orange max-w-none">
          {/* Section 1 - Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('refund.section1.title')}
            </h2>
            <p className="text-gray-700">
              At Sanyla, we want you to be satisfied with your purchase. This Refund Policy explains when and how you can request a refund for credit pack purchases made via Stripe.
            </p>
            <p className="text-gray-700 mt-3">
              All credit purchases are processed through Stripe Checkout.
            </p>
          </section>

          {/* Section 2 - Eligibility */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('refund.section2.title')}
            </h2>
            
            {/* Eligible */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <p className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" />
                {t('refund.section2.eligible')}
              </p>
              <ul className="space-y-2 text-green-900">
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span><strong>Unused Credits:</strong> You have NOT used the credits you purchased</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span><strong>Within 14 Days:</strong> Request is made within 14 calendar days of purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span><strong>Proof of Purchase:</strong> You can provide the transaction ID or email receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span><strong>Technical Issue:</strong> Service malfunction prevented you from using credits (evaluated case-by-case)</span>
                </li>
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <X className="w-5 h-5" />
                {t('refund.section2.not_eligible')}
              </p>
              <ul className="space-y-2 text-red-900">
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span><strong>Credits Already Used:</strong> You generated campaigns, rewrites, or consumed credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span><strong>Past 14 Days:</strong> More than 14 days have passed since purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span><strong>Free Credits:</strong> Refund applies only to purchased credits (not free signup credits)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span><strong>Partial Use:</strong> You used some credits and want a refund for the remainder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span><strong>Dissatisfaction with Content:</strong> AI-generated content quality does not meet expectations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span><strong>Changed Mind:</strong> General change of mind after using the Service</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Pricing Table */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Credit Pack Pricing</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pack</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Credits</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Per Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Starter</td>
                    <td className="px-6 py-4 text-sm text-gray-700">100</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">€9.00</td>
                    <td className="px-6 py-4 text-sm text-gray-700">€0.09</td>
                  </tr>
                  <tr className="bg-orange-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Pro ⭐</td>
                    <td className="px-6 py-4 text-sm text-gray-700">500</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">€39.00</td>
                    <td className="px-6 py-4 text-sm text-gray-700">€0.078</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Power</td>
                    <td className="px-6 py-4 text-sm text-gray-700">1000</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">€69.00</td>
                    <td className="px-6 py-4 text-sm text-gray-700">€0.069</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-3">All prices are in Euros (EUR)</p>
          </section>

          {/* Section 3 - How to Request */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('refund.section3.title')}
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
                <p className="font-semibold text-blue-900 mb-3">
                  {t('refund.section3.step1')}
                </p>
                <p className="text-blue-900 text-sm">
                  Submit a refund request via our website contact form at:
                  <br/>
                  <a href="https://www.sanyla.site" className="underline font-semibold" target="_blank" rel="noopener">
                    https://www.sanyla.site
                  </a>
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6">
                <p className="font-semibold text-purple-900 mb-3">
                  {t('refund.section3.step2')}
                </p>
                <p className="text-purple-900 text-sm mb-2">Include the following in your request:</p>
                <ul className="list-disc pl-6 text-purple-900 text-sm space-y-1">
                  <li>Email address associated with your Sanyla account</li>
                  <li>Transaction ID (found in your Stripe email receipt, starts with <code>ch_</code> or <code>pi_</code>)</li>
                  <li>Purchase date</li>
                  <li>Reason for refund (optional but helpful)</li>
                  <li>Credit pack purchased (Starter, Pro, or Power)</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-green-50 border-l-4 border-green-600 p-6">
                <p className="font-semibold text-green-900 mb-3">
                  {t('refund.section3.step3')}
                </p>
                <p className="text-green-900 text-sm mb-2">We will verify:</p>
                <ul className="list-disc pl-6 text-green-900 text-sm space-y-1">
                  <li>Your account and purchase history</li>
                  <li>That credits have NOT been used</li>
                  <li>That the request is within 14 days of purchase</li>
                  <li>Payment status in Stripe</li>
                </ul>
              </div>

              {/* Step 4 - Decision */}
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
                <p className="font-semibold text-yellow-900 mb-3">Step 4: Refund Decision</p>
                <ul className="space-y-2 text-yellow-900 text-sm">
                  <li><strong>Approval:</strong> If eligible, refund processed within 5-7 business days</li>
                  <li><strong>Denial:</strong> If ineligible, we will explain why and offer alternatives (if applicable)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 - Processing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('refund.section4.title')}
            </h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Method</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                  <li>Refunds are processed through <strong>Stripe</strong> to the <strong>original payment method</strong></li>
                  <li>You will receive the refund to the same card or account used for purchase</li>
                  <li>Stripe handles all refund transactions securely</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-2">Timeline</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                  <li><strong>Approval:</strong> Refund initiated within 1-2 business days</li>
                  <li><strong>Processing:</strong> Stripe processes refunds within 5-7 business days</li>
                  <li><strong>Bank Posting:</strong> Your bank may take an additional 3-10 business days to post the refund</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Total Time:</strong> Expect up to 10-14 business days from approval to see the refund in your account.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-2">Currency</p>
                <p className="text-sm text-gray-700">
                  Refunds issued in <strong>Euros (EUR)</strong>. Currency conversion rates (if applicable) are determined by your card issuer.
                </p>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
            
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="font-semibold text-orange-900 mb-2">No Automatic Refunds</p>
                <p className="text-orange-900 text-sm">
                  Refunds are NOT automatic. You must manually request a refund via our support contact.
                  We do not automatically refund unused credits. Accounts closed with unused credits forfeit those credits
                  (unless a refund is requested before closure).
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="font-semibold text-red-900 mb-2">No Partial Refunds</p>
                <p className="text-red-900 text-sm">
                  We do NOT offer partial refunds. If you used even 1 credit, the entire purchase is non-refundable.
                  Credit packs are sold as a complete package.
                </p>
                <p className="text-red-900 text-sm mt-2">
                  <strong>Example:</strong> If you purchased 500 credits (Pro pack) and used 50 credits, you cannot receive
                  a refund for the remaining 450 credits.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="font-semibold text-blue-900 mb-2">What Counts as "Used Credits"</p>
                <p className="text-blue-900 text-sm mb-2">Credits are considered <strong>used</strong> if you have:</p>
                <ul className="list-disc pl-6 text-blue-900 text-sm space-y-1">
                  <li>Generated a campaign (full or partial)</li>
                  <li>Requested an AI post rewrite</li>
                  <li>Consumed credits through any Service feature</li>
                </ul>
                <p className="text-blue-900 text-sm mt-3 mb-2">Credits are <strong>NOT considered used</strong> if you:</p>
                <ul className="list-disc pl-6 text-blue-900 text-sm space-y-1">
                  <li>Only logged into your account</li>
                  <li>Browsed the dashboard</li>
                  <li>Connected social accounts</li>
                  <li>Scheduled but did NOT generate content</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disputes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disputes and Chargebacks</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-4">
              <p className="font-semibold text-yellow-900 mb-2">Contact Us First</p>
              <p className="text-yellow-900 text-sm">
                <strong>Before filing a chargeback with your bank</strong>, please contact us to resolve the issue.
                Chargebacks can take 60-90 days to resolve. We can often resolve issues faster through direct contact.
                Chargebacks may result in account suspension pending investigation.
              </p>
            </div>

            <p className="text-gray-700 text-sm">
              <strong>Chargeback Consequences:</strong> If you file a chargeback, we will provide evidence to your card issuer
              (purchase records, usage logs). Your account may be suspended until the dispute is resolved. If the chargeback
              is found to be fraudulent, your account may be permanently banned.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('refund.contact_support')}
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-900 mb-2">For refund requests or questions about this policy:</p>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Website:</strong> https://www.sanyla.site</li>
                <li><strong>Support:</strong> Use the contact form on our website</li>
                <li><strong>Subject Line:</strong> "Refund Request - [Your Email]"</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Response Time:</strong> We aim to respond to refund requests within 48 hours (1-2 business days).
              </p>
            </div>
          </section>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Related Documents:</p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/terms')}
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                Terms of Service
              </button>
              <button
                onClick={() => router.push('/privacy-policy')}
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="mt-8 bg-gray-900 text-white rounded-lg p-6">
            <p className="text-sm">
              BY PURCHASING CREDITS ON SANYLA, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO THIS REFUND POLICY.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
