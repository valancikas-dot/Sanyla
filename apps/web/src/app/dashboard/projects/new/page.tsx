'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FolderPlus, Loader2, Sparkles } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyzeWebsite = async () => {
    if (!website) {
      setError('Įveskite svetainės adresą');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/ai/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: website }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Nepavyko analizuoti svetainės');
      }

      // Auto-fill form with analyzed data
      if (data.analysis) {
        setName(data.analysis.businessName || name);
        setIndustry(data.analysis.industry || industry);
      }

      alert('✅ Svetainė išanalizuota! Informacija automatiškai užpildyta.');
    } catch (err: any) {
      setError(err.message || 'Klaida analizuojant svetainę');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, industry }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Klaida kuriant projektą');
      }

      // Navigate to the new project
      router.push(`/dashboard/projects/${data.project.id}`);
    } catch (err: any) {
      setError(err.message || 'Klaida kuriant projektą');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/dashboard/projects" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Grįžti į projektus
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              Naujas projektas
            </CardTitle>
            <CardDescription>
              Sukurkite naują marketingo projektą ir pradėkite generuoti turinį
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Website Auto-Fill */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-gray-900">AI Automatinis užpildymas</p>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Įveskite svetainės adresą - AI automatiškai išanalizuos ir užpildys projekto informaciją
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="www.jusu-svetaine.lt"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAnalyzeWebsite}
                    disabled={isAnalyzing || !website}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analizuoja...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analizuoti
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Manual Fields */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Projekto pavadinimas</label>
                <Input
                  id="name"
                  placeholder="Pvz.: Vasaros kampanija"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="industry" className="text-sm font-medium">Industrija (neprivaloma)</label>
                <Input
                  id="industry"
                  placeholder="Pvz.: E-komercija, Finansai, Sveikata..."
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kuriama...
                    </>
                  ) : (
                    'Sukurti projektą'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/projects')}
                >
                  Atšaukti
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
