'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Zap, TrendingUp, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface AdminMetrics {
  timestamp: string;
  users: {
    total: number;
    new7d: number;
    active7d: number;
  };
  campaigns: {
    last7d: number;
    last30d: number;
  };
  posting: {
    scheduled7d: number;
    posted7d: number;
    failed7d: number;
    successRate7d: string;
    topFailures30d: Array<{ error: string; count: number }>;
  };
  revenue: {
    purchases30d: number;
    creditsSold30d: number;
    rewrites30d: number;
  };
  performance: {
    avgEngagementRate7d: string;
    underperformingPosts48h: number;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await fetch('/api/admin/metrics');
      
      if (response.status === 403) {
        setError('Unauthorized: Admin access required');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err: any) {
      console.error('Failed to fetch admin metrics:', err);
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    fetchMetrics();
  }, [status]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {session?.user?.email} • Updated: {new Date(metrics.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Users
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.users.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">New (7d)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{metrics.users.new7d}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active (7d)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{metrics.users.active7d}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-600" />
            Campaigns
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{metrics.campaigns.last7d}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{metrics.campaigns.last30d}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Posting (7d)
          </h2>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-blue-600">{metrics.posting.scheduled7d}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Posted</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-green-600">{metrics.posting.posted7d}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-red-600">{metrics.posting.failed7d}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-purple-600">{metrics.posting.successRate7d}</div></CardContent></Card>
          </div>
          {metrics.posting.topFailures30d.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium">Top Failures (30d)</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left font-semibold text-gray-700">Error</th><th className="px-4 py-2 text-right font-semibold text-gray-700">Count</th></tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {metrics.posting.topFailures30d.map((f, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900 font-mono text-xs max-w-md truncate">{f.error}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">{f.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Revenue (30d)
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Purchases</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-green-600">{metrics.revenue.purchases30d}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Credits Sold</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-purple-600">{metrics.revenue.creditsSold30d}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Rewrites</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-blue-600">{metrics.revenue.rewrites30d}</div></CardContent></Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            Performance
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Avg Engagement (7d)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-blue-600">{metrics.performance.avgEngagementRate7d}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Underperforming (48h)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-orange-600">{metrics.performance.underperformingPosts48h}</div></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
