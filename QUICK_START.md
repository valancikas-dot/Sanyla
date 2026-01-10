# 🚀 QUICK START GUIDE - Sanyla Platform

**Last Updated:** January 10, 2026  
**Status:** Ready to configure and launch 🎯

---

## ✅ Current Status

Your Sanyla platform is **100% built and deployed** to Railway!

**What's working:**
- ✅ All code deployed to production
- ✅ Database schema ready
- ✅ 17 languages support
- ✅ AI image & video generation features
- ✅ Social media integration ready

**What's needed:**
- ⚠️ Configure environment variables in Railway
- ⚠️ (Optional) Setup API keys for AI features

---

## 🔧 STEP 1: Configure Railway (REQUIRED)

### 1. Open Railway Dashboard
Go to: **https://railway.app/dashboard**

### 2. Select Your Project
Find and click on your **Sanyla** project

### 3. Go to Variables
Click: **Settings** → **Variables** (or **Environment Variables**)

### 4. Add Required Variables

Click **"+ New Variable"** and add these **TWO REQUIRED** variables:

**Variable 1:**
```
Name:  NEXTAUTH_SECRET
Value: lWCS2jfHK6QIRqUr50pislXB1ugdJmsAsKhg3IVxK0Y=
```

**Variable 2:**
```
Name:  NEXTAUTH_URL
Value: https://sanyla.site
```

### 5. Save Changes
Railway will **automatically redeploy** your app (~2-3 minutes)

---

## 🎨 STEP 2: Add OpenAI Key (Optional - for AI features)

If you want to use **AI Image Generation**, add OpenAI API key:

### 1. Get OpenAI API Key
1. Go to: **https://platform.openai.com/api-keys**
2. Sign in or create account
3. Click **"Create new secret key"**
4. Name it: `Sanyla Production`
5. **Copy the key** (starts with `sk-proj-...`)

### 2. Add to Railway
Back in Railway Variables, add:

```
Name:  OPENAI_API_KEY
Value: sk-proj-YOUR_ACTUAL_KEY_HERE
```

**Cost:** ~$0.04-0.08 per image (pay-as-you-go)

---

## 🎉 STEP 3: Access Your Platform

### Wait for Deployment
After adding variables, Railway will redeploy. Check the **Deployments** tab for status.

### Visit Your Site
Open: **https://sanyla.site**

### Login with Demo Account
```
Email:    demo@example.com
Password: demo123
```

---

## 📱 What You Can Do NOW (without additional API keys)

✅ **Full Platform Access:**
- Create marketing projects
- Setup brand kits (colors, tone, industry)
- Use content calendar
- Browse analytics dashboard
- Switch between 17 languages
- Manage scheduled posts

✅ **With OpenAI Key Added:**
- Generate AI images with DALL-E 3
- Create custom visuals (5 styles, 3 sizes)
- Download generated images

---

## 🔮 OPTIONAL: Social Media Integration

To connect Facebook, Instagram, LinkedIn, or TikTok, see detailed setup in:
**[API_KEYS_SETUP.md](./API_KEYS_SETUP.md)**

This includes:
- Meta (Facebook/Instagram) OAuth setup
- LinkedIn API configuration
- TikTok API access
- Runway ML for video generation

**Note:** These are optional and can be added later!

---

## 🧪 Testing Your Platform

### 1. Basic Features Test
- ✅ Login works
- ✅ Create new project
- ✅ Edit brand kit
- ✅ Browse content calendar
- ✅ Switch language (top-right selector)

### 2. AI Features Test (with OpenAI key)
1. Go to: **Projects** → **Your Project** → **AI Images**
2. Enter prompt: `"Modern office workspace, minimalist style"`
3. Select style and size
4. Click **Generate Image**
5. Should create image in ~10 seconds

### 3. Social Features Test (optional)
1. Go to: **Social Accounts**
2. See platform cards
3. OAuth works once API keys configured

---

## 🆘 Troubleshooting

### "502 Bad Gateway" Error
**Cause:** Railway is still deploying or missing environment variables

**Fix:**
1. Check Railway **Deployments** tab for status
2. Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
3. Wait 2-3 minutes after adding variables

### "Invalid API Key" (OpenAI)
**Cause:** Wrong API key or missing key

**Fix:**
1. Verify key copied completely (starts with `sk-proj-`)
2. Check no extra spaces in Railway variable
3. Regenerate key if needed

