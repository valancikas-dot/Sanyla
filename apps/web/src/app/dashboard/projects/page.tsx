'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FolderKanban, Loader2, Calendar, Building2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  industry: string | null;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projektai</h1>
            <p className="text-gray-600 mt-1">Valdykite savo marketingo projektus</p>
          </div>
          <Link href="/dashboard/projects/new">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              Naujas projektas
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12 shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardContent>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dar neturite projektų</h3>
              <p className="text-gray-500 mb-6">Sukurkite pirmą projektą ir pradėkite generuoti marketingo turinį</p>
              <Link href="/dashboard/projects/new">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Sukurti projektą
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all shadow-sm border-0 bg-white/80 backdrop-blur group">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-3">
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{project.name}</CardTitle>
                  {project.industry && (
                    <CardDescription className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {project.industry}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    Sukurta {formatDate(project.createdAt)}
                  </div>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button variant="outline" className="w-full group-hover:border-blue-300 group-hover:text-blue-600">
                      Atidaryti projektą
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
