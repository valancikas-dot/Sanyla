'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  RefreshCw, 
  Loader2,
  Database,
  Bot,
  Link as LinkIcon,
  Clock,
  AlertCircle
} from 'lucide-react';

interface HealthCheck {
  timestamp: string;
  status: string;
  services: {
    database: {
      status: string;
      userCount?: number;
      error?: string;
    };
    openai: {
      status: string;
      enabled: boolean;
    };
    oauth: {
      facebook: { configured: boolean };
      linkedin: { configured: boolean };
    };
    cron: {
      configured: boolean;
    };
  };
}

export default function SystemHealthPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
      case 'healthy':
      case 'configured':
        return 'text-green-600 bg-green-50';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
      case 'unhealthy':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (configured: boolean) => {
    return configured ? (
      <Check className="h-5 w-5 text-green-600" />
    ) : (
      <X className="h-5 w-5 text-red-600" />
    );
  };

  if (isLoading && !health) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const setupComplete = health && 
    health.status === 'healthy' &&
    health.services.oauth.facebook.configured &&
    health.services.oauth.linkedin.configured &&
    health.services.cron.configured;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🏥 System Health
            </h1>
            <Button onClick={fetchHealth} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {lastCheck && (
            <p className="text-sm text-gray-600">
              Last checked: {lastCheck.toLocaleTimeString('lt-LT')}
            </p>
          )}
        </div>

        {/* Overall Status */}
        {health && (
          <Card className={`mb-6 ${getStatusColor(health.status)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold capitalize">{health.status}</h2>
                  <p className="text-sm mt-1">
                    {setupComplete 
                      ? '🎉 Platform fully configured and ready!'
                      : 'ℹ️ Some features require additional setup'
                    }
                  </p>
                </div>
                {setupComplete ? (
                  <Check className="h-12 w-12" />
                ) : (
                  <AlertCircle className="h-12 w-12" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Checks */}
        {health && (
          <div className="grid gap-6">
            {/* Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(health.services.database.status === 'ok')}
                      <span className="font-medium capitalize">
                        {health.services.database.status}
                      </span>
                    </div>
                    {health.services.database.userCount !== undefined && (
                      <p className="text-sm text-gray-600 mt-1">
                        Users: {health.services.database.userCount}
                      </p>
                    )}
                    {health.services.database.error && (
                      <p className="text-sm text-red-600 mt-1">
                        Error: {health.services.database.error}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OpenAI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  OpenAI API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getStatusIcon(health.services.openai.enabled)}
                  <span className="font-medium">
                    {health.services.openai.enabled ? 'Configured' : 'Not configured'}
                  </span>
                </div>
                {health.services.openai.enabled && (
                  <p className="text-sm text-gray-600 mt-2">
                    ✅ GPT-4 and DALL-E 3 ready
                  </p>
                )}
              </CardContent>
            </Card>

            {/* OAuth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-green-600" />
                  Social Media OAuth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Facebook/Instagram</span>
                    {getStatusIcon(health.services.oauth.facebook.configured)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>LinkedIn</span>
                    {getStatusIcon(health.services.oauth.linkedin.configured)}
                  </div>
                </div>
                {(!health.services.oauth.facebook.configured || !health.services.oauth.linkedin.configured) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 See <code className="bg-blue-100 px-1 rounded">QUICK-SETUP.md</code> to configure OAuth
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cron */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Automated Posting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getStatusIcon(health.services.cron.configured)}
                  <span className="font-medium">
                    {health.services.cron.configured ? 'Configured' : 'Not configured'}
                  </span>
                </div>
                {!health.services.cron.configured && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 See <code className="bg-blue-100 px-1 rounded">RAILWAY-CRON-SETUP.md</code> to enable auto-posting
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Setup Progress */}
        {health && !setupComplete && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle>⚠️ Setup Incomplete</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                To enable full automation, complete these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {!health.services.oauth.facebook.configured && (
                  <li>Create Facebook Developer App (2 min)</li>
                )}
                {!health.services.oauth.linkedin.configured && (
                  <li>Create LinkedIn Developer App (2 min)</li>
                )}
                {!health.services.cron.configured && (
                  <li>Configure CRON_SECRET (1 min)</li>
                )}
                <li>Follow instructions in <code className="bg-yellow-100 px-1 rounded">QUICK-SETUP.md</code></li>
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {setupComplete && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Platform Ready!
                </h3>
                <p className="text-green-800">
                  All systems operational. Full automation enabled.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
