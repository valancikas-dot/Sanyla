'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Calendar, 
  Loader2,
  Check,
  X,
  Sparkles,
  Image as ImageIcon,
  Video,
  Send,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface ContentItem {
  id: string;
  scheduledDate: string;
  contentType: string;
  platform: string;
  status: string;
  caption: string;
  hashtags: string[];
  mediaUrls: string[];
  mediaType: string;
  postingTime: string;
  aiGenerated: boolean;
  approvalNotes: string;
}

export default function ContentCalendarPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    fetchContent();
  }, [projectId]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content-calendar?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendar = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/content-calendar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          platforms: ['instagram', 'facebook', 'linkedin'],
          postsPerWeek: 7,
        }),
      });

      if (res.ok) {
        await fetchContent();
      } else {
        alert('Failed to generate calendar');
      }
    } catch (error) {
      console.error('Error generating calendar:', error);
      alert('Error generating calendar');
    } finally {
      setIsGenerating(false);
    }
  };

  const approveContent = async (id: string) => {
    try {
      const res = await fetch(`/api/content-calendar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (res.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Error approving content:', error);
    }
  };

  const rejectContent = async (id: string) => {
    const notes = prompt('Rejection notes (optional):');
    try {
      const res = await fetch(`/api/content-calendar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          approvalNotes: notes 
        }),
      });

      if (res.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
    }
  };

  const generateMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/content-calendar/${id}/generate-media`, {
        method: 'POST',
      });

      if (res.ok) {
        await fetchContent();
        alert('Media generated successfully!');
      }
    } catch (error) {
      console.error('Error generating media:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'posted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📸';
      case 'facebook': return '👥';
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      default: return '📱';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingApproval = content.filter(c => c.status === 'pending_approval');
  const approved = content.filter(c => c.status === 'approved');
  const posted = content.filter(c => c.status === 'posted');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href={`/dashboard/projects/${projectId}`}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Atgal į projektą
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              📅 Turinio Kalendorius
            </h1>
            <p className="text-gray-600 mt-2">
              30 dienų automatizuotas content planas
            </p>
          </div>
          
          <Button 
            onClick={generateCalendar}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generuojama...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Generuoti 30d planą</>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{content.length}</div>
                <div className="text-sm text-gray-600">Viso turinio</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{pendingApproval.length}</div>
                <div className="text-sm text-gray-600">Laukia patvirtinimo</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{approved.length}</div>
                <div className="text-sm text-gray-600">Patvirtinta</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{posted.length}</div>
                <div className="text-sm text-gray-600">Paskelbta</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        {content.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Kalendorius tuščias</h3>
              <p className="text-gray-600 mb-6">
                Generuokite 30 dienų turinio planą vienu mygtuku
              </p>
              <Button onClick={generateCalendar} disabled={isGenerating}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generuoti planą
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        {new Date(item.scheduledDate).toLocaleDateString('lt-LT')} {item.postingTime}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">{getPlatformEmoji(item.platform)}</span>
                        <span className="text-sm font-medium capitalize">{item.platform}</span>
                        <span className="text-xs text-gray-500">• {item.contentType}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3 line-clamp-3">{item.caption}</p>
                  
                  {item.hashtags && item.hashtags.length > 0 && (
                    <div className="text-xs text-blue-600 mb-3">
                      {item.hashtags.slice(0, 5).join(' ')}
                    </div>
                  )}

                  {item.mediaUrls && item.mediaUrls.length > 0 && (
                    <div className="mb-3">
                      <img 
                        src={item.mediaUrls[0]} 
                        alt="Content preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {item.status === 'pending_approval' && (
                      <>
                        {!item.mediaUrls || item.mediaUrls.length === 0 ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateMedia(item.id)}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" />
                            Generuoti media
                          </Button>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => approveContent(item.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Patvirtinti
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => rejectContent(item.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Atmesti
                            </Button>
                          </>
                        )}
                      </>
                    )}

                    {item.status === 'approved' && (
                      <div className="text-xs text-green-600 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Bus automatiškai paskelbta
                      </div>
                    )}

                    {item.status === 'posted' && (
                      <div className="text-xs text-blue-600 flex items-center">
                        <Send className="h-3 w-3 mr-1" />
                        Paskelbta
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
