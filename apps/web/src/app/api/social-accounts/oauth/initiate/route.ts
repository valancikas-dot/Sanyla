import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
const BASE_URL = process.env.NEXTAUTH_URL || 'https://sanyla.site';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { platform, projectId } = await request.json();

    const redirectUri = `${BASE_URL}/api/social-accounts/oauth/callback`;
    const state = Buffer.from(JSON.stringify({ platform, projectId, email: session.user.email })).toString('base64');

    let authUrl = '';

    switch (platform) {
      case 'facebook':
      case 'instagram':
        // Facebook & Instagram use same OAuth (Instagram requires Facebook Business)
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
          `client_id=${FACEBOOK_APP_ID}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&state=${state}` +
          `&scope=pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish`;
        break;

      case 'linkedin':
        authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code` +
          `&client_id=${LINKEDIN_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&state=${state}` +
          `&scope=w_member_social`;
        break;

      default:
        return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('OAuth initiate error:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}
