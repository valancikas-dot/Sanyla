import { Injectable, Logger } from '@nestjs/common';

export interface InstagramInsights {
  impressions: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

@Injectable()
export class MetaInsightsService {
  private readonly logger = new Logger(MetaInsightsService.name);
  private readonly GRAPH_API_VERSION = 'v18.0';
  private readonly GRAPH_API_BASE = 'https://graph.facebook.com';

  /**
   * Fetch Instagram post insights from Meta Graph API
   * 
   * @param accessToken - Instagram account access token
   * @param mediaId - Instagram media ID (from platformPostId)
   * @returns Instagram performance metrics
   * @throws Error if API call fails
   */
  async fetchPostInsights(
    accessToken: string,
    mediaId: string
  ): Promise<InstagramInsights> {
    this.logger.log(`Fetching insights for Instagram media: ${mediaId}`);

    try {
      // Meta Graph API: Get media insights
      // Ref: https://developers.facebook.com/docs/instagram-api/reference/ig-media/insights
      const url = `${this.GRAPH_API_BASE}/${this.GRAPH_API_VERSION}/${mediaId}/insights`;
      
      const params = new URLSearchParams({
        metric: 'impressions,reach,likes,comments,saved,shares',
        access_token: accessToken,
      });

      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Meta Graph API error: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();

      // Parse insights data
      // API returns: { data: [{ name: 'impressions', values: [{ value: 123 }] }, ...] }
      const insights = this.parseInsightsResponse(data);

      this.logger.log(
        `✅ Insights collected for ${mediaId}: ${insights.impressions} impressions, ${insights.likes} likes`
      );

      return insights;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch insights for ${mediaId}:`, errorMessage);
      throw new Error(`Instagram Insights fetch failed: ${errorMessage}`);
    }
  }

  /**
   * Parse Meta Graph API insights response
   * 
   * Response format:
   * {
   *   data: [
   *     { name: 'impressions', values: [{ value: 1234 }] },
   *     { name: 'likes', values: [{ value: 56 }] },
   *     ...
   *   ]
   * }
   */
  private parseInsightsResponse(response: any): InstagramInsights {
    const data = response.data || [];

    const findMetric = (name: string): number => {
      const metric = data.find((m: any) => m.name === name);
      return metric?.values?.[0]?.value || 0;
    };

    return {
      impressions: findMetric('impressions') || findMetric('reach'), // Fallback to reach if impressions unavailable
      likes: findMetric('likes'),
      comments: findMetric('comments'),
      saves: findMetric('saved'),
      shares: findMetric('shares'),
    };
  }

  /**
   * Calculate engagement rate
   * Formula: (likes + comments*2 + saves*3) / impressions
   * 
   * Why weighted?
   * - Likes: 1x (lowest engagement)
   * - Comments: 2x (medium engagement, requires more effort)
   * - Saves: 3x (highest engagement, strongest intent signal)
   */
  calculateEngagementRate(insights: InstagramInsights): number {
    const { impressions, likes, comments, saves } = insights;

    if (!impressions || impressions === 0) {
      return 0;
    }

    const weightedEngagement = likes + (comments * 2) + (saves * 3);
    return weightedEngagement / impressions;
  }
}
