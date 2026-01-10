'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

type SocialAccount = {
  id: string;
  platform: string;
  accountName: string;
  accountId: string;
  status: string;
  metadata?: any;
  createdAt: string;
};

const PLATFORMS = [
  { id: 'FACEBOOK', name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
  { id: 'INSTAGRAM', name: 'Instagram', icon: '📷', color: 'bg-pink-600' },
  { id: 'LINKEDIN', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
  { id: 'TIKTOK', name: 'TikTok', icon: '🎵', color: 'bg-black' },
];

export default function SocialAccountsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, [projectId]);

  const loadAccounts = async () => {
    try {
      const response = await api.get(`/social/accounts/${projectId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = (platform: string) => {
    // OAuth flow URLs
    const redirectUri = `${window.location.origin}/api/auth/social/callback`;
    
    const oauthUrls: Record<string, string> = {
      FACEBOOK: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${redirectUri}&scope=pages_manage_posts,pages_read_engagement`,
      INSTAGRAM: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${redirectUri}&scope=instagram_basic,instagram_content_publish`,
      LINKEDIN: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&scope=w_member_social,r_liteprofile`,
      TIKTOK: `https://www.tiktok.com/auth/authorize?client_key=${process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY}&redirect_uri=${redirectUri}&scope=user.info.basic,video.publish`,
    };

    // Store projectId in localStorage for callback
    localStorage.setItem('connectProjectId', projectId);
    
    // Redirect to OAuth flow
    window.location.href = oauthUrls[platform];
  };

  const disconnectAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;

    try {
      await api.delete(`/social/accounts/${accountId}`);
      setAccounts(accounts.filter((a) => a.id !== accountId));
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      alert('Failed to disconnect account');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Social Media Accounts</h1>
        <p className="text-gray-400">
          Connect your social media accounts to publish and manage content
        </p>
      </div>

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Connected Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => {
              const platform = PLATFORMS.find((p) => p.id === account.platform);
              return (
                <div
                  key={account.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${platform?.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                        {platform?.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{account.accountName}</h3>
                        <p className="text-sm text-gray-400">{platform?.name}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        account.status === 'ACTIVE'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {account.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => disconnectAccount(account.id)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Connect New Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORMS.map((platform) => {
            const isConnected = accounts.some((a) => a.platform === platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => !isConnected && connectPlatform(platform.id)}
                disabled={isConnected}
                className={`${platform.color} ${
                  isConnected ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                } text-white rounded-lg p-6 transition-opacity`}
              >
                <div className="text-4xl mb-3">{platform.icon}</div>
                <h3 className="font-semibold mb-1">{platform.name}</h3>
                <p className="text-sm opacity-90">
                  {isConnected ? 'Connected' : 'Click to connect'}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
