import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LinkedInService {
  private readonly apiUrl = 'https://api.linkedin.com/v2';

  async publishPost(account: any, contentItem: any): Promise<string> {
    const content = contentItem.content as any;

    const response = await axios.post(
      `${this.apiUrl}/ugcPosts`,
      {
        author: `urn:li:person:${account.accountId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content.text || content.caption,
            },
            shareMediaCategory: content.imageUrl ? 'IMAGE' : 'NONE',
            media: content.imageUrl
              ? [
                  {
                    status: 'READY',
                    description: {
                      text: content.caption || '',
                    },
                    media: content.imageUrl,
                    title: {
                      text: content.title || '',
                    },
                  },
                ]
              : undefined,
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    );

    return response.data.id;
  }

  async fetchAnalytics(account: any): Promise<any> {
    // LinkedIn Analytics API
    const response = await axios.get(
      `${this.apiUrl}/organizationalEntityShareStatistics`,
      {
        params: {
          q: 'organizationalEntity',
          organizationalEntity: `urn:li:organization:${account.accountId}`,
        },
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        },
      },
    );

    return response.data;
  }

  async refreshToken(account: any): Promise<string> {
    // LinkedIn doesn't support refresh tokens - need to re-authenticate
    // This is a limitation of LinkedIn's API
    throw new Error('LinkedIn requires manual re-authentication');
  }
}