### "Demo login doesn't work"
**Cause:** Database not initialized

**Fix:**
1. Check Railway **Database** tab is active
2. Verify `DATABASE_URL` variable exists
3. Check deployment logs for errors

### "Page not found" errors
**Cause:** Frontend routing issue

**Fix:**
1. Hard refresh page (Cmd+Shift+R on Mac)
2. Clear browser cache
3. Check Railway deployment succeeded

---

## 📊 Environment Variables Summary

| Variable | Required | Purpose | Where to Get |
|----------|----------|---------|--------------|
| `NEXTAUTH_SECRET` | ✅ Yes | Authentication security | Generated above |
| `NEXTAUTH_URL` | ✅ Yes | App URL | `https://sanyla.site` |
| `DATABASE_URL` | ✅ Auto | PostgreSQL connection | Railway auto-adds |
| `OPENAI_API_KEY` | 🔵 Optional | AI image generation | platform.openai.com |
| `META_APP_ID` | 🟡 Social | Facebook/Instagram | developers.facebook.com |
| `LINKEDIN_CLIENT_ID` | 🟡 Social | LinkedIn publishing | linkedin.com/developers |
| `TIKTOK_CLIENT_KEY` | 🟡 Social | TikTok videos | developers.tiktok.com |
| `RUNWAY_API_KEY` | 🟡 Video | AI video generation | runwayml.com |

**Legend:**
- ✅ Required to start
- 🔵 Optional for features
- 🟡 Optional for integrations

---

## 🎯 Next Steps After Launch

### Week 1: Basic Setup
- ✅ Configure Railway variables
- ✅ Test demo login
- ✅ Create your first project
- ✅ Generate test AI image

### Week 2: Feature Testing
- 🔵 Add OpenAI key for full AI features
- 🔵 Test all 17 languages
- 🔵 Explore content calendar
- 🔵 Try brand kit customization

### Week 3: Social Integration (Optional)
- 🟡 Setup Meta app for Facebook/Instagram
- 🟡 Configure LinkedIn API
- 🟡 Test OAuth flows
- 🟡 Connect social accounts

### Month 2+: Production Use
- 🟢 Invite real users
- 🟢 Create marketing campaigns
- 🟢 Generate content at scale
- 🟢 Monitor analytics

---

## 📚 Additional Resources

- **Full API Setup:** [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)
- **Project Overview:** [README.md](./README.md)
- **Completion Summary:** [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)
- **Railway Docs:** https://docs.railway.app
- **OpenAI Docs:** https://platform.openai.com/docs

---

## ✨ Features Available

### Core Platform ✅
- 🎨 Project management
- 🌈 Brand kit customization
- 📅 Content calendar
- 📊 Analytics dashboard
- 🌍 17 languages support
- 🔐 Secure authentication

### AI Features (with OpenAI key) 🎯
- 🖼️ AI image generation (DALL-E 3)
- 🎬 AI video generation (Runway ML)
- ✍️ Caption generation
- 🎨 5 visual styles
- 📐 3 aspect ratios

### Social Integration (with API keys) 📱
- 📘 Facebook publishing
- 📷 Instagram posts
- 💼 LinkedIn content
- 🎵 TikTok videos
- 📊 Analytics sync
- ⏰ Scheduled posting

---

## 💰 Cost Overview

### Minimum Monthly Cost
- **Railway Hosting:** ~$20-40/month
- **Database:** Included in Railway
- **Basic Platform:** Ready to use!

### Optional Costs (Pay-as-you-go)
- **OpenAI API:** $10-50/month (depends on usage)
- **Runway ML:** $15+/month (if using video)
- **Meta/LinkedIn/TikTok:** Free (with rate limits)

**Total to start:** $20-40/month (just Railway hosting)

---

## 🎊 You're Ready!

Your platform is **fully built** and ready to launch. Just:

1. ✅ Add 2 environment variables to Railway
2. ✅ Wait 2-3 minutes for deployment
3. ✅ Visit https://sanyla.site
4. ✅ Login and start creating!

**Questions?** Check [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) for detailed guides.

---

**Happy marketing! 🚀**

---

**Project:** Sanyla AI Marketing Automation  
**Version:** 1.0.0  
**Date:** January 10, 2026  
**Status:** ✅ Production Ready
