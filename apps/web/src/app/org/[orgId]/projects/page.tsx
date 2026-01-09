'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectsPage({ params }: { params: { orgId: string } }) {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.getProjects(params.orgId);
        setProjects(res.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [params.orgId]);

  if (loading) {
    return <div className="p-8">Kraunama...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projektai</h1>
          <Button onClick={() => router.push(`/org/${params.orgId}/projects/new`)}>
            Naujas projektas
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/project/${project.id}/overview`)}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.industry || 'Nenurodyta industrija'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {project.city}, {project.country}
                </p>
              </CardContent>
            </Card>
          ))}
          
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">Dar nėra projektų</p>
              <Button onClick={() => router.push(`/org/${params.orgId}/projects/new`)}>
                Sukurti pirmą projektą
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
