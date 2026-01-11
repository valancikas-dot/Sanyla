export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Data Deletion Instructions</h1>
        
        <div className="prose prose-gray">
          <h2 className="text-xl font-semibold mt-6 mb-3">How to Request Data Deletion</h2>
          
          <p className="mb-4">
            If you have used your Facebook account to log into Sanyla and wish to delete your data, 
            please follow these steps:
          </p>

          <ol className="list-decimal list-inside space-y-3 mb-6">
            <li>Log into your Sanyla account at <a href="https://sanyla.site" className="text-blue-600 hover:underline">sanyla.site</a></li>
            <li>Go to your Profile Settings</li>
            <li>Click "Delete Account"</li>
            <li>Confirm deletion</li>
          </ol>

          <p className="mb-4">
            Alternatively, you can send a data deletion request to: 
            <a href="mailto:support@sanyla.site" className="text-blue-600 hover:underline ml-1">
              support@sanyla.site
            </a>
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">What Data Will Be Deleted</h2>
          
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Your profile information</li>
            <li>Projects and content you created</li>
            <li>Social media connections and tokens</li>
            <li>All associated data</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">Timeline</h2>
          
          <p className="mb-4">
            Data deletion requests are processed within 30 days. You will receive a confirmation 
            email once your data has been permanently deleted.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Revoking Facebook Access</h2>
          
          <p className="mb-4">
            You can also revoke Sanyla's access to your Facebook data directly:
          </p>

          <ol className="list-decimal list-inside space-y-2 mb-6">
            <li>Go to Facebook Settings & Privacy → Settings</li>
            <li>Click "Apps and Websites"</li>
            <li>Find "Sanyla Marketing" and click "Remove"</li>
          </ol>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: January 11, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
