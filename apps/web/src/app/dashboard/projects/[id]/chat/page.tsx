'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Loader2, 
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Share2,
  Calendar
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'social' | 'campaign';
  timestamp: Date;
}

interface Project {
  id: string;
  name: string;
  industry: string | null;
  offer: string | null;
  targetAudience: string | null;
  tone: string;
  website: string | null;
}

export default function ChatbotPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        // Add welcome message
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `👋 Sveiki! Esu jūsų AI marketingo asistentas projektui "${data.project.name}".

Galiu jums padėti su:
• 📝 Reklamos tekstais (Facebook, Google, LinkedIn)
• 🖼️ Paveikslėlių generavimu (DALL-E 3)
• 📱 Socialinių tinklų turiniu
• 📊 Marketingo kampanijų planavimu

Tiesiog parašykite ko jums reikia, pavyzdžiui:
- "Sukurk Facebook reklamą"
- "Sugeneruok paveikslėlį reklamai"
- "Paruošk 30 dienų kampanijos planą"
- "Sukurk Instagram įrašą apie nuolaidą"`,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const detectContentType = (text: string): 'text' | 'image' | 'social' | 'campaign' => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('paveiksl') || lowerText.includes('nuotrauk') || 
        lowerText.includes('vizual') || lowerText.includes('image') ||
        lowerText.includes('banner') || lowerText.includes('logo')) {
      return 'image';
    }
    
    if (lowerText.includes('kampanij') || lowerText.includes('plan') || 
        lowerText.includes('strategij') || lowerText.includes('30 dien')) {
      return 'campaign';
    }
    
    if (lowerText.includes('instagram') || lowerText.includes('facebook post') ||
        lowerText.includes('socialin') || lowerText.includes('tiktok') ||
        lowerText.includes('reel') || lowerText.includes('linkedin')) {
      return 'social';
    }
    
    return 'text';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add thinking message
    const thinkingId = 'thinking-' + Date.now();
    setMessages(prev => [...prev, {
      id: thinkingId,
      role: 'assistant',
      content: '🤔 Generuoju...',
      timestamp: new Date(),
    }]);

    try {
      const contentType = detectContentType(input);
      
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: contentType,
          prompt: input,
          projectContext: {
            name: project?.name,
            industry: project?.industry,
            offer: project?.offer,
            targetAudience: project?.targetAudience,
            tone: project?.tone,
            website: project?.website,
          },
        }),
      });

      const data = await res.json();

      // Remove thinking message and add real response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.content || data.error || 'Klaida generuojant',
          type: contentType,
          timestamp: new Date(),
        }];
      });

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '❌ Įvyko klaida. Bandykite dar kartą.',
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickActions = [
    { label: 'Reklamos tekstas', icon: FileText, prompt: 'Sukurk reklamos tekstą' },
    { label: 'Paveikslėlis', icon: ImageIcon, prompt: 'Sugeneruok reklamos paveikslėlį' },
    { label: 'Social media', icon: Share2, prompt: 'Sukurk Instagram ir Facebook įrašus' },
    { label: 'Kampanija', icon: Calendar, prompt: 'Sukurk 30 dienų marketingo kampanijos planą' },
  ];

  if (isLoadingProject) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-4 md:p-6">
      {/* Header */}
      <div className="mb-4">
        <Link 
          href={`/dashboard/projects/${projectId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Grįžti į projektą
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Asistentas</h1>
            <p className="text-sm text-gray-500">{project?.name}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  {message.role === 'assistant' && message.id !== 'welcome' && !message.content.includes('Generuoju') && (
                    <div className="mt-2 pt-2 border-t flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="text-xs"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 mr-1 text-green-500" />
                            Nukopijuota
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Kopijuoti
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(action.prompt);
              }}
              className="justify-start text-xs"
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Parašykite ko jums reikia..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-500"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
