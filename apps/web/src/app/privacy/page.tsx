export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-gray">
          <p className="text-sm text-gray-600 mb-6">Last updated: January 11, 2026</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
          <p className="mb-4">
            Sanyla ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, and share information when you use our AI-powered marketing 
            automation platform.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Account Information</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Name and email address</li>
            <li>Profile information from Google or Facebook (if you sign in via OAuth)</li>
            <li>Password (encrypted)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">Project Data</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Marketing projects you create</li>
            <li>AI-generated content and images</li>
            <li>Social media account connections</li>
            <li>Analytics and performance data</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">Usage Information</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Feature usage and interactions</li>
            <li>Error reports and diagnostics</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>To provide and improve our AI marketing automation services</li>
            <li>To generate marketing content using OpenAI GPT-4 and DALL-E</li>
            <li>To post content to your connected social media accounts</li>
            <li>To send you important updates about the service</li>
            <li>To analyze usage patterns and improve features</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">Information Sharing</h2>
          <p className="mb-4">We share your information with:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>OpenAI:</strong> To generate AI content (GPT-4, DALL-E)</li>
            <li><strong>Facebook/Instagram:</strong> When you connect and authorize posting</li>
            <li><strong>LinkedIn:</strong> When you connect and authorize posting</li>
            <li><strong>Railway:</strong> Our hosting infrastructure provider</li>
          </ul>
          <p className="mb-4">
            We do NOT sell your personal information to third parties.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures including:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Encrypted data transmission (HTTPS/SSL)</li>
            <li>Encrypted password storage</li>
            <li>Secure database access controls</li>
            <li>OAuth 2.0 for social media connections</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion (see our <a href="/data-deletion" className="text-blue-600 hover:underline">Data Deletion page</a>)</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">Cookies</h2>
          <p className="mb-4">
            We use essential cookies for authentication and session management. We do not use 
            advertising or tracking cookies.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Children's Privacy</h2>
          <p className="mb-4">
            Our service is not intended for users under 18 years of age. We do not knowingly 
            collect information from children.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of significant 
            changes via email or through the platform.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4">
            Email: <a href="mailto:support@sanyla.site" className="text-blue-600 hover:underline">support@sanyla.site</a>
          </p>

          <div className="mt-8 p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-700">
              <strong>GDPR Compliance:</strong> If you are located in the European Economic Area (EEA), 
              you have additional rights under GDPR, including the right to data portability and the 
              right to lodge a complaint with a supervisory authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
