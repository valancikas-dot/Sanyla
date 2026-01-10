import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MetaService {
  private readonly graphApiUrl = 'https://graph.facebook.com/v18.0';

  async publishPost(account: any, contentItem: any): Promise<string> {
    const content = contentItem.content as any;
    
    // Publish to Facebook Page
    if (account.platform === 'FACEBOOK') {
      const response = await axios.post(
        `${this.graphApiUrl}/${account.accountId}/feed`,
        {
          message: content.text || content.caption,
          link: content.link,
          access_token: account.accessToken,
        },
      );
      return response.data.id;
    }

    // Publish to Instagram
    if (account.platform === 'INSTAGRAM') {
      // Step 1: Create media container
      const containerResponse = await axios.post(
        `${this.graphApiUrl}/${account.accountId}/media`,
        {
          image_url: content.imageUrl,
          caption: content.caption || content.text,
          access_token: account.accessToken,
        },
      );

      // Step 2: Publish container
      const publishResponse = await axios.post(
        `${this.graphApiUrl}/${account.accountId}/media_publish`,
        {
          creation_id: containerResponse.data.id,
          access_token: account.accessToken,
        },
      );

      return publishResponse.data.id;
    }

    throw new Error('Unsupported platform');
  }

  async fetchAnalytics(account: any): Promise<any> {
    // Facebook Page Insights
    if (account.platform === 'FACEBOOK') {
      const response = await axios.get(
        `${this.graphApiUrl}/${account.accountId}/insights`,
        {
          params: {
            metric: 'page_impressions,page_engaged_users,page_fans',
            period: 'day',
            access_token: account.accessToken,
          },
        },
      );
      return response.data;
    }

    // Instagram Insights
    if (account.platform === 'INSTAGRAM') {
      const response = await axios.get(
        `${this.graphApiUrl}/${account.accountId}/insights`,
        {
          params: {
            metric: 'impressions,reach,profile_views',
            period: 'day',
            access_token: account.accessToken,
          },
        },
      );
      return response.data;
    }

    return null;
  }

  async refreshToken(account: any): Promise<string> {
    // Exchange short-lived token for long-lived token
    const response = await axios.get(`${this.graphApiUrl}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: account.accessToken,
      },
    });

    return response.data.access_token;
  }
}
