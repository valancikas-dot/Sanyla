'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { User, Building2, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nustatymai</h1>
          <p className="text-gray-600 mt-1">Valdykite savo paskyrą ir nustatymus</p>
        </div>

        <div className="space-y-6">
          {/* Profile settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profilis
              </CardTitle>
              <CardDescription>Jūsų asmeninė informacija</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || '?'}
                  </div>
                )}
                <div>
                  <p className="font-medium">{session?.user?.name}</p>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Vardas</label>
                  <Input 
                    id="name" 
                    defaultValue={session?.user?.name || ''} 
                    disabled
                    className="bg-gray-50"
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
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Profilio informacija valdoma per Google paskyrą
              </p>
            </CardContent>
          </Card>

          {/* Organization settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organizacija
              </CardTitle>
              <CardDescription>Jūsų organizacijos nustatymai</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Organizacijos nustatymai bus prieinami netrukus.</p>
            </CardContent>
          </Card>

          {/* Billing settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
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
