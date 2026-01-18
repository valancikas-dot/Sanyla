# Railway Environment Variables - R2 Storage Setup

## Required Environment Variables

### Cloudflare R2 Configuration

Add these to Railway > Project > Variables:

```bash
# R2 Endpoint (Account ID from R2 dashboard)
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# R2 API Token Credentials (from R2 > Manage R2 API Tokens)
R2_ACCESS_KEY_ID=<your_access_key_id>
R2_SECRET_ACCESS_KEY=<your_secret_access_key>

# R2 Bucket Name
R2_BUCKET_NAME=sanyla-assets

# R2 Public Domain (optional - for custom domain)
R2_PUBLIC_DOMAIN=assets.sanyla.site
# OR use default: sanyla-assets.r2.dev
```

## How to Get Cloudflare R2 Credentials

### Step 1: Get Account ID
1. Go to Cloudflare Dashboard
2. Navigate to **R2** in sidebar
3. Your Account ID is in the endpoint URL: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

### Step 2: Create API Token
1. In R2 Dashboard, click **Manage R2 API Tokens**
2. Click **Create API Token**
3. Name: `sanyla-production-write`
4. Permissions: **Object Read & Write** (NOT Admin Read & Write)
5. Specify bucket: `sanyla-assets` (or leave for all buckets)
6. TTL: Leave blank (never expires) or set expiry
7. Click **Create API Token**
8. Copy `Access Key ID` and `Secret Access Key` **immediately** (won't show again)

### Step 3: Create R2 Bucket
1. In R2 Dashboard, click **Create Bucket**
2. Bucket name: `sanyla-assets`
3. Location: Automatic
4. Click **Create Bucket**

### Step 4: Set Public Access (Optional)
1. Go to bucket settings
2. Click **Settings** > **Public Access**
3. Enable **Allow Access** for public reads
4. Your public domain will be: `sanyla-assets.r2.dev`

OR set up custom domain:
1. Click **Connect Domain**
2. Enter: `assets.sanyla.site`
3. Add CNAME record in Cloudflare DNS: `assets.sanyla.site` → `sanyla-assets.r2.dev`
4. Use `R2_PUBLIC_DOMAIN=assets.sanyla.site`

## Verify Setup

### 1. Check Environment Variables
```bash
railway run --service web env | grep R2_
```

Expected output:
```
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=sanyla-assets
R2_PUBLIC_DOMAIN=assets.sanyla.site
```

### 2. Test R2 Health
```bash
curl https://sanyla.site/api/storage/health
```

Expected response:
```json
{
  "healthy": true,
  "checks": {
    "environment": {
      "R2_ENDPOINT": "✅ Set",
      "R2_ACCESS_KEY_ID": "✅ Set",
      "R2_SECRET_ACCESS_KEY": "✅ Set"
    },
    "bucket": {
      "status": "✅ Accessible"
    },
    "upload": {
      "status": "✅ Success"
    }
  }
}
```

### 3. Test Upload
```bash
# Create test campaign with image generation
# Should upload DALL-E images to R2 successfully
```

## Troubleshooting

### Error: "Unauthorized" or "Access Denied"
- Check API token has **Object Read & Write** permissions
- Verify token is not expired
- Ensure bucket name matches exactly

### Error: "InvalidAccessKeyId"
- Verify `R2_ACCESS_KEY_ID` is correct
- Check no extra spaces or quotes in Railway variable

### Error: "SignatureDoesNotMatch"
- Verify `R2_SECRET_ACCESS_KEY` is correct
- Ensure variable is not URL-encoded

### Error: "NoSuchBucket"
- Verify bucket `sanyla-assets` exists in Cloudflare R2
- Check `R2_BUCKET_NAME` matches exactly (case-sensitive)

### Error: "Invalid endpoint"
- Ensure `R2_ENDPOINT` has format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- Do NOT use bucket domain (e.g., `sanyla-assets.r2.dev`)

## Migration from Old Storage

If migrating from existing storage:
1. Keep old storage URLs working (don't delete)
2. New uploads go to R2
3. Optionally migrate old assets with script
4. Update database URLs (if needed)

## Security Notes

- ✅ API token stored in Railway env vars (encrypted)
- ✅ Secret key never exposed to client
- ✅ Server-side only (Next.js API routes)
- ⚠️ Public bucket allows READ access (uploads are write-protected)
- ✅ Use presigned URLs for temporary upload access (if needed)

## Cost Estimate

Cloudflare R2:
- Storage: $0.015/GB/month
- Class A ops (write): $4.50/million requests
- Class B ops (read): $0.36/million requests
- **Egress: FREE** (unlike S3!)

For 1000 campaigns/month with 10MB images:
- Storage: ~10GB = $0.15/month
- Writes: ~1000 = $0.0045/month
- **Total: ~$0.16/month** (vs AWS S3 ~$5-10/month with egress)
