'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Loader2, 
  Save,
  Trash2
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  offer: string | null;
  targetAudience: string | null;
  language: string;
  tone: string;
}

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    country: '',
    city: '',
    website: '',
    offer: '',
    targetAudience: '',
    language: 'Lithuanian',
    tone: 'professional',
  });

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setFormData({
          name: data.name || '',
          industry: data.industry || '',
          country: data.country || '',
          city: data.city || '',
          website: data.website || '',
          offer: data.offer || '',
          targetAudience: data.targetAudience || '',
          language: data.language || 'Lithuanian',
          tone: data.tone || 'professional',
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Projektas atnaujintas!');
        router.push(`/dashboard/projects/${projectId}`);
      } else {
        alert('Klaida išsaugojant projektą');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Klaida išsaugojant projektą');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Ar tikrai norite ištrinti šį projektą? Šis veiksmas negrįžtamas.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Projektas ištrintas');
        router.push('/dashboard/projects');
      } else {
        alert('Klaida trinant projektą');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Klaida trinant projektą');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Atgal į projektą
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ⚙️ Projekto nustatymai
          </h1>
          <p className="text-gray-600 mt-2">
            Redaguokite projekto informaciją
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Projekto informacija</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Projekto pavadinimas *</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Pvz: Mano verslo marketing"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium">Industrija</label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Pvz: Technology, Fashion, Food"
              />
            </div>

            {/* Country & City */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">Šalis</label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Lithuania"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">Miestas</label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Vilnius"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">Svetainė</label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Offer */}
            <div className="space-y-2">
              <label htmlFor="offer" className="text-sm font-medium">Pasiūlymas / Produktas</label>
              <Textarea
                id="offer"
                value={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                placeholder="Aprašykite ką siūlote, kokias problemas sprendžiate..."
                rows={3}
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label htmlFor="targetAudience" className="text-sm font-medium">Tikslinė auditorija</label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="Aprašykite savo tikslinę auditoriją: amžius, interesai, poreikiai..."
                rows={3}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium">Kalba</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Lithuanian">Lietuvių</option>
                <option value="English">English</option>
                <option value="German">Deutsch</option>
                <option value="French">Français</option>
                <option value="Spanish">Español</option>
                <option value="Polish">Polski</option>
                <option value="Russian">Русский</option>
              </select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <label htmlFor="tone" className="text-sm font-medium">Tonas</label>
              <select
                id="tone"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="inspiring">Inspiring</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Ištrinti projektą
              </Button>

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Išsaugoti
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
