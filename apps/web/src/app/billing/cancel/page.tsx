'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          You cancelled the checkout process. No charges were made to your account.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
