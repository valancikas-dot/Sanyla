'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Building2, CreditCard, Save, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        // Update session
        await update({ name });
        setMessage({ type: 'success', text: 'Profilis atnaujintas!' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Klaida atnaujinant profilį' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Klaida atnaujinant profilį' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nustatymai</h1>
          <p className="text-gray-600 mt-1">Valdykite savo paskyrą ir nustatymus</p>
        </div>

        <div className="space-y-6">
          {/* Profile settings */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <User className="w-4 h-4" />
                </div>
                Profilis
              </CardTitle>
              <CardDescription>Jūsų asmeninė informacija</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-20 h-20 rounded-full ring-4 ring-blue-100" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-3xl font-semibold">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || '?'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{session?.user?.name}</p>
                  <p className="text-gray-500">{session?.user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 pt-4 border-t">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Vardas</label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jūsų vardas"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">El. paštas</label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={session?.user?.email || ''} 
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">El. paštą galite pakeisti tik per Google paskyrą</p>
                </div>
              </div>

              {message && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.text}
                </p>
              )}

              <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Išsaugoti pakeitimus
              </Button>
            </CardContent>
          </Card>

          {/* Organization settings */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                Organizacija
              </CardTitle>
              <CardDescription>Jūsų organizacijos nustatymai</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Organizacijos nustatymai bus prieinami netrukus.</p>
            </CardContent>
          </Card>

          {/* Billing settings */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                Prenumerata
              </CardTitle>
              <CardDescription>Valdykite savo prenumeratą ir mokėjimus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nemokamas planas</p>
                  <p className="text-sm text-gray-500">Ribotos funkcijos</p>
                </div>
                <Button variant="outline">
                  Atnaujinti planą
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
