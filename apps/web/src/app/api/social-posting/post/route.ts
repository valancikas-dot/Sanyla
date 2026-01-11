import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPool } from '@/lib/db';

// POST /api/social-posting/post - Post content to social media
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentId } = await req.json();

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 });
    }

    const pool = getPool();

    // Get content details
    const contentResult = await pool.query(`
      SELECT cc.*, p.id as project_id
      FROM content_calendar cc
      JOIN projects p ON cc."projectId" = p.id
      WHERE cc.id = $1 AND cc.status = 'approved'
    `, [contentId]);

    if (contentResult.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Content not found or not approved' 
      }, { status: 404 });
    }

    const content = contentResult.rows[0];

    // Get social account for this platform
    const accountResult = await pool.query(`
      SELECT * FROM social_accounts 
      WHERE "projectId" = $1 
        AND platform = $2 
        AND "isActive" = true
      LIMIT 1
    `, [content.project_id, content.platform]);

    if (accountResult.rows.length === 0) {
      return NextResponse.json({ 
        error: `No active ${content.platform} account connected` 
      }, { status: 400 });
    }

    const socialAccount = accountResult.rows[0];

    // Post to social media based on platform
    let postId: string | null = null;
    let errorMsg: string | null = null;

    try {
      switch (content.platform) {
        case 'facebook':
          postId = await postToFacebook(socialAccount, content);
          break;
        case 'instagram':
          postId = await postToInstagram(socialAccount, content);
          break;
        case 'linkedin':
          postId = await postToLinkedIn(socialAccount, content);
          break;
        case 'tiktok':
          postId = await postToTikTok(socialAccount, content);
          break;
        default:
          errorMsg = 'Unsupported platform';
      }
    } catch (error: any) {
      errorMsg = error.message;
      console.error(`Failed to post to ${content.platform}:`, error);
    }

    if (errorMsg) {
      // Update status to failed
      await pool.query(`
        UPDATE content_calendar 
        SET status = 'failed', "updatedAt" = NOW()
        WHERE id = $1
      `, [contentId]);

      return NextResponse.json({ 
        error: errorMsg 
      }, { status: 500 });
    }

    // Update content as posted
    await pool.query(`
      UPDATE content_calendar 
      SET status = 'posted', "postedAt" = NOW(), "updatedAt" = NOW()
      WHERE id = $1
    `, [contentId]);

    // Create analytics record
    if (postId) {
      const analyticsId = 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
      await pool.query(`
        INSERT INTO content_analytics (
          id, "contentId", platform, "postId", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [analyticsId, contentId, content.platform, postId]);
    }

    return NextResponse.json({ 
      success: true,
      postId,
      platform: content.platform,
      message: `Successfully posted to ${content.platform}`
    });

  } catch (error: any) {
    console.error('Social posting error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to post to social media'
    }, { status: 500 });
  }
}

// Facebook posting
async function postToFacebook(account: any, content: any): Promise<string> {
  const pageId = account.pageId || account.accountId;
  const accessToken = account.accessToken;

  let url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
  
  const body: any = {
    message: content.caption,
    access_token: accessToken,
  };

  // If has media
  if (content.mediaUrls && content.mediaUrls.length > 0) {
    url = `https://graph.facebook.com/v18.0/${pageId}/photos`;
    body.url = content.mediaUrls[0];
    body.caption = content.caption;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Facebook API error');
  }

  return data.id || data.post_id;
}

// Instagram posting
async function postToInstagram(account: any, content: any): Promise<string> {
  const igUserId = account.businessAccountId || account.accountId;
  const accessToken = account.accessToken;

  // Instagram requires 2-step process: create container, then publish

  // Step 1: Create container
  const containerUrl = `https://graph.facebook.com/v18.0/${igUserId}/media`;
  
  const containerBody: any = {
    access_token: accessToken,
  };

  if (content.mediaUrls && content.mediaUrls.length > 0) {
    if (content.mediaType === 'video') {
      containerBody.media_type = 'REELS';
      containerBody.video_url = content.mediaUrls[0];
    } else {
      containerBody.image_url = content.mediaUrls[0];
    }
  }

  containerBody.caption = content.caption;

  const containerResponse = await fetch(containerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(containerBody),
  });

  const containerData = await containerResponse.json();

  if (containerData.error) {
    throw new Error(containerData.error.message || 'Instagram container creation failed');
  }

  const creationId = containerData.id;

  // Step 2: Publish container
  const publishUrl = `https://graph.facebook.com/v18.0/${igUserId}/media_publish`;
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken,
    }),
  });

  const publishData = await publishResponse.json();

  if (publishData.error) {
    throw new Error(publishData.error.message || 'Instagram publish failed');
  }

  return publishData.id;
}

// LinkedIn posting
async function postToLinkedIn(account: any, content: any): Promise<string> {
  const personUrn = `urn:li:person:${account.accountId}`;
  const accessToken = account.accessToken;

  const body: any = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content.caption,
        },
        shareMediaCategory: content.mediaUrls && content.mediaUrls.length > 0 ? 'IMAGE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  if (content.mediaUrls && content.mediaUrls.length > 0) {
    body.specificContent['com.linkedin.ugc.ShareContent'].media = [{
      status: 'READY',
      originalUrl: content.mediaUrls[0],
    }];
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'LinkedIn API error');
  }

  return data.id;
}

// TikTok posting (placeholder - requires video upload)
async function postToTikTok(account: any, content: any): Promise<string> {
  // TikTok API is more complex and requires video upload
  // This is a placeholder
  throw new Error('TikTok posting coming soon - requires video upload flow');
}
