'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  FileText, 
  Image as ImageIcon,
  Share2,
  Calendar,
  Copy,
  Check,
  RefreshCw,
  Download
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  industry: string | null;
  offer: string | null;
  targetAudience: string | null;
  tone: string;
}

type ContentType = 'text' | 'image' | 'social' | 'campaign';

const contentTypes = [
  { id: 'text', label: 'Reklamos tekstas', icon: FileText, description: 'Facebook, Google Ads tekstai' },
  { id: 'image', label: 'Paveikslėlis', icon: ImageIcon, description: 'AI sugeneruotas vizualas' },
  { id: 'social', label: 'Socialiniai tinklai', icon: Share2, description: 'Instagram, Facebook įrašai' },
  { id: 'campaign', label: 'Kampanija', icon: Calendar, description: 'Pilna marketingo kampanija' },
];

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const initialType = (searchParams.get('type') as ContentType) || 'text';
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ContentType>(initialType);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!project) return;
    
    setIsGenerating(true);
    setGeneratedContent('');
    
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: selectedType,
          prompt: prompt || getDefaultPrompt(),
          projectContext: {
            name: project.name,
            industry: project.industry,
            offer: project.offer,
            targetAudience: project.targetAudience,
            tone: project.tone,
          },
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedContent(data.content);
      } else {
        // Demo content if API not available
        setGeneratedContent(getDemoContent());
      }
    } catch (error) {
      console.error('Error generating:', error);
      // Show demo content on error
      setGeneratedContent(getDemoContent());
    } finally {
      setIsGenerating(false);
    }
  };

  const getDefaultPrompt = () => {
    switch (selectedType) {
      case 'text':
        return `Sukurk reklamos tekstą ${project?.industry || 'verslui'}`;
      case 'social':
        return `Sukurk Instagram įrašą ${project?.industry || 'verslui'}`;
      case 'campaign':
        return `Sukurk marketingo kampanijos planą ${project?.industry || 'verslui'}`;
      default:
        return '';
    }
  };

  const getDemoContent = () => {
    const projectName = project?.name || 'Jūsų verslas';
    const industry = project?.industry || 'paslaugos';
    
    switch (selectedType) {
      case 'text':
        return `🎯 ${projectName} - Jūsų patikimas ${industry} partneris!

✨ Ieškote profesionalių ${industry} paslaugų? 
Mes siūlome:
• Aukščiausios kokybės paslaugas
• Konkurencingas kainas
• Greitus terminus
• Individualų požiūrį

💡 Kodėl rinktis mus?
✅ 10+ metų patirtis rinkoje
✅ 500+ patenkintų klientų
✅ Garantuojamas rezultatas

📞 Susisiekite dabar ir gaukite NEMOKAMĄ konsultaciją!

#${industry.replace(/\s/g, '')} #verslas #kokybė`;
      
      case 'social':
        return `📱 NAUJAS ĮRAŠAS

Hey! 👋

Šiandien norime pasidalinti kažkuo ypatingu... 

${projectName} komanda sunkiai dirba, kad galėtume jums pasiūlyti geriausias ${industry} paslaugas! 

💪 Mūsų misija - padėti jums pasiekti tikslus.

Ar žinojote, kad:
🔥 85% mūsų klientų rekomenduoja mus draugams
🔥 Vidutinis kliento pasitenkinimo įvertinimas - 4.9/5

Parašykite komentaruose "INFO" ir mes susisieksime! 

#${industry.replace(/\s/g, '')} #motivation #business #success`;

      case 'campaign':
        return `📊 MARKETINGO KAMPANIJOS PLANAS

📅 Trukmė: 4 savaitės

═══════════════════════════════════

1️⃣ SAVAITĖ - SUSIDOMĖJIMO KĖLIMAS
• Facebook/Instagram reklamos
• Blog straipsnis apie ${industry}
• Email naujienlaiškis

2️⃣ SAVAITĖ - ĮSITRAUKIMAS  
• Interaktyvus quiz
• Klientų atsiliepimai
• Live sesija Instagram

3️⃣ SAVAITĖ - KONVERSIJA
• Specialus pasiūlymas
• Retargeting reklamos
• SMS kampanija

4️⃣ SAVAITĖ - LOJALUMAS
• Padėkos laiškai
• Nuolaidų kodai
• Rekomendacijų programa

═══════════════════════════════════

💰 BIUDŽETAS: 500-1000€
📈 TIKSLAI: +30% užklausų
🎯 AUDITORIJA: ${project?.targetAudience || '25-45m, Lietuva'}`;

      case 'image':
        return `🖼️ Paveikslėlio generavimas

Pagal jūsų projekto duomenis, rekomenduojame:

📐 Formatai:
• Facebook: 1200x628px
• Instagram: 1080x1080px  
• Stories: 1080x1920px

🎨 Spalvų paletė:
• Pagrindinė: #3B82F6 (mėlyna)
• Akcentas: #8B5CF6 (violetinė)
• Fonas: #F8FAFC (šviesi)

📝 Tekstas paveikslėlyje:
"${projectName}"
"${project?.offer || 'Profesionalios paslaugos'}"

💡 Patarimas: Naudokite Canva arba Adobe Express sukurti vizualus pagal šiuos parametrus.`;

      default:
        return 'Turinys generuojamas...';
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href={`/dashboard/projects/${projectId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Grįžti į projektą
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Generuoti turinį</h1>
          <p className="text-gray-600 mt-1">
            Projektas: <span className="font-medium">{project?.name}</span>
          </p>
        </div>

        {/* Content Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as ContentType)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <type.icon className={`w-6 h-6 mb-2 ${
                selectedType === type.id ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <p className="font-medium text-sm">{type.label}</p>
              <p className="text-xs text-gray-500 mt-1">{type.description}</p>
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Aprašykite ko norite
            </CardTitle>
            <CardDescription>
              Kuo tiksliau aprašysite, tuo geresnį rezultatą gausite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder={`Pvz.: ${getDefaultPrompt()}`}
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
              className="min-h-[100px] mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generuojama...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generuoti {contentTypes.find(t => t.id === selectedType)?.label}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        {generatedContent && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sugeneruotas turinys</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Generuoti iš naujo
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1 text-green-500" />
                        Nukopijuota!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Kopijuoti
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm">
                {generatedContent}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
