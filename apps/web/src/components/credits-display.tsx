'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditsData {
  credits: number;
  plan: string;
  costPerCampaign: number;
}

interface CreditsDisplayProps {
  /**
   * Optional: If true, shows inline mode suitable for navbar
   * If false (default), shows expanded card mode
   */
  inline?: boolean;
  
  /**
   * Optional: Callback when credits are updated (for parent component refresh)
   */
  onCreditsUpdate?: (credits: number) => void;
}

export function CreditsDisplay({ inline = false, onCreditsUpdate }: CreditsDisplayProps) {
  const [creditsData, setCreditsData] = useState<CreditsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/credits');
      
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      
      const data = await response.json();
      setCreditsData(data);
      
      if (onCreditsUpdate) {
        onCreditsUpdate(data.credits);
      }
    } catch (err: any) {
      console.error('Credits fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  if (loading) {
    return (
      <div className={inline ? 'flex items-center gap-2 text-sm text-muted-foreground' : 'p-4'}>
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Loading credits...</span>
      </div>
    );
  }

  if (error || !creditsData) {
    return (
      <div className={inline ? 'flex items-center gap-2 text-sm text-destructive' : 'p-4 text-destructive'}>
        <AlertCircle className="h-4 w-4" />
        <span>Unable to load credits</span>
      </div>
    );
  }

  const { credits, plan, costPerCampaign } = creditsData;
  const canGenerateCampaign = credits >= costPerCampaign;
  const isLowCredits = credits < costPerCampaign;

  // Inline mode (for navbar/header)
  if (inline) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${isLowCredits ? 'text-amber-500' : 'text-blue-500'}`} />
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${isLowCredits ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
              {credits} credits
            </span>
            <span className="text-xs text-muted-foreground capitalize">{plan} plan</span>
          </div>
        </div>
        
        {isLowCredits && (
          <Button 
            variant="outline" 
            size="sm"
            disabled
            className="text-xs"
          >
            Upgrade Plan
          </Button>
        )}
      </div>
    );
  }

  // Expanded card mode (for dashboard/campaign pages)
  return (
    <div className={`rounded-lg border p-4 ${isLowCredits ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'border-border bg-card'}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className={`h-5 w-5 ${isLowCredits ? 'text-amber-500' : 'text-blue-500'}`} />
            <div>
              <h3 className="text-lg font-semibold">
                {credits} AI Credits
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {plan} plan
              </p>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              💡 1 campaign = {costPerCampaign} credits
            </p>
            
            {canGenerateCampaign ? (
              <p className="text-green-600 dark:text-green-400 font-medium">
                ✓ You can generate {Math.floor(credits / costPerCampaign)} more campaign{Math.floor(credits / costPerCampaign) !== 1 ? 's' : ''}
              </p>
            ) : (
              <div className="space-y-2 pt-2">
                <p className="text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Not enough credits to generate a campaign
                </p>
                <p className="text-xs text-muted-foreground">
                  You need {costPerCampaign - credits} more credits to generate your next campaign.
                </p>
              </div>
            )}
          </div>
        </div>

        {isLowCredits && (
          <Button 
            variant="outline" 
            size="sm"
            disabled
            className="mt-1"
          >
            Upgrade Plan
          </Button>
        )}
      </div>

      {isLowCredits && (
        <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
          <p className="text-xs text-muted-foreground">
            💳 Upgrade to a paid plan to get more AI credits. 
            <span className="italic"> (Coming soon)</span>
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to check if user has sufficient credits
 * Can be used in campaign generation pages to disable buttons
 */
export function useCreditsCheck() {
  const [canGenerate, setCanGenerate] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const checkCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/credits');
      
      if (!response.ok) {
        // If can't fetch, allow generation (fail open)
        setCanGenerate(true);
        return;
      }
      
      const data = await response.json();
      setCredits(data.credits);
      setCanGenerate(data.credits >= data.costPerCampaign);
    } catch (err) {
      console.error('Credits check error:', err);
      // Fail open - allow generation if check fails
      setCanGenerate(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCredits();
  }, []);

  return { canGenerate, credits, loading, refresh: checkCredits };
}
