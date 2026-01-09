'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  trackAIStrategyGenerated,
  trackAICalendarGenerated,
  trackAIPostsGenerated,
  trackAIReelsGenerated,
  trackAIInsightsGenerated,
} from '@/lib/analytics';

export default function GeneratePage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleGenerate = async (
    type: string, 
    apiCall: () => Promise<any>,
    trackEvent?: (duration: number) => void
  ) => {
    setLoading(type);
    const startTime = Date.now();
    
    try {
      await apiCall();
      
      // Track analytics
      if (trackEvent) {
        const duration = Date.now() - startTime;
        trackEvent(duration);
      }
      
      alert(`${type} sugeneruota sėkmingai!`);
      router.push(`/project/${params.projectId}/content?type=${type}`);
    } catch (error: any) {
      alert(`Nepavyko sugeneruoti ${type}: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Turinio Generavimas</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>30 dienų strategija</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sugeneruok išsamią 30 dienų marketingo strategiją su savaitiniais planais, tikslais ir taktikomis.
              </p>
              <Button 
                className="w-full"
                onClick={() => handleGenerate(
                  'STRATEGY', 
                  () => api.generateStrategy(params.projectId),
                  (duration) => trackAIStrategyGenerated({
                    projectId: params.projectId,
                    language: 'ENGLISH', // TODO: get from project
                    duration,
                  })
                )}
                disabled={loading !== null}
              >
                {loading === 'STRATEGY' ? 'Generuojama...' : 'Generuoti strategiją'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Turinio kalendorius</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sugeneruok 4 savaičių turinio kalendorių su post temomis ir platformų rekomendacijomis.
              </p>
              <Button 
                className="w-full"
                onClick={() => handleGenerate(
                  'CALENDAR', 
                  () => api.generateCalendar(params.projectId),
                  (duration) => trackAICalendarGenerated({
                    projectId: params.projectId,
                    language: 'ENGLISH',
                    duration,
                  })
                )}
                disabled={loading !== null}
              >
                {loading === 'CALENDAR' ? 'Generuojama...' : 'Generuoti kalendorių'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>20 socialinių postų</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sugeneruok 20 paruoštų social media tekstų su hashtag'ais ir CTA.
              </p>
              <Button 
                className="w-full"
                onClick={() => handleGenerate(
                  'POST', 
                  () => api.generatePosts(params.projectId),
                  (duration) => trackAIPostsGenerated({
                    projectId: params.projectId,
                    count: 20,
                    language: 'ENGLISH',
                    duration,
                  })
                )}
                disabled={loading !== null}
              >
                {loading === 'POST' ? 'Generuojama...' : 'Generuoti postus'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8 Reels scenarijai</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sugeneruok 8 virusinius Reels/TikTok scenarijus su hook'ais, scenomis ir voiceover tekstais.
              </p>
              <Button 
                className="w-full"
                onClick={() => handleGenerate(
                  'REEL_SCRIPT', 
                  () => api.generateReels(params.projectId),
                  (duration) => trackAIReelsGenerated({
                    projectId: params.projectId,
                    count: 8,
                    language: 'ENGLISH',
                    duration,
                  })
                )}
                disabled={loading !== null}
              >
                {loading === 'REEL_SCRIPT' ? 'Generuojama...' : 'Generuoti Reels'}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Savaitiniai įžvalgos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sugeneruok AI įžvalgas ir rekomendacijas remiantis tavo analytics duomenimis.
              </p>
              <Button 
                className="w-full"
                onClick={() => handleGenerate(
                  'INSIGHT', 
                  () => api.generateInsights(params.projectId),
                  (duration) => trackAIInsightsGenerated({
                    projectId: params.projectId,
                    language: 'ENGLISH',
                    duration,
                  })
                )}
                disabled={loading !== null}
              >
                {loading === 'INSIGHT' ? 'Generuojama...' : 'Generuoti įžvalgas'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={() => router.push(`/project/${params.projectId}/overview`)}>
            Grįžti į apžvalgą
          </Button>
          <Button onClick={() => router.push(`/project/${params.projectId}/content`)}>
            Peržiūrėti visą turinį
          </Button>
        </div>
      </div>
    </div>
  );
}
