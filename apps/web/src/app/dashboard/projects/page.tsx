'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FolderKanban, MoreHorizontal } from 'lucide-react';

export default function ProjectsPage() {
  // TODO: Fetch projects from API
  const [projects] = useState<any[]>([]);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projektai</h1>
            <p className="text-gray-600 mt-1">Valdykite savo marketingo projektus</p>
          </div>
          <Link href="/dashboard/projects/new">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Naujas projektas
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Dar neturite projektų</h3>
              <p className="text-gray-500 mb-4">Sukurkite pirmą projektą ir pradėkite generuoti marketingo turinį</p>
              <Link href="/dashboard/projects/new">
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Sukurti projektą
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Link href={`/project/${project.id}`}>
                    <Button variant="outline" className="w-full">
                      Atidaryti
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
