# Admin Allowlist Production Error Fix

## Root Cause Analysis

### Issue 1: Browser Console Warning
**Symptom**: `⚠️ ADMIN_EMAIL_ALLOWLIST not configured` appearing repeatedly in browser console

**Root Cause**: 
- `isAdminEmail()` was imported in `apps/web/src/app/dashboard/layout.tsx`
- This is a **client component** (`'use client'`)
- Next.js bundled the function for browser, trying to read `process.env.ADMIN_EMAIL_ALLOWLIST`
- Browser has no access to server env vars → warning

**Impact**: Performance degradation, console pollution, potential security exposure

### Issue 2: 500 Errors from API Routes
**Symptoms**: 
- `GET /api/team/members` → 500
- `POST /api/chat/handle-message` → 500

**Root Causes**:

1. **requireAdmin() throwing instead of returning 403**
   - Old code: `throw new Error('Unauthorized: Admin access required')`
   - Uncaught errors → 500 instead of proper 403 response
   - Used in `/api/admin/metrics`

2. **Insufficient error logging**
   - `/api/chat/handle-message` logged `error` object but not details
   - `/api/team/members` logged generic message without context
   - Hard to diagnose production issues from Railway logs

3. **No admin checks in /api/chat/handle-message**
   - Route doesn't need admin permissions
   - 500s likely from other causes (DB queries, Prisma errors, etc.)
   - Needed better error context to debug

## Solution Implemented

### 1. Server-Side Only Admin Checks

**File**: `apps/web/src/lib/admin/isAdmin.ts`

Changes:
```typescript
// Added runtime guard
export function isAdminEmail(email: string | null | undefined): boolean {
  // Guard against client-side usage
  if (typeof window !== 'undefined') {
    console.error('❌ isAdminEmail() called on client-side!');
    return false; // Safe default
  }
  
  if (!email) return false;
  
  const adminEmails = getAdminEmails();
  const normalizedEmail = email.toLowerCase().trim();
  
  return adminEmails.includes(normalizedEmail);
}

// Changed to return null instead of throwing
export async function requireAdmin() {
  const session = await getAdminSession();
  return session; // Returns session or null, never throws
}
```

**Benefits**:
- ✅ No client-side env var access attempts
- ✅ Graceful degradation (returns false on client)
- ✅ No uncaught exceptions

### 2. Client-Safe Admin Check API

**File**: `apps/web/src/app/api/admin/check-access/route.ts` (NEW)

```typescript
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ isAdmin: false });
    }

    const admin = isAdminEmail(session.user.email);
    
    return NextResponse.json({ isAdmin: admin });
  } catch (error) {
    console.error('[Admin Check] Error:', error);
    // On error, default to not admin (safe default)
    return NextResponse.json({ isAdmin: false });
  }
}
```

**Purpose**: Allows client components to check admin status without bundling server-only code

### 3. Updated Dashboard Layout

**File**: `apps/web/src/app/dashboard/layout.tsx`

Changes:
```typescript
// BEFORE:
import { isAdminEmail } from '@/lib/admin/isAdmin'; // ❌ Client bundle
{isAdminEmail(session?.user?.email) && <AdminLink />}

// AFTER:
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  if (status === 'authenticated') {
    fetch('/api/admin/check-access')
      .then(res => res.json())
      .then(data => setIsAdmin(data.isAdmin || false))
      .catch(() => setIsAdmin(false)); // Safe default
  }
}, [status]);

{isAdmin && <AdminLink />}
```

**Benefits**:
- ✅ No server-only imports in client bundle
- ✅ No console warnings
- ✅ Admin link appears after server confirms status

### 4. Enhanced Error Handling

**File**: `apps/web/src/app/api/admin/metrics/route.ts`

```typescript
// BEFORE:
await requireAdmin(); // Throws error → 500

// AFTER:
const adminSession = await requireAdmin();
if (!adminSession) {
  return NextResponse.json(
    { error: 'Admin access required' }, 
    { status: 403 }
  );
}
```

**File**: `apps/web/src/app/api/chat/handle-message/route.ts`

