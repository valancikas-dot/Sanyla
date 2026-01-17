'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, X, Calendar, Clock, Instagram, Facebook, Linkedin, Video, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { CreditsDisplay, useCreditsCheck } from '@/components/credits-display';

interface DayContent {
  day: number;
  theme: string;
  date: string;
  bestTime: string;
  instagram: {
    caption: string;
    reelsText: string;
    reelsCover?: string;
    filmingInstruction: string;
    hashtags: string;
  };
  facebook: {
    post: string;
    cta: string;
    visual?: string;
  };
  linkedin: {
    post: string;
    angle: string;
    visual?: string;
  };
  tiktok?: {
    caption: string;
    hashtags: string;
  };
}

interface CampaignPreview {
  batchId: string;
  totalDays: number;
  preview: DayContent[];
}

interface AutoCampaignGeneratorProps {
  projectId: string;
}

export function AutoCampaignGenerator({ projectId }: AutoCampaignGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<CampaignPreview | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PHASE 1C: Check user's credits before allowing generation
  const { canGenerate, credits, loading: creditsLoading, refresh: refreshCredits } = useCreditsCheck();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null); // Clear previous errors
    
    try {
      const response = await fetch('/api/ai/campaign-auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          prompt: prompt || 'Sukurk 7 dienų socialinių tinklų kampaniją',
          autoGenerateImages: true,
        }),
      });

      const data = await response.json();
      
      // PHASE 1C: Handle insufficient credits error
      if (response.status === 402 && data.code === 'INSUFFICIENT_CREDITS') {
        setErrorMessage(`❌ ${data.error}: Jums reikia ${data.required} kreditų, bet turite tik ${data.available}.`);
        refreshCredits(); // Refresh credits display
        return;
      }
      
      if (data.success) {
        setCampaign({
          batchId: data.batchId,
          totalDays: data.totalDays,
          preview: data.preview,
        });
        
        // Refresh credits after successful generation
        refreshCredits();
      } else {
        setErrorMessage('Klaida: ' + data.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setErrorMessage('Nepavyko sugeneruoti kampanijos');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!campaign) return;
    
    setIsApproving(true);
    try {
      const response = await fetch('/api/ai/campaign-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: campaign.batchId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.approvedPosts} postai suplanuoti sėkmingai!`);
        setCampaign(null);
        setPrompt('');
      } else {
        alert('Klaida: ' + data.error);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Nepavyko patvirtinti kampanijos');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!campaign) return;
    
    if (!confirm('Ar tikrai norite atmesti šią kampaniją?')) return;

    try {
      const response = await fetch(`/api/ai/campaign-approve?batchId=${campaign.batchId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCampaign(null);
        setPrompt('');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Nepavyko atmesti kampanijos');
    }
  };

  return (
    <div className="space-y-6">
      {/* PHASE 1C: Credits Display */}
      <CreditsDisplay />

      {/* PHASE 1C: Error Alert for Insufficient Credits */}
      {errorMessage && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">
                {errorMessage}
              </p>
              {credits !== null && credits < 30 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Jums reikia daugiau AI kreditų, kad galėtumėte generuoti kampaniją.
                </p>
              )}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>🤖 Automatinė 7 Dienų Kampanija</CardTitle>
          <CardDescription>
            AI sugeneruos visą kampaniją su REELS, Facebook, LinkedIn ir TikTok turiniu + DALL-E paveikslėliais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Papildomas promptas (nebūtinas)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="pvz: Sukurk kampaniją apie naujus produktus, orientuotą į jaunus profesionalus..."
              className="w-full min-h-[100px] p-3 border rounded-lg"
              disabled={isGenerating || !!campaign}
            />
          </div>

          {!campaign && (
            <div className="space-y-3">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !canGenerate || creditsLoading}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generuojama kampanija... (gali užtrukti 2-3 min)
                  </>
                ) : (
                  <>
                    ✨ Generuoti 7 Dienų Kampaniją
                  </>
                )}
              </Button>

              {/* PHASE 1C: Warning when credits are low */}
              {!canGenerate && !creditsLoading && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Neturite pakankamai kreditų kampanijos generavimui. 
                    Reikia 30 kreditų, turite {credits || 0}.
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {campaign && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              📅 Kampanijos Peržiūra ({campaign.totalDays} dienos)
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={handleReject}
                variant="outline"
                disabled={isApproving}
              >
                <X className="mr-2 h-4 w-4" />
                Atmesti
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tvirtinama...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Patvirtinti ir Planuoti
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {campaign.preview.map((day) => (
              <Card key={day.day} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-600 text-white rounded text-sm">
                        Diena {day.day}
                      </span>
                      {day.theme}
                    </CardTitle>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {day.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {day.bestTime}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Instagram */}
                  <div className="space-y-3 border-b pb-4">
                    <div className="flex items-center gap-2 font-semibold text-pink-600">
                      <Instagram className="h-5 w-5" />
                      Instagram/Reels
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Caption:</p>
                      <p className="text-sm">{day.instagram.caption}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Reels ekrano tekstas:</p>
                      <p className="text-sm font-bold text-purple-600">{day.instagram.reelsText}</p>
                    </div>
                    {day.instagram.reelsCover && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Reels Cover:</p>
                        <div className="relative w-full aspect-[9/16] max-w-[250px] rounded-lg overflow-hidden border">
                          <Image
                            src={day.instagram.reelsCover}
                            alt="Reels Cover"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Filmavimas:</p>
                      <p className="text-sm italic text-gray-600">{day.instagram.filmingInstruction}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Hashtags:</p>
                      <p className="text-xs text-blue-600">{day.instagram.hashtags}</p>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="space-y-3 border-b pb-4">
                    <div className="flex items-center gap-2 font-semibold text-blue-600">
                      <Facebook className="h-5 w-5" />
                      Facebook
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Postas:</p>
                      <p className="text-sm">{day.facebook.post}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">CTA:</p>
                      <p className="text-sm font-semibold text-blue-600">{day.facebook.cta}</p>
                    </div>
                    {day.facebook.visual && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Vizualas:</p>
                        <div className="relative w-full aspect-[1.91/1] max-w-[500px] rounded-lg overflow-hidden border">
                          <Image
                            src={day.facebook.visual}
                            alt="Facebook Visual"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-3 border-b pb-4">
                    <div className="flex items-center gap-2 font-semibold text-blue-700">
                      <Linkedin className="h-5 w-5" />
                      LinkedIn
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Postas:</p>
                      <p className="text-sm">{day.linkedin.post}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Kampas:</p>
                      <p className="text-sm italic text-gray-600">{day.linkedin.angle}</p>
                    </div>
                    {day.linkedin.visual && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Vizualas:</p>
                        <div className="relative w-full aspect-[1.91/1] max-w-[500px] rounded-lg overflow-hidden border">
                          <Image
                            src={day.linkedin.visual}
                            alt="LinkedIn Visual"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TikTok */}
                  {day.tiktok && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-semibold text-black">
                        <Video className="h-5 w-5" />
                        TikTok
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Caption:</p>
                        <p className="text-sm">{day.tiktok.caption}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Hashtags:</p>
                        <p className="text-xs text-blue-600">{day.tiktok.hashtags}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
