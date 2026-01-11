'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Loader2,
  Lightbulb,
  TrendingUp,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface Insight {
  id: string;
  insightType: string;
  title: string;
  description: string;
  priority: string;
  actionItems: string[];
  isRead: boolean;
  isImplemented: boolean;
  createdAt: string;
}

export default function InsightsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, [projectId]);

  const fetchInsights = async () => {
    try {
      const res = await fetch(`/api/ai-insights?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai-insights/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (res.ok) {
        await fetchInsights();
      } else {
        alert('Failed to generate insights');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('Error generating insights');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content_recommendation': return <Lightbulb className="h-5 w-5" />;
      case 'posting_time': return <TrendingUp className="h-5 w-5" />;
      case 'audience_behavior': return <Users className="h-5 w-5" />;
      case 'performance': return <Target className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const critical = insights.filter(i => i.priority === 'critical');
  const high = insights.filter(i => i.priority === 'high');
  const unread = insights.filter(i => !i.isRead);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href={`/dashboard/projects/${projectId}`}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Atgal į projektą
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              💡 AI Insights
            </h1>
            <p className="text-gray-600 mt-2">
              Automatinė analizė ir rekomendacijos
            </p>
          </div>
          
          <Button 
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {isAnalyzing ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analizuojama...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Analizuoti dabar</>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{insights.length}</div>
                <div className="text-sm text-gray-600">Viso įžvalgų</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{critical.length}</div>
                <div className="text-sm text-gray-600">Kritinių</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{high.length}</div>
                <div className="text-sm text-gray-600">Svarbių</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{unread.length}</div>
                <div className="text-sm text-gray-600">Neperskaitytų</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Grid */}
        {insights.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Lightbulb className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nėra įžvalgų</h3>
              <p className="text-gray-600 mb-6">
                Paleiskite AI analizę, kad gautumėte rekomendacijas
              </p>
              <Button onClick={generateInsights} disabled={isAnalyzing}>
                <Sparkles className="h-4 w-4 mr-2" />
                Analizuoti
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className={`border-l-4 ${getPriorityColor(insight.priority)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getTypeIcon(insight.insightType)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}>
                            {insight.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(insight.createdAt).toLocaleDateString('lt-LT')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!insight.isRead && (
                      <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  
                  {insight.actionItems && insight.actionItems.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Veiksmai:
                      </h4>
                      <ul className="space-y-1">
                        {insight.actionItems.map((action, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
