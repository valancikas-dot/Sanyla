'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getMe();
        setUser(res.data);
        
        // If user has orgs, redirect to first org's projects
        if (res.data.organizations && res.data.organizations.length > 0) {
          router.push(`/org/${res.data.organizations[0].id}/projects`);
        }
      } catch (error) {
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Kraunama...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sveiki, {user?.name || user?.email}</h1>
        
        <div className="grid gap-4">
          {user?.organizations?.map((org: any) => (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>Rolė: {org.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push(`/org/${org.id}/projects`)}>
                  Peržiūrėti projektus
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {(!user?.organizations || user.organizations.length === 0) && (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Nerasta organizacijų. Susisiekite su palaikymo komanda.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
