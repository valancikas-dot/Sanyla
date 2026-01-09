'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContentPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const typeFilter = searchParams?.get('type') || undefined;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.getContent(params.projectId, typeFilter);
        setContent(res.data);
      } catch (error) {
        console.error('Failed to fetch content', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [params.projectId, typeFilter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nukopijuota į iškarpinę!');
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading) {
    return <div className="p-8">Kraunama...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sugeneruotas turinys</h1>
          <Button onClick={() => router.push(`/project/${params.projectId}/generate`)}>
            Generuoti daugiau
          </Button>
        </div>

        <div className="mb-4 flex gap-2">
          <Button variant={!typeFilter ? 'default' : 'outline'} onClick={() => router.push(`/project/${params.projectId}/content`)}>Viskas</Button>
          <Button variant={typeFilter === 'STRATEGY' ? 'default' : 'outline'} onClick={() => router.push(`/project/${params.projectId}/content?type=STRATEGY`)}>Strategija</Button>
          <Button variant={typeFilter === 'CALENDAR' ? 'default' : 'outline'} onClick={() => router.push(`/project/${params.projectId}/content?type=CALENDAR`)}>Kalendorius</Button>
          <Button variant={typeFilter === 'POST' ? 'default' : 'outline'} onClick={() => router.push(`/project/${params.projectId}/content?type=POST`)}>Postai</Button>
          <Button variant={typeFilter === 'REEL_SCRIPT' ? 'default' : 'outline'} onClick={() => router.push(`/project/${params.projectId}/content?type=REEL_SCRIPT`)}>Reels</Button>
          <Button variant={typeFilter === 'INSIGHT' ? 'default' : 'outline'} onClick={() => router.push(`/project/${params.projectId}/content?type=INSIGHT`)}>Įžvalgos</Button>
        </div>

        <div className="grid gap-4">
          {content.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{item.title || item.type}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(JSON.stringify(item.content, null, 2))}>
                      Kopijuoti
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadJSON(item.content, `${item.type}-${item.id}.json`)}>
                      Atsisiųsti
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                  <pre className="text-xs">{JSON.stringify(item.content, null, 2)}</pre>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sukurta: {new Date(item.createdAt).toLocaleString('lt-LT')}
                </p>
              </CardContent>
            </Card>
          ))}

          {content.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Dar nesugeneruotas joks turinys</p>
              <Button onClick={() => router.push(`/project/${params.projectId}/generate`)}>
                Generuoti turinį
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
