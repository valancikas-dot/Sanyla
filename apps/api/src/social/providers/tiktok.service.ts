import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TikTokService {
  private readonly apiUrl = 'https://open.tiktokapis.com/v2';

  async publishPost(account: any, contentItem: any): Promise<string> {
    const content = contentItem.content as any;

    // TikTok requires video upload first
    // Step 1: Initialize video upload
    const initResponse = await axios.post(
      `${this.apiUrl}/post/publish/video/init/`,
      {
        post_info: {
          title: content.title || '',
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: content.videoUrl,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return initResponse.data.data.publish_id;
  }

  async fetchAnalytics(account: any): Promise<any> {
    // TikTok Analytics API
    const response = await axios.post(
      `${this.apiUrl}/research/video/query/`,
      {
        query: {
          and: [
            {
              field_name: 'region_code',
              operation: 'IN',
              field_values: ['US', 'GB', 'LT'], // Customize regions
            },
          ],
        },
        max_count: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  }
}