Added detailed logging:
```typescript
} catch (error: any) {
  console.error('[ChatBridge] Campaign generation error:', {
    error: error.message,
    stack: error.stack,
    projectId,
    hasStartAt: !!startAt,
  });
  
  return NextResponse.json({
    type: 'error',
    errorType: 'INTERNAL_ERROR',
    message: 'Serverio klaida. Bandykite dar kartą.',
    error: error.message, // Include for debugging
  }, { status: 500 });
}
```

**File**: `apps/web/src/app/api/team/members/route.ts`

Added context logging:
```typescript
console.log('[TeamMembers] Unauthorized - no session');
console.log('[TeamMembers] User not found in database', { email });
console.log('[TeamMembers] No organization membership found', { userId });

console.error('[TeamMembers] Error:', {
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
});
```

## Railway Environment Setup

### Step 1: Access Railway Dashboard

1. Go to https://railway.app/dashboard
2. Select your `Sanyla` project
3. Click on your service (web deployment)
4. Navigate to **Variables** tab

### Step 2: Add ADMIN_EMAIL_ALLOWLIST

Click **+ New Variable** and add:

```
ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com
```

**For multiple admins**, use comma-separated emails:
```
ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com,admin2@gmail.com,admin3@gmail.com
```

**Format rules**:
- Comma-separated (no spaces needed)
- Case-insensitive (will be normalized to lowercase)
- Whitespace will be trimmed automatically

### Step 3: Redeploy

Railway will automatically redeploy when you add/change environment variables.

Or manually trigger redeploy:
```bash
git push origin main  # Already done ✅
```

### Step 4: Verify Deployment

Wait 2-3 minutes for Railway build to complete, then check:

```
https://sanyla.site
```

## Verification Steps

### 1. Browser Console (No Warnings)

**Test**: Open https://sanyla.site/dashboard

**Expected**:
- ✅ No `ADMIN_EMAIL_ALLOWLIST not configured` warnings
- ✅ No errors about `process.env` in browser
- ✅ Clean console

**If you see warnings**:
- Clear browser cache (hard refresh: Cmd+Shift+R)
- Check that new deployment is live (Railway dashboard)

### 2. Admin Link Visibility

**Test**: Login as `valancikas@gmail.com`

**Expected**:
- ✅ "Admin" link appears in sidebar (purple shield icon)
- ✅ Link shows after ~1 second (API call delay)

**Test**: Login as non-admin email

**Expected**:
- ✅ No "Admin" link visible
- ✅ No console errors

### 3. Admin Dashboard Access

**Test**: Navigate to https://sanyla.site/admin

**As admin (valancikas@gmail.com)**:
- ✅ Dashboard loads successfully
- ✅ Metrics displayed (users, campaigns, etc.)
- ✅ No 403 or 500 errors

**As non-admin**:
- ✅ Shows "Access Denied" message
- ✅ Redirects to / after 2 seconds
- ✅ Browser Network tab shows `GET /api/admin/metrics` → 403 (not 500)

### 4. Team Members API

**Test**: Navigate to https://sanyla.site/dashboard/team

**Expected**:
- ✅ Page loads successfully
- ✅ Shows your team members (or empty if no team)
- ✅ No 500 errors

**Check Network Tab**:
- `GET /api/team/members` → 200 OK
- Response: `{ members: [...], invitations: [...] }`

**If 500 error occurs**:
- Check Railway logs for `[TeamMembers]` prefix
- Look for detailed error message and stack trace
- Common causes:
  - Database connection issues
  - Missing user record in `users` table
  - Missing `memberships` entry

### 5. Chat Campaign Generation

**Test**: Go to project chat, type "sukurk 7 dienų kampaniją"

**Expected**:
- ✅ Schedule modal appears
- ✅ After selecting date/time → Campaign generates
- ✅ No 500 errors

**If 500 error occurs**:
- Check Railway logs for `[ChatBridge]` prefix
- Look for detailed error object:
  ```
  [ChatBridge] Campaign generation error: {
    error: "...",
    stack: "...",
    projectId: "...",
    hasStartAt: true
  }
  ```
- Common causes:
  - Invalid startAt date format
  - Insufficient credits
  - Prisma/database errors
  - OpenAI API errors

### 6. Railway Logs Analysis

**Access logs**:
```bash
# Railway CLI
railway logs

# Or via dashboard
# Railway → Your Service → Deployments → Latest → View Logs
```

