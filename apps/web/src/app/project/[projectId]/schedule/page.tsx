'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SchedulePage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const [content, setContent] = useState<any[]>([]);
  const [scheduleJobs, setScheduleJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, scheduleRes] = await Promise.all([
          api.getContent(params.projectId),
          api.getSchedule(params.projectId),
        ]);
        setContent(contentRes.data);
        setScheduleJobs(scheduleRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.projectId]);

  const handleSchedule = async (contentItemId: string, platform: string, dateTime: string) => {
    try {
      await api.createSchedule(params.projectId, {
        contentItemId,
        platform,
        scheduledFor: dateTime,
      });
      alert('Turinys suplanuotas sėkmingai!');
      window.location.reload();
    } catch (error: any) {
      alert(`Nepavyko suplanuoti: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancel = async (jobId: string) => {
    try {
      await api.cancelSchedule(jobId);
      alert('Planavimas atšauktas!');
      window.location.reload();
    } catch (error: any) {
      alert(`Nepavyko atšaukti: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div className="p-8">Kraunama...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Planuoti turinį</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold mb-4">Turimas turinys</h2>
            <div className="space-y-4">
              {content.filter(item => item.type === 'POST' || item.type === 'REEL_SCRIPT').map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">{item.title || item.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <select className="w-full p-2 border rounded" id={`platform-${item.id}`}>
                        <option value="GENERIC">Bendras eksportas</option>
                        <option value="META">Meta (Facebook/Instagram)</option>
                        <option value="TIKTOK">TikTok</option>
                        <option value="LINKEDIN">LinkedIn</option>
                        <option value="YOUTUBE">YouTube</option>
                      </select>
                      <Input type="datetime-local" id={`datetime-${item.id}`} />
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const platform = (document.getElementById(`platform-${item.id}`) as HTMLSelectElement).value;
                          const dateTime = (document.getElementById(`datetime-${item.id}`) as HTMLInputElement).value;
                          if (dateTime) {
                            handleSchedule(item.id, platform, new Date(dateTime).toISOString());
                          } else {
                            alert('Prašome pasirinkti datą ir laiką');
                          }
                        }}
                      >
                        Planuoti
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.filter(item => item.type === 'POST' || item.type === 'REEL_SCRIPT').length === 0 && (
                <p className="text-muted-foreground">Nėra turinio, kurį galima planuoti. Pirmiausia sugeneruokite postų arba reels.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Suplanuoti įrašai</h2>
            <div className="space-y-4">
              {scheduleJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <CardTitle className="text-sm flex justify-between items-center">
                      <span>{job.contentItem?.title || job.contentItem?.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        job.status === 'POSTED' ? 'bg-green-100 text-green-800' :
                        job.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status === 'POSTED' ? 'PASKELBTA' :
                         job.status === 'SCHEDULED' ? 'SUPLANUOTA' :
                         job.status === 'FAILED' ? 'NEPAVYKO' : job.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Platforma: {job.platform}</p>
                    <p className="text-sm text-muted-foreground">
                      Suplanuota: {new Date(job.scheduledFor).toLocaleString('lt-LT')}
                    </p>
                    {job.status === 'SCHEDULED' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="mt-2"
                        onClick={() => handleCancel(job.id)}
                      >
                        Atšaukti
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {scheduleJobs.length === 0 && (
                <p className="text-muted-foreground">Dar nėra suplanuotų įrašų.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="outline" onClick={() => router.push(`/project/${params.projectId}/overview`)}>
            Grįžti į apžvalgą
          </Button>
        </div>
      </div>
    </div>
  );
}
