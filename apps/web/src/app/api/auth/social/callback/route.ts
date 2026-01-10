import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const platform = searchParams.get('platform') || 'FACEBOOK';

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }

  try {
    // Get projectId from localStorage (set before redirect)
    // In real app, use state parameter for security
    
    // Exchange code for access token
    let accessToken = '';
    let accountId = '';
    let accountName = '';

    // TODO: Implement actual OAuth exchange
    // For now, redirect back with success
    
    const redirectUrl = new URL('/dashboard?oauth=success', request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}
