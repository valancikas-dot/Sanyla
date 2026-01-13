'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Loader2, 
  Settings, 
  Sparkles, 
  FileText, 
  Image as ImageIcon,
  Share2,
  Calendar,
  Building2,
  Globe,
  Target,
  Palette,
  Save,
  MessageCircle,
  Bot,
  Lightbulb
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
  createdAt: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setEditedProject(data.project);
      } else if (res.status === 404) {
        router.push('/dashboard/projects');
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
        body: JSON.stringify(editedProject),
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 md:p-8">
        <p>Projektas nerastas</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Apžvalga', icon: FileText },
    { id: 'content', label: 'Turinys', icon: Sparkles },
    { id: 'settings', label: 'Nustatymai', icon: Settings },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/dashboard/projects" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Grįžti į projektus
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              {project.industry && (
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                  <Building2 className="w-4 h-4" />
                  {project.industry}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push(`/dashboard/projects/${projectId}/insights`)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                AI Insights
              </Button>
              <Button 
                onClick={() => router.push(`/dashboard/projects/${projectId}/calendar`)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                30d Kalendorius
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push(`/dashboard/projects/${projectId}/chat`)}
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Asistentas
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Nustatymai
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-500"
                onClick={() => router.push(`/dashboard/projects/${projectId}/generate`)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generuoti turinį
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Greiti veiksmai</CardTitle>
                <CardDescription>Generuokite marketingo turinį</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/generate?type=text`)}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Generuoti reklamos tekstą
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/generate?type=image`)}
                >
                  <ImageIcon className="w-4 h-4 mr-3" />
                  Generuoti reklamos paveikslėlį
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/generate?type=social`)}
                >
                  <Share2 className="w-4 h-4 mr-3" />
                  Sukurti socialinių tinklų įrašą
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/generate?type=campaign`)}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Suplanuoti kampaniją
                </Button>
              </CardContent>
            </Card>

            {/* AI Tools */}
            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-blue-50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  AI Automatizacija
                </CardTitle>
                <CardDescription>Pilna marketingo automatizacija</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/80"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/calendar`)}
                >
                  <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                  30 dienų turinys
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/80"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/social-accounts`)}
                >
                  <Share2 className="w-4 h-4 mr-3 text-green-600" />
                  Socialiniai tinklai
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/80"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/insights`)}
                >
                  <Lightbulb className="w-4 h-4 mr-3 text-orange-600" />
                  AI įžvalgos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/80"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/chat`)}
                >
                  <MessageCircle className="w-4 h-4 mr-3 text-purple-600" />
                  AI Asistentas
                </Button>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projekto informacija</CardTitle>
                    <CardDescription>Pagrindiniai duomenys</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/projects/${projectId}/settings`)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Redaguoti
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Industrija:</span>
                  <span className="font-medium">{project.industry || 'Nenurodyta'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Svetainė:</span>
                  <span className="font-medium">{project.website || 'Nenurodyta'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Tikslinė auditorija:</span>
                  <span className="font-medium">{project.targetAudience || 'Nenurodyta'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Tonas:</span>
                  <span className="font-medium">{project.tone || 'professional'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Sukurta:</span>
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString('lt-LT')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Content */}
            <Card className="md:col-span-2 shadow-sm border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Sukurtas turinys</CardTitle>
                <CardDescription>Naujausias sugeneruotas turinys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Dar nesukūrėte turinio</p>
                  <p className="text-sm">Spauskite „Generuoti turinį" norėdami pradėti</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Turinio generavimas</CardTitle>
              <CardDescription>Pasirinkite kokį turinį norite generuoti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Reklamos tekstas</h3>
                    <p className="text-sm text-gray-500">Facebook, Google Ads</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-300">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Vaizdinė reklama</h3>
                    <p className="text-sm text-gray-500">AI generuoti paveikslėliai</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-300">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Socialiniai tinklai</h3>
                    <p className="text-sm text-gray-500">Instagram, LinkedIn</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Projekto nustatymai</CardTitle>
                  <CardDescription>Redaguokite projekto informaciją</CardDescription>
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Atšaukti
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Išsaugoti
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Redaguoti
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Projekto pavadinimas</label>
                  <Input
                    value={editedProject.name || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industrija</label>
                  <Input
                    value={editedProject.industry || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, industry: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Pvz.: E-komercija"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Svetainė</label>
                  <Input
                    value={editedProject.website || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, website: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Šalis</label>
                  <Input
                    value={editedProject.country || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, country: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Lietuva"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Tikslinė auditorija</label>
                  <Input
                    value={editedProject.targetAudience || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, targetAudience: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Aprašykite savo tikslinę auditoriją"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Pasiūlymas / Produktas</label>
                  <Input
                    value={editedProject.offer || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, offer: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Ką siūlote savo klientams?"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
