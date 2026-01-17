# R2 Storage Configuration

## ✅ IMPLEMENTED: Permanent Image Storage

**Problem Solved:** DALL-E generated images expire after 1 hour, breaking campaigns.

**Solution:** Cloudflare R2 (S3-compatible) permanent storage.

---

## 🔑 Required Environment Variables

Add these to your `.env` file:

```bash
# Cloudflare R2 Storage
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=sanyla-assets
R2_PUBLIC_DOMAIN=assets.sanyla.site  # Optional: custom domain for public URLs
```

---

## 📦 How to Set Up Cloudflare R2

### Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the left sidebar
3. Click **Create bucket**
4. Name: `sanyla-assets`
5. Click **Create bucket**

### Step 2: Generate API Tokens

1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Permissions: **Read & Write**
4. Scope: `sanyla-assets` bucket
5. Click **Create API Token**
6. Copy the **Access Key ID** and **Secret Access Key**

### Step 3: Get R2 Endpoint

Your R2 endpoint is: `https://<account-id>.r2.cloudflarestorage.com`

- Find `<account-id>` in R2 dashboard settings
- Or use the endpoint shown when you created the bucket

### Step 4: Configure Public Access (Optional)

For direct public URLs without signed URLs:

1. Go to your bucket settings
2. Enable **Public Access**
3. Your public domain will be: `https://sanyla-assets.<account-id>.r2.dev`

OR set up a custom domain (recommended):

1. Go to bucket → **Settings** → **Custom Domains**
2. Add domain: `assets.sanyla.site`
3. Add CNAME record in Cloudflare DNS:
   ```
   assets.sanyla.site → sanyla-assets.<account-id>.r2.dev
   ```

---

## 🧪 Test the Setup

Run this in your terminal:

```bash
curl -X POST http://localhost:3000/api/storage/upload-from-url \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/test.png",
    "path": "test/upload.png"
  }'
```

Expected response:
```json
{
  "success": true,
  "url": "https://assets.sanyla.site/test/upload.png",
  "key": "test/upload.png",
  "size": 12345
}
```

---

## 📁 Storage Structure

All campaign images are organized like this:

```
sanyla-assets/
├── {userId}/
│   ├── {projectId}/
│   │   ├── day1/
│   │   │   ├── instagram-reels.png
│   │   │   ├── facebook.png
│   │   │   └── linkedin.png
│   │   ├── day2/
│   │   │   ├── instagram-reels.png
│   │   │   ├── facebook.png
│   │   │   └── linkedin.png
│   │   └── ...day3-7
```

This structure allows:
- ✅ Per-user isolation
- ✅ Per-project organization
- ✅ Easy cleanup when deleting projects
- ✅ Clear cost attribution

---

## 💰 Cost Estimate

Cloudflare R2 pricing (as of 2024):

- **Storage**: $0.015/GB/month
- **Class A operations** (writes): $4.50 per million
- **Class B operations** (reads): $0.36 per million
- **Egress (downloads)**: FREE (zero cost)

**Example costs for 100 campaigns:**
- 100 campaigns × 21 images × 1MB = 2.1 GB storage
- **Monthly cost**: ~$0.03/month
- **Write operations**: 2,100 uploads = ~$0.01
- **Total**: ~$0.04/month for 100 campaigns

**Compared to alternatives:**
- AWS S3: ~$0.50/month (egress fees apply)
- Google Cloud Storage: ~$0.40/month (egress fees apply)
- Cloudflare R2: **~$0.04/month (no egress fees)** ✅

---

## 🚀 What Changed in Code

### 1. New Files Created

- `/apps/web/src/lib/storage.ts` - Client-side helper
- `/apps/web/src/app/api/storage/upload-from-url/route.ts` - Upload endpoint
- `/apps/api/src/common/storage.service.ts` - NestJS storage service (not used yet)

### 2. Updated Files

- `/apps/web/src/app/api/ai/campaign-auto/route.ts`:
  - Added R2 storage integration
  - DALL-E images now saved permanently
  - Asset database entries created

### 3. Database Changes

No migration needed! Existing `Asset` model already supports this:

```prisma
model Asset {
  id        String   @id @default(cuid())
  type      String   // "image"
  filename  String   // "day1-instagram-reels.png"
  path      String   // R2 object key: "userId/projectId/day1/..."
  mimeType  String?  // "image/png"
  size      Int?
  projectId String
  createdAt DateTime @default(now())
}
```

---

## ⚠️ Important Notes

1. **Development**: Without R2 credentials, images fall back to temporary DALL-E URLs (still expire in 1h)
2. **Production**: R2 is REQUIRED for production deployment
3. **Migration**: Existing campaigns with expired DALL-E URLs cannot be recovered
4. **Cleanup**: Deleting a project should also delete its R2 assets (TODO: implement)

---

## ✅ Next Steps

After setting up R2:

1. Add environment variables to Railway/Vercel
2. Test campaign generation
3. Verify images are accessible after 1 hour
4. Implement asset cleanup job (delete R2 files when project deleted)
5. Add image optimization (resize, compress before upload)

---

## 🐛 Troubleshooting

**Error: "R2 credentials not configured"**
- Solution: Add R2 environment variables to `.env`

**Error: "Network timeout"**
- Solution: Check R2_ENDPOINT is correct (not behind firewall)

**Error: "Access Denied"**
- Solution: Verify R2 API token has Read & Write permissions

**Images don't load**
- Solution: Check R2_PUBLIC_DOMAIN is correct
- Alternative: Enable public access on bucket

**Slow uploads**
- Solution: Use Cloudflare Workers (edge locations) for uploads
- Alternative: Upload images in parallel (not sequential)
