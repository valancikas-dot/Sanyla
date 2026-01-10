'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, Users, Settings, PlusCircle, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();

  const quickActions = [
    { 
      title: 'Naujas projektas', 
      description: 'Sukurkite naują marketingo projektą',
      icon: PlusCircle,
      href: '/dashboard/projects/new',
      color: 'bg-blue-500'
    },
    { 
      title: 'Generuoti turinį', 
      description: 'AI pagalba sukurti reklamas',
      icon: Sparkles,
      href: '/dashboard/projects',
      color: 'bg-purple-500'
    },
    { 
      title: 'Komandos valdymas', 
      description: 'Pakvieskite komandos narius',
      icon: Users,
      href: '/dashboard/team',
      color: 'bg-green-500'
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sveiki, {session?.user?.name?.split(' ')[0] || 'Vartotojau'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Valdykite savo marketingo projektus ir generuokite turinį su AI pagalba.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Profile card */}
        <Card>
          <CardHeader>
            <CardTitle>Jūsų profilis</CardTitle>
            <CardDescription>Prisijungimo informacija</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profilio nuotrauka" 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || '?'}
                </div>
              )}
              <div>
                <p className="font-medium text-lg">{session?.user?.name || 'Nenurodyta'}</p>
                <p className="text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
