# Railway Environment Variables - Quick Reference

## Required Variables for Production

### Database
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```
**Status**: ✅ Already set by Railway PostgreSQL service  
**Purpose**: Prisma database connection

---

### Application URLs
```bash
# Primary app URL (used by NextAuth + server-side fetch)
NEXTAUTH_URL=https://sanyla.site

# Optional: Explicit public URL (fallback if NEXTAUTH_URL missing)
NEXT_PUBLIC_APP_URL=https://sanyla.site
```
**Status**: ⚠️ VERIFY IN RAILWAY DASHBOARD  
**Purpose**: 
- NextAuth OAuth callbacks
- Server-side fetch() absolute URLs
- Social media redirects

**Critical for**:
- ✅ Storage uploads (uploadImageToStorage)
- ✅ Google OAuth login
- ✅ Internal API calls from server routes

---

### Admin Access
```bash
ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com
```
**Status**: ⚠️ SET IN RAILWAY DASHBOARD  
**Purpose**: Comma-separated list of admin emails  
**Format**: `email1@gmail.com,email2@gmail.com,email3@gmail.com`

**Optional**: Missing env = no admins (safe default)

---

### OAuth Credentials
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

NEXTAUTH_SECRET=your-random-secret-32-chars-min
```
**Status**: ✅ Already set  
**Purpose**: Google OAuth login

---

### AI Services
```bash
OPENAI_API_KEY=sk-...
```
**Status**: ✅ Already set  
**Purpose**: Campaign generation, content creation

---

### Storage (Cloudflare R2)
```bash
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=sanyla-storage
R2_PUBLIC_DOMAIN=storage.sanyla.site
```
**Status**: ✅ Already set  
**Purpose**: Image uploads, permanent storage

---

## How to Set/Verify in Railway

### Via Railway Dashboard
1. Go to: https://railway.app/dashboard
2. Select: **Sanyla** project
3. Click: **Web** service
4. Navigate: **Variables** tab
5. Check/Add variables listed above

### Via Railway CLI
```bash
# Install Railway CLI (if needed)
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# List current variables
railway variables

# Set a variable
railway variables --set NEXTAUTH_URL=https://sanyla.site

# Set multiple
railway variables --set ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com
railway variables --set NEXT_PUBLIC_APP_URL=https://sanyla.site
```

---

## Verification Commands

### Check all critical variables are set
```bash
railway variables | grep -E "NEXTAUTH_URL|DATABASE_URL|OPENAI_API_KEY|R2_BUCKET_NAME|ADMIN_EMAIL_ALLOWLIST"
```

**Expected output**:
```
NEXTAUTH_URL=https://sanyla.site
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
R2_BUCKET_NAME=sanyla-storage
ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com
```

### Test from running app
```bash
# Test NEXTAUTH_URL is accessible
railway run --service web node -e "console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)"

# Test database connection
railway run --service web npx prisma db execute --stdin << 'SQL'
SELECT NOW();
SQL

# Test admin allowlist
railway run --service web node -e "
const allowlist = process.env.ADMIN_EMAIL_ALLOWLIST || '';
console.log('Admin emails:', allowlist.split(',').map(e => e.trim()));
"
```

---

## Current Production Config (As of Jan 18, 2026)

### Confirmed Working ✅
- ✅ `DATABASE_URL` - PostgreSQL connection
- ✅ `OPENAI_API_KEY` - AI generation
- ✅ `R2_*` - Storage uploads
- ✅ `GOOGLE_CLIENT_ID/SECRET` - OAuth login
- ✅ `NEXTAUTH_SECRET` - Session encryption

### Must Verify ⚠️
- ⚠️ `NEXTAUTH_URL=https://sanyla.site` - **CHECK NOW**
- ⚠️ `ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com` - **SET NOW**

### Optional (Recommended) 💡
- 💡 `NEXT_PUBLIC_APP_URL=https://sanyla.site` - Explicit public URL
- 💡 `NODE_ENV=production` - Usually auto-set by Railway

---

## Common Issues & Fixes

### Issue: "Invalid URL" errors in storage uploads
**Cause**: Missing `NEXTAUTH_URL`  
**Fix**:
```bash
railway variables --set NEXTAUTH_URL=https://sanyla.site
railway service --restart
```

### Issue: Admin link doesn't appear
**Cause**: Missing `ADMIN_EMAIL_ALLOWLIST`  
**Fix**:
```bash
railway variables --set ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com
# No restart needed - next request will pick it up
```

### Issue: OAuth login fails with "redirect_uri_mismatch"
**Cause**: `NEXTAUTH_URL` doesn't match Google OAuth settings  
**Fix**:
1. Check Railway variable: `railway variables | grep NEXTAUTH_URL`
2. Should be: `https://sanyla.site`
3. Verify in Google Cloud Console → OAuth → Authorized redirect URIs:
   - `https://sanyla.site/api/auth/callback/google`

---

## Security Best Practices

### ✅ DO
- ✅ Use Railway's encrypted variables
- ✅ Set `NEXTAUTH_SECRET` to random 32+ char string
- ✅ Use HTTPS URLs only (`https://sanyla.site`)
- ✅ Limit `ADMIN_EMAIL_ALLOWLIST` to trusted emails only

### ❌ DON'T
- ❌ Commit secrets to git
- ❌ Share Railway dashboard access
- ❌ Use HTTP URLs in production
- ❌ Hardcode API keys in code

---

## Variable Precedence

Railway variables override local `.env` files:
```
Railway Dashboard Variables (HIGHEST)
  ↓
Railway CLI set variables
  ↓
.env.local (ignored in production)
  ↓
.env (defaults only)
```

**In production**: Only Railway dashboard variables are used

---

## After Setting Variables

Railway automatically redeploys when you:
- ✅ Add new variable
- ✅ Update existing variable
- ✅ Delete variable

No manual restart needed (unless noted).

**Build time**: ~2-3 minutes

---

## Quick Setup Script

```bash
#!/bin/bash
# Run this locally to set all required Railway variables

railway login
railway link

# Required variables
railway variables --set NEXTAUTH_URL=https://sanyla.site
railway variables --set ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com

# Optional but recommended
railway variables --set NEXT_PUBLIC_APP_URL=https://sanyla.site

# Verify
echo "✅ Variables set. Verifying..."
railway variables | grep -E "NEXTAUTH_URL|ADMIN_EMAIL_ALLOWLIST|NEXT_PUBLIC_APP_URL"
```

Save as `setup-railway-env.sh` and run:
```bash
chmod +x setup-railway-env.sh
./setup-railway-env.sh
```

---

## Troubleshooting

### Variables not taking effect
1. Check Railway dashboard shows correct value
2. Check deployment succeeded (no build errors)
3. Restart service manually:
   ```bash
   railway service --restart
   ```

### Can't access Railway CLI
Use dashboard instead:
1. Go to https://railway.app/dashboard
2. Manual entry is more reliable for sensitive values

### Variable contains special characters
Use quotes in CLI:
```bash
railway variables --set SECRET="value-with-special$chars"
```

Or use dashboard (safer for complex values).

---

## Support Links

- **Railway Docs**: https://docs.railway.app/develop/variables
- **Dashboard**: https://railway.app/dashboard
- **This Project**: https://github.com/valancikas-dot/Sanyla

**Last Updated**: January 18, 2026
