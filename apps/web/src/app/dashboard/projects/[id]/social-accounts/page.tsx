'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Loader2,
  Facebook,
  Instagram,
  Linkedin,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  accountId: string;
  isActive: boolean;
  createdAt: string;
}

export default function SocialAccountsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, [projectId]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`/api/social-accounts?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectPlatform = async (platform: string) => {
    setConnectingPlatform(platform);
    
    try {
      // Initiate OAuth flow
      const res = await fetch('/api/social-accounts/oauth/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, projectId }),
      });

      if (res.ok) {
        const { authUrl } = await res.json();
        // Redirect to OAuth provider
        window.location.href = authUrl;
      } else {
        alert('Failed to initiate OAuth');
      }
    } catch (error) {
      console.error('OAuth error:', error);
      alert('Error connecting account');
    } finally {
      setConnectingPlatform(null);
    }
  };

  const disconnectAccount = async (accountId: string) => {
    if (!confirm('Ar tikrai norite atjungti šią paskyrą?')) return;

    try {
      const res = await fetch(`/api/social-accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchAccounts();
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-6 w-6 text-blue-600" />;
      case 'instagram': return <Instagram className="h-6 w-6 text-pink-600" />;
      case 'linkedin': return <Linkedin className="h-6 w-6 text-blue-700" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'from-blue-500 to-blue-600';
      case 'instagram': return 'from-pink-500 via-purple-500 to-orange-500';
      case 'linkedin': return 'from-blue-600 to-blue-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const isConnected = (platform: string) => {
    return accounts.some(acc => acc.platform === platform && acc.isActive);
  };

  const getAccount = (platform: string) => {
    return accounts.find(acc => acc.platform === platform && acc.isActive);
  };

  const platforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      description: 'Postinkite į Facebook puslapius',
      available: true 
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      description: 'Postinkite nuotraukas ir Reels',
      available: true 
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      description: 'Dalinkitės profesionaliu turiniu',
      available: true 
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      description: 'Video turinys (netrukus)',
      available: false 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Atgal į projektą
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔗 Socialiniai Tinklai
          </h1>
          <p className="text-gray-600 mt-2">
            Prijunkite paskyras automatiniam postinimui
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Kaip veikia automatinis postinimas?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Prijunkite savo socialines paskyras</li>
                  <li>Sistema saugiai išsaugos prieigos raktus</li>
                  <li>Patvirtinti posts bus automatiškai skelbiami pagal grafiką</li>
                  <li>Galite bet kada atjungti paskyras</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => {
            const connected = isConnected(platform.id);
            const account = getAccount(platform.id);

            return (
              <Card key={platform.id} className={`relative overflow-hidden ${connected ? 'border-green-300' : ''}`}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getPlatformColor(platform.id)}`} />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(platform.id)}
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <p className="text-sm text-gray-600">{platform.description}</p>
                      </div>
                    </div>
                    {connected && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-5 w-5" />
                        <span className="text-sm font-medium">Prijungta</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {connected && account ? (
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Paskyra:</div>
                        <div className="font-medium">{account.accountName || account.accountId}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Prijungta: {new Date(account.createdAt).toLocaleDateString('lt-LT')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => connectPlatform(platform.id)}
                          disabled={connectingPlatform === platform.id}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Atnaujinti
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => disconnectAccount(account.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Atjungti
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => connectPlatform(platform.id)}
                      disabled={!platform.available || connectingPlatform === platform.id}
                      className={`w-full bg-gradient-to-r ${getPlatformColor(platform.id)} text-white`}
                    >
                      {connectingPlatform === platform.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Jungiamasi...
                        </>
                      ) : platform.available ? (
                        `Prijungti ${platform.name}`
                      ) : (
                        'Netrukus'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Connected Accounts Summary */}
        {accounts.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Prijungtos paskyros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-green-600">{accounts.filter(a => a.isActive).length}</div>
                <div className="text-sm text-gray-600">Aktyvios paskyros</div>
                <p className="text-xs text-gray-500 mt-2">
                  Automatinis postinimas aktyvuotas šioms platformoms
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
