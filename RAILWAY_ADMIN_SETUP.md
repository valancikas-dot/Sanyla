# Quick Setup: Railway Environment Variable

## Add ADMIN_EMAIL_ALLOWLIST to Railway

### Option 1: Railway Dashboard (Recommended)

1. **Go to**: https://railway.app/dashboard
2. **Select**: Sanyla project
3. **Click**: Your web service
4. **Navigate**: Variables tab
5. **Click**: + New Variable
6. **Add**:
   ```
   Variable: ADMIN_EMAIL_ALLOWLIST
   Value: valancikas@gmail.com
   ```
7. **Click**: Add Variable
8. **Wait**: 2-3 minutes for automatic redeploy

### Option 2: Railway CLI

```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Set variable
railway variables --set ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com

# Check it's set
railway variables
```

### Multiple Admins

For multiple admin emails:
```
ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com,admin2@gmail.com,admin3@gmail.com
```

**Format**:
- Comma-separated
- No spaces needed (will be trimmed)
- Case-insensitive

## Verify It's Working

### 1. Check Deployment

Railway Dashboard → Deployments → Latest should show:
- ✅ Status: Success
- ✅ Logs show no ADMIN_EMAIL_ALLOWLIST warnings

### 2. Test Admin Access

1. **Login** to https://sanyla.site
2. **As valancikas@gmail.com**:
   - Should see "Admin" link in sidebar (purple shield)
   - Can access https://sanyla.site/admin
3. **As other user**:
   - No admin link visible
   - /admin returns 403

### 3. Check Console

Browser console at https://sanyla.site/dashboard:
- ✅ No warnings about `ADMIN_EMAIL_ALLOWLIST`
- ✅ Clean console

## Troubleshooting

### Admin link not appearing

**Check**:
1. Variable is set in Railway (check Variables tab)
2. Email matches exactly: `valancikas@gmail.com`
3. Deployment completed successfully
4. Hard refresh browser (Cmd+Shift+R)

**Try**:
```bash
# Re-trigger deployment
git commit --allow-empty -m "trigger deploy"
git push origin main
```

### Still seeing console warnings

**Cause**: Old deployment still serving (CDN cache)

**Fix**:
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R)
3. Try incognito/private window
4. Wait 5 minutes for Railway CDN to update

### 500 errors still occurring

**Check Railway logs**:
```bash
railway logs --tail
```

**Look for**:
- `[ChatBridge]` errors with stack traces
- `[TeamMembers]` errors with details
- Database connection errors
- Prisma query errors

**Common fixes**:
- Check DATABASE_URL is set
- Verify database is accessible
- Check Prisma schema matches database

## Current Deployment

- **Commit**: `bafbaa3`
- **Branch**: `main`
- **Status**: Deployed ✅
- **URL**: https://sanyla.site

## Need Help?

Check full documentation: `ADMIN_ALLOWLIST_FIX.md`

Or check Railway logs:
```bash
railway logs --tail
```