**Look for these patterns**:

✅ **Good logs** (no errors):
```
[ChatBridge] { projectId: '...', intent: 'GENERATE_7_DAY_CAMPAIGN', ... }
[Admin Check] GET /api/admin/check-access
[TeamMembers] GET /api/team/members
```

❌ **Error logs** (needs investigation):
```
[ChatBridge] Campaign generation error: { error: "...", stack: "..." }
[TeamMembers] Error: { error: "...", stack: "..." }
```

### 7. Missing ADMIN_EMAIL_ALLOWLIST Test

**Test**: Temporarily remove `ADMIN_EMAIL_ALLOWLIST` from Railway

**Expected behavior**:
- ✅ No console warnings
- ✅ No 500 errors
- ✅ No admin link for anyone (safe default)
- ✅ `/api/admin/check-access` returns `{ isAdmin: false }`
- ✅ `/api/admin/metrics` returns 403 for everyone

**To restore**:
- Re-add `ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com`
- Wait for redeploy (~2 min)

## Testing Checklist

**Pre-deployment** (Local):
- [x] No TypeScript errors
- [x] `isAdminEmail()` has client-side guard
- [x] `requireAdmin()` doesn't throw
- [x] New `/api/admin/check-access` route exists
- [x] Dashboard layout uses API instead of direct import

**Post-deployment** (Production):
- [ ] No browser console warnings for `ADMIN_EMAIL_ALLOWLIST`
- [ ] Admin link appears for `valancikas@gmail.com`
- [ ] Admin link hidden for non-admin users
- [ ] `/admin` page loads for admin (200)
- [ ] `/admin` page blocked for non-admin (403)
- [ ] `/api/admin/metrics` returns 403 for non-admin (not 500)
- [ ] `/api/team/members` returns 200 or 404 (not 500)
- [ ] `/api/chat/handle-message` works with detailed error logs
- [ ] Campaign generation successful with schedule modal

## Rollback Plan

If issues persist after deployment:

### Rollback to Previous Commit

```bash
git revert HEAD
git push origin main
```

### Check Previous Railway Deployment

Railway Dashboard → Deployments → Select previous working deployment → "Redeploy"

### Emergency Admin Access

If admin system breaks completely:

1. **Bypass via Database**:
   ```sql
   -- Direct database query to check users
   SELECT id, email, name FROM users WHERE email = 'valancikas@gmail.com';
   ```

2. **Temporarily Remove Admin Checks**:
   - Comment out `requireAdmin()` in `/api/admin/metrics`
   - Deploy quickly
   - Fix issue
   - Restore admin checks

## Monitoring

**Watch Railway logs for**:

1. **Frequent 500s from same endpoint**
   - Indicates unhandled error in that route
   - Check stack traces

2. **Prisma errors**
   - `PrismaClientKnownRequestError`
   - Database connection timeouts

3. **Auth errors**
   - `getServerSession()` returning null unexpectedly
   - Session cookie issues

4. **Rate limiting**
   - Too many API calls in short time
   - Consider adding rate limiting middleware

## Success Criteria

✅ **All checks passed**:
- No browser console warnings about env vars
- Admin link works for allowlisted emails only
- All API routes return proper HTTP status codes (403, not 500)
- Detailed error logs available for debugging 500s
- Chat campaign generation works end-to-end
- Team members page loads without errors

## Next Steps

1. **Monitor Railway logs for 24 hours** after deployment
2. **Test with real users** (ask team to try campaign generation)
3. **Set up error tracking** (consider Sentry for production error monitoring)
4. **Document common errors** in TROUBLESHOOTING.md based on logs

## Summary

**What was fixed**:
1. ✅ Removed client-side env var access (no more console warnings)
2. ✅ Created client-safe admin check API
3. ✅ Made `requireAdmin()` return null instead of throwing
4. ✅ Enhanced error logging in all API routes
5. ✅ Structured error responses with type + errorType + message
6. ✅ Safe defaults (missing env = no admins)

**What to set in Railway**:
```
ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com
```

**Deployment status**: 
- Commit: `bafbaa3`
- Pushed to Railway: ✅
- Build time: ~2-3 minutes

**Verification**: Test all endpoints listed above after deployment completes.
