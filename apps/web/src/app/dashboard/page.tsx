'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Kraunama...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sveiki, {session.user?.name || session.user?.email}</h1>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: '/auth' })}>
            Atsijungti
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Jūsų profilis</CardTitle>
            <CardDescription>Prisijungimo informacija</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Vardas:</strong> {session.user?.name || 'Nenurodyta'}</p>
              <p><strong>El. paštas:</strong> {session.user?.email}</p>
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="Profilio nuotrauka" 
                  className="w-16 h-16 rounded-full mt-4"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
