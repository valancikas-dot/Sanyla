# API Keys Setup Guide

Complete guide for setting up all required API keys for Sanyla platform.

## 🔑 Required API Keys

### 1. OpenAI API (DALL-E 3) ✅ REQUIRED
**Status:** Essential for AI image generation

#### Setup Steps:
1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name it: `Sanyla Production`
4. Copy the key (starts with `sk-...`)
5. Add to Railway:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```

**Cost:** ~$0.04 per image (1024x1024), ~$0.08 per image (HD quality)

---

## 📱 Social Media API Keys

### 2. Meta (Facebook & Instagram) API
**Status:** Required for Facebook/Instagram publishing

#### Step 1: Create Facebook App
1. Go to https://developers.facebook.com/apps/
2. Click **"Create App"**
3. Select **"Business"** type
4. Fill in:
   - **App Name:** Sanyla
   - **Contact Email:** your-email@domain.com
5. Click **"Create App"**

#### Step 2: Configure App
1. In dashboard, go to **Settings → Basic**
2. Copy **App ID** and **App Secret**
3. Add **App Domains:** `sanyla.site`
4. Add **Privacy Policy URL:** `https://sanyla.site/privacy`
5. Add **Terms of Service URL:** `https://sanyla.site/terms`

#### Step 3: Add Products
1. Click **"Add Product"**
2. Add **"Facebook Login"**
3. In Facebook Login settings:
   - **Valid OAuth Redirect URIs:**
     ```
     https://sanyla.site/api/auth/social/callback
     http://localhost:3000/api/auth/social/callback
     ```

4. Add **"Instagram Basic Display"**
5. Add permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`

#### Step 4: Add to Railway
```env
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
NEXT_PUBLIC_META_APP_ID=your_app_id
```

**Verification:**
- Go to App Review → Request Advanced Access for permissions
- Submit for review (takes 1-5 business days)

---

### 3. LinkedIn API
**Status:** Required for LinkedIn publishing

#### Step 1: Create LinkedIn App
1. Go to https://www.linkedin.com/developers/apps
2. Click **"Create app"**
3. Fill in:
   - **App name:** Sanyla
   - **LinkedIn Page:** Your company page
   - **Privacy policy URL:** `https://sanyla.site/privacy`
   - **App logo:** Upload Sanyla logo
4. Check verification checkbox
5. Click **"Create app"**

#### Step 2: Configure Products
1. In **Products** tab, request access to:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn**
   - **Marketing Developer Platform** (optional, for analytics)

#### Step 3: Auth Settings
1. Go to **Auth** tab
2. Add **Redirect URLs:**
   ```
   https://sanyla.site/api/auth/social/callback
   http://localhost:3000/api/auth/social/callback
   ```

#### Step 4: Get Credentials
1. In **Auth** tab, copy:
   - **Client ID**
   - **Client Secret**

#### Step 5: Add to Railway
```env
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_client_id
```

**Scopes needed:**
- `openid`
- `profile`
- `email`
- `w_member_social`

---

### 4. TikTok API
**Status:** Optional (for TikTok publishing)

#### Step 1: Create TikTok Developer Account
1. Go to https://developers.tiktok.com/
2. Click **"Register"**
3. Complete verification (email + phone)

#### Step 2: Create App
1. In Developer Portal, click **"Manage apps"**
2. Click **"Connect an app"**
3. Fill in:
   - **App name:** Sanyla
   - **Category:** Social Media
   - **Redirect URL:** `https://sanyla.site/api/auth/social/callback`

#### Step 3: Request API Access
1. Go to app dashboard
2. Request access to:
   - **Login Kit**
   - **Content Posting API**
   - **Video Kit**

#### Step 4: Get Credentials
1. In **Basic info**, copy:
   - **Client Key**
   - **Client Secret**

#### Step 5: Add to Railway
```env
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_client_key
```

**Note:** TikTok API access requires business verification (can take 2-4 weeks)

