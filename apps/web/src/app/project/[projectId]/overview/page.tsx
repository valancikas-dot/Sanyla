'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectOverviewPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.getProject(params.projectId);
        setProject(res.data);
      } catch (error) {
        console.error('Failed to fetch project', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.projectId, router]);

  if (loading) {
    return <div className="p-8">Kraunama...</div>;
  }

  if (!project) {
    return <div className="p-8">Projektas nerastas</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-muted-foreground">{project.industry || 'Nepasirinkta industrija'}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/project/${params.projectId}/generate`)}>
            <CardHeader>
              <CardTitle>🎯 Generuoti turinį</CardTitle>
              <CardDescription>AI turinio kūrimas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Sukurk strategijas, postus, reels ir daugiau</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/project/${params.projectId}/content`)}>
            <CardHeader>
              <CardTitle>📝 Peržiūrėti turinį</CardTitle>
              <CardDescription>Naršyti sugeneruotą turinį</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Peržiūrėk visą sugeneruotą marketingo medžiagą</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/project/${params.projectId}/schedule`)}>
            <CardHeader>
              <CardTitle>📅 Planavimas</CardTitle>
              <CardDescription>Planuok postus</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Suplanuok turinio publikavimą</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/project/${params.projectId}/analytics`)}>
            <CardHeader>
              <CardTitle>📊 Analitika</CardTitle>
              <CardDescription>Sek rezultatus</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Peržiūrėk įžvalgas ir rekomendacijas</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/project/${params.projectId}/brand-kit`)}>
            <CardHeader>
              <CardTitle>🎨 Brand Kit</CardTitle>
              <CardDescription>Prekės ženklo nustatymai</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Atnaujink spalvas, toną ir brand'o informaciją</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projekto detalės</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Industrija</p>
                <p className="text-sm text-muted-foreground">{project.industry || 'Nenurodytas'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Lokacija</p>
                <p className="text-sm text-muted-foreground">{project.city}, {project.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Kalba</p>
                <p className="text-sm text-muted-foreground">{project.language}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tonas</p>
                <p className="text-sm text-muted-foreground">{project.tone}</p>
              </div>
              {project.brandColors && project.brandColors.length > 0 && (
                <div className="col-span-2">
                  <p className="text-sm font-medium mb-2">Brand spalvos</p>
                  <div className="flex gap-2">
                    {project.brandColors.map((color: string, i: number) => (
                      <div key={i} className="w-12 h-12 rounded border" style={{ backgroundColor: color }} title={color} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
