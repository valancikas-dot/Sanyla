'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.getAnalyticsSummary(params.projectId);
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [params.projectId]);

  const handleGenerateInsights = async () => {
    setGenerating(true);
    try {
      await api.generateInsights(params.projectId, summary);
      alert('Savaitinės įžvalgos sugeneruotos sėkmingai!');
      router.push(`/project/${params.projectId}/content?type=INSIGHT`);
    } catch (error: any) {
      alert(`Nepavyko sugeneruoti įžvalgų: ${error.response?.data?.message || error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8">Kraunama...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analitika</h1>

        {summary?.mock && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">{summary.message}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Seansai</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary?.sessions || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Vartotojai</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary?.users || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Peržiūros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary?.pageviews || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Konversijos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary?.conversions || 0}</p>
            </CardContent>
          </Card>
        </div>

        {summary?.topPages && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Populiariausi puslapiai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.topPages.map((page: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm">{page.page}</span>
                    <span className="text-sm font-medium">{page.views} peržiūrų</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>AI Savaitinės įžvalgos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sugeneruok AI įžvalgas ir rekomendacijas remiantis tavo analytics duomenimis.
            </p>
            <Button onClick={handleGenerateInsights} disabled={generating}>
              {generating ? 'Generuojama...' : 'Generuoti savaitines įžvalgas'}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button variant="outline" onClick={() => router.push(`/project/${params.projectId}/overview`)}>
            Grįžti į apžvalgą
          </Button>
        </div>
      </div>
    </div>
  );
}