---

## 🎬 AI Video Generation

### 5. Runway ML API
**Status:** Optional (for AI video generation)

#### Step 1: Create Runway Account
1. Go to https://runwayml.com/
2. Sign up for account
3. Upgrade to Pro plan ($15/month minimum)

#### Step 2: Generate API Key
1. Go to **Settings → API Keys**
2. Click **"Create API Key"**
3. Copy the key

#### Step 3: Add to Railway
```env
RUNWAY_API_KEY=your_runway_api_key
```

**Alternative:** For now, system uses fallback mock URLs if Runway API is not available

**Cost:** ~$0.05 per second of video generated

---

## 🔐 NextAuth Configuration

### 6. NextAuth Secret
**Status:** REQUIRED for authentication

#### Generate Secret:
```bash
openssl rand -base64 32
```

#### Add to Railway:
```env
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://sanyla.site
```

---

## 📊 Complete Railway Environment Variables

After setting up all APIs, your Railway environment variables should look like this:

```env
# Database (Already configured)
DATABASE_URL=postgresql://postgres:xxxxx@tramway.proxy.rlwy.net:59033/railway

# Redis (Already configured)
REDIS_HOST=your_redis_host
REDIS_PORT=6379

# NextAuth (REQUIRED)
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://sanyla.site

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Meta / Facebook / Instagram (REQUIRED for social publishing)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
NEXT_PUBLIC_META_APP_ID=your_app_id

# LinkedIn (REQUIRED for LinkedIn publishing)
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_client_id

# TikTok (OPTIONAL)
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_client_key

# Runway ML (OPTIONAL for video generation)
RUNWAY_API_KEY=your_runway_api_key

# Application
PORT=3000
NODE_ENV=production
```

---

## 🧪 Testing APIs

### Test OpenAI:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Test Meta:
```bash
curl "https://graph.facebook.com/v18.0/me?access_token=YOUR_ACCESS_TOKEN"
```

### Test LinkedIn:
```bash
curl -X GET https://api.linkedin.com/v2/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Priority Setup Order

1. ✅ **CRITICAL (Required for basic functionality):**
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - OPENAI_API_KEY

2. 🔵 **HIGH (Required for full features):**
   - META_APP_ID + META_APP_SECRET
   - LINKEDIN_CLIENT_ID + LINKEDIN_CLIENT_SECRET

3. 🟡 **MEDIUM (Nice to have):**
   - TIKTOK credentials
   - RUNWAY_API_KEY

---

## 🚨 Security Notes

- **Never commit API keys to Git**
- Store keys in Railway environment variables only
- Rotate keys every 3-6 months
- Use separate keys for development and production
- Monitor API usage to detect unauthorized access

---

## 💰 Cost Estimate

**Monthly costs with moderate usage:**
- OpenAI API: $10-50/month (depends on image generation volume)
- Meta API: Free (with usage limits)
- LinkedIn API: Free
- TikTok API: Free
- Runway ML: $15+/month (if using video generation)

**Total estimated: $25-100/month**

---

## 🆘 Troubleshooting

### "Invalid API Key" error:
- Check for leading/trailing spaces
- Verify key is copied completely
- Ensure key has proper permissions

### OAuth redirect errors:
- Verify redirect URLs match exactly (including http/https)
- Check domain is added to app settings
- Clear browser cookies and try again

### Rate limiting:
- OpenAI: 500 requests/minute (Tier 1)
- Meta: Varies by endpoint (usually 200 calls/hour)
- LinkedIn: 100 API calls/day for free tier

---

## 📞 Support

- **OpenAI:** https://help.openai.com/
- **Meta:** https://developers.facebook.com/support/
- **LinkedIn:** https://www.linkedin.com/help/linkedin/ask/api
- **TikTok:** https://developers.tiktok.com/support

---

**Last Updated:** January 10, 2026
**Platform:** Sanyla v1.0
**Maintainer:** Sanyla Team
