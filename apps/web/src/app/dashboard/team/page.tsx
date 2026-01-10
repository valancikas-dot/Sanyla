'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Mail, UserPlus, Crown, User } from 'lucide-react';

export default function TeamPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // TODO: Fetch team members from API
  const [members] = useState<any[]>([]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Pakvietimas išsiųstas!' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Klaida siunčiant pakvietimą' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Klaida siunčiant pakvietimą' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Komanda</h1>
          <p className="text-gray-600 mt-1">Valdykite savo komandos narius</p>
        </div>

        {/* Invite member */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Pakviesti narį
            </CardTitle>
            <CardDescription>Išsiųskite pakvietimą el. paštu</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="el.pastas@pavyzdys.lt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Siunčiama...' : 'Pakviesti'}
              </Button>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Team members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Komandos nariai
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Current user */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || '?'}
                  </div>
                )}
                <div>
                  <p className="font-medium">{session?.user?.name || 'Jūs'}</p>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-amber-600">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Savininkas</span>
              </div>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Dar nėra kitų komandos narių</p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name || member.email}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{member.role}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
