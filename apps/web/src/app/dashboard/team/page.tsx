'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Mail, UserPlus, Crown, User, Clock, Loader2 } from 'lucide-react';

interface Member {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  joinedAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  expiresAt: string;
}

export default function TeamPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

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
        fetchTeam(); // Refresh to show new invitation
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Komandos nariai
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTeam ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {/* Show members from API */}
                {members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Dar nėra komandos narių</p>
                  </div>
                ) : (
                  members.map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        {member.image ? (
                          <img src={member.image} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-medium">
                            {member.name?.[0] || member.email?.[0] || '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{member.name || member.email}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <div className="flex items-center gap-1 text-amber-600">
                            <Crown className="w-4 h-4" />
                            <span className="text-sm font-medium">Savininkas</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 capitalize">{member.role}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Laukiantys pakvietimai
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-gray-500">
                        Išsiųsta: {new Date(invitation.sentAt).toLocaleDateString('lt-LT')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">Laukiama</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
