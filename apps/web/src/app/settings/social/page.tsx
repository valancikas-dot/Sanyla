'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Instagram, Facebook, Youtube, Linkedin, Link as LinkIcon, Check, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/navigation';

interface ConnectedAccount {
  id: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'LINKEDIN' | 'YOUTUBE';
  accountName: string;
  accountId: string;
  profilePicture?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DISCONNECTED';
  connectedAt: Date;
  expiresAt: Date;
  permissions: string[];
}

const PLATFORMS = [
  {
    id: 'INSTAGRAM',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600',
    description: 'Postink į Instagram feed ir Reels',
    permissions: ['Publikuoti postus', 'Publikuoti Reels', 'Stebėti analitika'],
  },
  {
    id: 'FACEBOOK',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    description: 'Postink į Facebook puslapius',
    permissions: ['Publikuoti postus', 'Valdyti puslapius', 'Stebėti analitika'],
  },
  {
    id: 'TIKTOK',
    name: 'TikTok',
    icon: Youtube,
    color: 'bg-black',
    description: 'Publikuok video į TikTok',
    permissions: ['Publikuoti video', 'Valdyti turinį', 'Stebėti performansą'],
  },
  {
    id: 'LINKEDIN',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700',
    description: 'Dalinkis B2B turiniu LinkedIn',
    permissions: ['Publikuoti postus', 'Valdyti puslapius', 'Stebėti engagement'],
  },
];

export default function SocialConnectionsPage() {
  const router = useRouter();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    // Mock data - in production, fetch from API
    setConnectedAccounts([
      {
        id: '1',
        platform: 'INSTAGRAM',
        accountName: '@jūsų_paskyra',
        accountId: '12345',
        profilePicture: 'https://via.placeholder.com/100',
        status: 'ACTIVE',
        connectedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        permissions: ['publish', 'analytics'],
      },
    ]);
  };

  const handleConnect = async (platform: string) => {
    setLoading(platform);

    try {
      // In production, call backend API to initiate OAuth
      const response = await fetch('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          redirectUri: `${window.location.origin}/settings/social/callback`,
        }),
      });

      const { authUrl } = await response.json();
      
      // Redirect to OAuth authorization
      window.location.href = authUrl;
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Nepavyko prisijungti. Bandykite dar kartą.');
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Ar tikrai norite atjungti šią paskyrą?')) return;

    try {
      await fetch(`/api/social/disconnect/${accountId}`, {
        method: 'DELETE',
      });

      setConnectedAccounts(accounts => 
        accounts.filter(acc => acc.id !== accountId)
      );
    } catch (error) {
      console.error('Disconnect failed:', error);
      alert('Nepavyko atjungti paskyros.');
    }
  };

  const handleRefreshToken = async (accountId: string) => {
    try {
      await fetch(`/api/social/refresh/${accountId}`, {
        method: 'POST',
      });

      await loadConnectedAccounts();
      alert('Token atnaujintas!');
    } catch (error) {
      console.error('Refresh failed:', error);
      alert('Nepavyko atnaujinti token.');
    }
  };

  const getConnectedAccount = (platform: string) => {
    return connectedAccounts.find(acc => acc.platform === platform && acc.status === 'ACTIVE');
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <LinkIcon className="inline-block w-8 h-8 mr-3" />
            Socialinių Tinklų Paskyros
          </h1>
          <p className="text-muted-foreground text-lg">
            Prijunkite savo socialinių tinklų paskyras, kad galėtumėte publikuoti AI sugeneruotas reklamą automatiškai
          </p>
        </div>

        {/* Connected Accounts Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {connectedAccounts.filter(acc => acc.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-muted-foreground">Aktyvios paskyros</div>
          </div>
          <div className="glass-card p-6">
            <div className="text-3xl font-bold text-accent-green mb-2">
              {PLATFORMS.length}
            </div>
            <div className="text-sm text-muted-foreground">Galimos platformos</div>
          </div>
          <div className="glass-card p-6">
            <div className="text-3xl font-bold text-accent-blue mb-2">
              {connectedAccounts.filter(acc => 
                acc.expiresAt > new Date() && acc.status === 'ACTIVE'
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">Galiojantys token'ai</div>
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-4">
          {PLATFORMS.map((platform) => {
            const connected = getConnectedAccount(platform.id);
            const Icon = platform.icon;

            return (
              <div key={platform.id} className="glass-card p-6">
                <div className="flex items-start justify-between">
                  {/* Platform Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{platform.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {platform.description}
                      </p>

                      {/* Connected Account Info */}
                      {connected ? (
                        <div className="bg-surface/50 rounded-lg p-4 mb-3">
                          <div className="flex items-center gap-3 mb-2">
                            {connected.profilePicture && (
                              <img 
                                src={connected.profilePicture} 
                                alt={connected.accountName}
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                            <div>
                              <div className="font-semibold">{connected.accountName}</div>
                              <div className="text-sm text-muted-foreground">
                                Prijungta: {new Date(connected.connectedAt).toLocaleDateString('lt-LT')}
                              </div>
                            </div>
                          </div>

                          {/* Token expiration */}
                          <div className="flex items-center gap-2 text-sm">
                            {connected.expiresAt > new Date() ? (
                              <>
                                <Check className="w-4 h-4 text-accent-green" />
                                <span className="text-accent-green">
                                  Galioja iki {new Date(connected.expiresAt).toLocaleDateString('lt-LT')}
                                </span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-accent-orange" />
                                <span className="text-accent-orange">Token nebegalioja</span>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-surface/30 rounded-lg p-4 mb-3">
                          <div className="text-sm text-muted-foreground mb-2">
                            Leidžia sistemai:
                          </div>
                          <ul className="space-y-1">
                            {platform.permissions.map((perm, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-primary" />
                                <span>{perm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {connected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefreshToken(connected.id)}
                          className="whitespace-nowrap"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Atnaujinti
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnect(connected.id)}
                          className="whitespace-nowrap"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Atjungti
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleConnect(platform.id)}
                        disabled={loading === platform.id}
                        size="lg"
                        className="whitespace-nowrap"
                      >
                        {loading === platform.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Jungiamasi...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Prijungti
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 glass-card p-6 bg-primary/5">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Svarbu žinoti
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Jūsų prisijungimo duomenys saugiai užšifruojami</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Token'ai galioja 60 dienų ir automatiškai atnaujinami</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Galite bet kada atjungti paskyras nustatymuose</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Sistema niekada neprašo jūsų slaptažodžio</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
