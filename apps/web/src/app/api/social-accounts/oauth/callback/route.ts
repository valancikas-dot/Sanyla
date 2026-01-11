import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
const BASE_URL = process.env.NEXTAUTH_URL || 'https://sanyla.site';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${BASE_URL}/dashboard?error=oauth_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${BASE_URL}/dashboard?error=oauth_failed`);
  }

  try {
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { platform, projectId, email } = stateData;

    const redirectUri = `${BASE_URL}/api/social-accounts/oauth/callback`;
    let accessToken = '';
    let refreshToken = '';
    let accountId = '';
    let accountName = '';

    if (platform === 'facebook' || platform === 'instagram') {
      // Exchange code for access token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${FACEBOOK_APP_ID}` +
        `&client_secret=${FACEBOOK_APP_SECRET}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&code=${code}`
      );

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token');
      }

      accessToken = tokenData.access_token;

      // Get user's pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      );
      const pagesData = await pagesResponse.json();

      if (pagesData.data && pagesData.data.length > 0) {
        // Use first page
        const page = pagesData.data[0];
        accountId = page.id;
        accountName = page.name;
        accessToken = page.access_token; // Use page access token
      } else {
        // Fallback to user account
        const userResponse = await fetch(
          `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`
        );
        const userData = await userResponse.json();
        accountId = userData.id;
        accountName = userData.name;
      }

    } else if (platform === 'linkedin') {
      // Exchange code for access token
      const tokenResponse = await fetch(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: LINKEDIN_CLIENT_ID,
            client_secret: LINKEDIN_CLIENT_SECRET,
            redirect_uri: redirectUri,
          }),
        }
      );

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token');
      }

      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || '';

      // Get user info
      const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userResponse.json();
      accountId = userData.sub;
      accountName = userData.name || userData.email;
    }

    // Save to database
    const pool = getPool();

    // Deactivate old accounts
    await pool.query(
      `UPDATE social_accounts 
       SET is_active = false 
       WHERE project_id = $1 AND platform = $2`,
      [projectId, platform]
    );

    // Insert new account
    await pool.query(
      `INSERT INTO social_accounts 
       (project_id, platform, account_id, account_name, access_token, refresh_token, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, true)`,
      [projectId, platform, accountId, accountName, accessToken, refreshToken]
    );

    return NextResponse.redirect(
      `${BASE_URL}/dashboard/projects/${projectId}/social-accounts?success=connected`
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${BASE_URL}/dashboard?error=oauth_failed`);
  }
}
