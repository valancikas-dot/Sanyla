'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getLegalTranslation } from '@/lib/i18n/legal-translations';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Shield, Check } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const t = (key: string) => getLegalTranslation(language, key as any);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t('legal.privacy_title')}
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">
            {t('privacy.summary.title')}
          </h2>
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-900">
                  {t(`privacy.summary.point${i}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose prose-green max-w-none">
          {/* Section 1 - Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.section1.title')}
            </h2>
            <p className="text-gray-700">
              This Privacy Policy explains how Sanyla collects, uses, shares, and protects your personal information when you use our service at https://www.sanyla.site.
            </p>
            <p className="text-gray-700 mt-3">
              By using Sanyla, you agree to the data practices described in this Privacy Policy.
            </p>
          </section>

          {/* Section 2 - Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.section2.title')}
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              Personal Information You Provide
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Account Information:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Email address</li>
                  <li>Password (encrypted, never stored in plain text)</li>
                  <li>Account settings and preferences</li>
                  <li>Language preference (one of 17 supported languages)</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">Social Account Connections:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Instagram account tokens and permissions</li>
                  <li>Facebook account tokens and permissions</li>
                  <li>LinkedIn account tokens and permissions</li>
                  <li>Social account profile information (username, profile picture, follower count)</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">Payment Information (via Stripe):</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Payment metadata (transaction ID, amount, date)</li>
                  <li>Purchase history (credit pack purchases)</li>
                  <li>Billing country (for tax purposes)</li>
                </ul>
                <p className="text-sm text-green-700 mt-2 font-semibold">
                  ✅ We do NOT store credit card numbers, CVV, or banking details (handled exclusively by Stripe)
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              Information We Collect Automatically
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Credits consumed and remaining balance</li>
              <li>Campaigns generated (count, dates, languages used)</li>
              <li>Posts published (count, platforms, timestamps)</li>
              <li>Performance metrics (impressions, likes, comments, engagement rate)</li>
              <li>IP address and browser information</li>
              <li>Device type and operating system</li>
            </ul>
          </section>

          {/* Section 3 - How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.section3.title')}
            </h2>
            <p className="text-gray-700 mb-4">We use your data for the following purposes:</p>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="font-semibold text-blue-900 mb-2">Service Provision</p>
                <ul className="list-disc pl-6 text-blue-900 space-y-1 text-sm">
                  <li>Create and maintain your account</li>
                  <li>Generate AI campaigns in your selected language</li>
                  <li>Auto-publish posts to your connected social accounts</li>
                  <li>Collect and display engagement metrics</li>
                  <li>Track credit balance and usage</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
                <p className="font-semibold text-purple-900 mb-2">Payment Processing</p>
                <ul className="list-disc pl-6 text-purple-900 space-y-1 text-sm">
                  <li>Process credit pack purchases via Stripe</li>
                  <li>Maintain transaction records for refunds</li>
                  <li>Prevent fraud and unauthorized transactions</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-600 p-4">
                <p className="font-semibold text-green-900 mb-2">Communication</p>
                <ul className="list-disc pl-6 text-green-900 space-y-1 text-sm">
                  <li>Send transactional emails (purchase confirmations, password resets)</li>
                  <li>Respond to support requests</li>
                  <li>Notify you of important Service changes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 - Data Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.section4.title')}
            </h2>
            <p className="text-gray-700 mb-4">
              We share your data with the following third parties <strong>only</strong> to provide the Service:
            </p>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Stripe (Payment Processing)</p>
                <p className="text-sm text-gray-700">
                  Purpose: Process credit purchases<br/>
                  Data Shared: Email, purchase amount, transaction metadata<br/>
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                    Stripe's Privacy Policy →
                  </a>
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Meta Platforms (Instagram, Facebook)</p>
                <p className="text-sm text-gray-700">
                  Purpose: Publish posts, collect metrics<br/>
                  Data Shared: Access tokens, post content, scheduling data<br/>
                  <a href="https://www.facebook.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                    Meta's Privacy Policy →
                  </a>
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">LinkedIn</p>
                <p className="text-sm text-gray-700">
                  Purpose: Publish posts, collect metrics<br/>
                  Data Shared: Access tokens, post content, scheduling data<br/>
                  <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                    LinkedIn's Privacy Policy →
                  </a>
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">OpenAI (AI Content Generation)</p>
                <p className="text-sm text-gray-700">
                  Purpose: Generate campaign text and content<br/>
                  Data Shared: Campaign prompts, language preferences (no personally identifiable information)<br/>
                  <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                    OpenAI's Privacy Policy →
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="font-semibold text-red-900 mb-3">What We Do NOT Do:</p>
              <ul className="space-y-2 text-red-900">
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span>We do NOT sell your personal data to third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span>We do NOT use your data for targeted advertising</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span>We do NOT share data with data brokers or marketing companies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span>
                  <span>We do NOT train public AI models on your personal content</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 - Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.section5.title')}
            </h2>
            <p className="text-gray-700 mb-4">We retain your data for the following periods:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Account Data:</strong> Until you delete your account or request deletion</li>
              <li><strong>Transaction Records:</strong> 7 years (for accounting and tax compliance)</li>
              <li><strong>Usage Logs:</strong> 90 days (for troubleshooting and analytics)</li>
              <li><strong>Campaign Content:</strong> Until you delete campaigns or close your account</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>After Account Deletion:</strong> Personal information is anonymized or deleted within 30 days.
              Transaction records are retained for legal compliance but anonymized.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.your_rights.title')}
            </h2>
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal data:</p>
            
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="font-semibold text-blue-900">{t('privacy.your_rights.access')}</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
                <p className="font-semibold text-purple-900">{t('privacy.your_rights.deletion')}</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-600 p-4">
                <p className="font-semibold text-green-900">{t('privacy.your_rights.correction')}</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
                <p className="font-semibold text-yellow-900">{t('privacy.your_rights.export')}</p>
              </div>
            </div>

            <p className="text-gray-700 mt-6">
              <strong>How to Exercise Your Rights:</strong> Contact us via the website contact form at https://www.sanyla.site
              with your request. We will respond within 30 days.
            </p>
          </section>

          {/* Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>HTTPS/SSL Encryption:</strong> All data transmitted over secure connections</li>
              <li><strong>Password Encryption:</strong> Passwords hashed using bcrypt (never stored in plain text)</li>
              <li><strong>Access Controls:</strong> Role-based access to data and systems</li>
              <li><strong>Token Security:</strong> Social account tokens encrypted at rest</li>
              <li><strong>Stripe:</strong> PCI-DSS Level 1 certified payment processor</li>
            </ul>
          </section>

          {/* Multilingual Notice */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Multilingual Platform</h2>
            <p className="text-gray-700">
              Sanyla supports <strong>17 languages</strong> for UI and content generation.
              Your language preference is stored to personalize your experience.
              AI-generated content is processed by third-party AI services (OpenAI).
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              For questions, requests, or concerns about this Privacy Policy:<br/>
              <strong>Website:</strong> https://www.sanyla.site<br/>
              <strong>Response Time:</strong> We aim to respond within 30 days.
            </p>
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
                onClick={() => router.push('/refund-policy')}
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                Refund Policy
              </button>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="mt-8 bg-gray-900 text-white rounded-lg p-6">
            <p className="text-sm">
              BY USING SANYLA, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY AND AGREE TO OUR DATA PRACTICES.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
