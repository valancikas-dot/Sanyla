/**
 * Admin Access Control
 * Checks if a user email is in the admin allowlist
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Get allowlisted admin emails from environment variable
 * Format: "email1@gmail.com,email2@gmail.com" or single email
 */
export function getAdminEmails(): string[] {
  const allowlist = process.env.ADMIN_EMAIL_ALLOWLIST || '';
  
  if (!allowlist) {
    console.warn('⚠️ ADMIN_EMAIL_ALLOWLIST not configured');
    return [];
  }
  
  return allowlist
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

/**
 * Check if an email is in the admin allowlist
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = getAdminEmails();
  const normalizedEmail = email.toLowerCase().trim();
  
  return adminEmails.includes(normalizedEmail);
}

/**
 * Server-side check: Is current session user an admin?
 * Returns session if admin, null otherwise
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
 * Throws error if not admin
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  
  if (!session) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return session;
}
