/**
 * Admin Access Control
 * Checks if a user email is in the admin allowlist
 * 
 * ⚠️ SERVER-SIDE ONLY - Do not import in client components
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Get allowlisted admin emails from environment variable
 * Format: "email1@gmail.com,email2@gmail.com" or single email
 * 
 * SERVER-SIDE ONLY - Never call from client components
 */
export function getAdminEmails(): string[] {
  // Check if running on server
  if (typeof window !== 'undefined') {
    console.error('❌ getAdminEmails() called on client-side! This is a server-only function.');
    return [];
  }

  const allowlist = process.env.ADMIN_EMAIL_ALLOWLIST || '';
  
  if (!allowlist) {
    // Don't warn - it's optional. Default to no admins.
    return [];
  }
  
  return allowlist
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

/**
 * Check if an email is in the admin allowlist
 * 
 * SERVER-SIDE ONLY - Never call from client components
 * Returns false if called on client-side
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  // Guard against client-side usage
  if (typeof window !== 'undefined') {
    console.error('❌ isAdminEmail() called on client-side! Use /api/admin/check-access instead.');
    return false;
  }

  if (!email) return false;
  
  const adminEmails = getAdminEmails();
  const normalizedEmail = email.toLowerCase().trim();
  
  return adminEmails.includes(normalizedEmail);
}

/**
 * Server-side check: Is current session user an admin?
 * Returns session if admin, null otherwise
 * 
 * SERVER-SIDE ONLY
 */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }
  
  if (!isAdminEmail(session.user.email)) {
    return null;
  }
  
  return session;
}

/**
 * Middleware-style check for API routes
 * Returns session if admin, null if not
 * 
 * Usage in API routes:
 * ```
 * const adminSession = await requireAdmin();
 * if (!adminSession) {
 *   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
 * }
 * ```
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  return session; // Returns session or null, never throws
}
