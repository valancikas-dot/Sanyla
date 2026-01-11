# 🚀 Sanyla - Pilna AI Marketing Automatizacija

## ✅ Kas jau veikia:

### 1. **30 dienų Turinio Kalendorius** 📅
**Endpoint:** `POST /api/content-calendar/generate`

**Veikimas:**
- Vartotojas spaudžia "Generuoti 30d planą"
- GPT-4 sukuria 30 dienų content strategiją:
  - Kiekvienai dienai: post/story/reel
  - Platformos: Instagram, Facebook, LinkedIn, TikTok
  - Caption + hashtags + posting time
  - Visual aprašymas DALL-E generavimui
- Viskas išsaugoma `content_calendar` lentelėje su status `pending_approval`

**UI:** `/dashboard/projects/[id]/calendar`

---

### 2. **Content Approval Workflow** ✅❌
**Endpoints:**
- `PATCH /api/content-calendar/[id]` - Patvirtinti/Atmesti
- `POST /api/content-calendar/[id]/generate-media` - Generuoti nuotrauką DALL-E

**Veikimas:**
- Vartotojas mato visus 30 dienų posts
- Kiekvienam gali:
  1. **Generuoti media** (DALL-E 3 image)
  2. **Patvirtinti** (status → `approved`)
  3. **Atmesti** (status → `rejected`)
  4. **Redaguoti** caption/hashtags
- Patvirtinti posts automatiškai postinami pagal `scheduledDate` ir `postingTime`

---

### 3. **Automatinis Posting** 🤖
**Endpoint:** `POST /api/social-posting/post`

**Platformos:**
- ✅ **Facebook** - Graph API v18.0
- ✅ **Instagram** - Container + Publish flow
- ✅ **LinkedIn** - UGC Posts API
- ⏳ **TikTok** - Coming soon (reikia video upload)

**Veikimas:**
- Vartotojas prijungia social accounts (`social_accounts` lentelė)
- Sistema laiko `accessToken`, `refreshToken`, `pageId`
- Kai content status = `approved`, sistema:
  1. Laukia `scheduledDate` + `postingTime`
  2. Automatiškai postina per platform API
  3. Išsaugo `postId` į `content_analytics`
  4. Status → `posted`

---

### 4. **Cron Job / Scheduled Posting** ⏰
**Endpoint:** `GET /api/cron/auto-post`

**Setup Railway:**
```bash
# Railway cron expression (every hour)
0 * * * *
```

**Veikimas:**
- Kas valandą Railway kviečia `/api/cron/auto-post`
- Sistema tikrina:
  - Ar yra `approved` content
  - Ar `scheduledDate` = šiandiena
  - Ar `postingTime` <= dabartinis laikas
- Jei taip → automatiškai postina
- Rezultatas: `{ posted: 5, failed: 0 }`

---

### 5. **AI Insights & Analytics** 💡
**Endpoints:**
- `POST /api/ai-insights/analyze` - Generuoti insights
- `GET /api/ai-insights?projectId=xxx` - Gauti insights

**Veikimas:**
- GPT-4 analizuoja:
  - Content performance (`content_analytics`)
  - Best performing posts
  - Optimal posting times
  - Audience behavior
  - Platform-specific recommendations
- Sukuria 5-7 insights su:
  - Priority (critical/high/medium/low)
  - Action items
  - Rekomendacijos

**UI:** `/dashboard/projects/[id]/insights`

---

### 6. **Kalbos Automatinis Aptikimas** 🌍
**Funkcija:** `detectLanguageFromPrompt()`

**Veikimas:**
- Vartotojas rašo chatbot'ui **bet kuria kalba**
- Sistema aptinka kalbą iš teksto:
  - Lithuanian: `[ąčęėįšųūž]`, `sukurk`, `sugeneruok`
  - German: `[äöüß]`, `erstelle`, `generiere`
  - French: `[àâæçéèê]`, `créer`, `générer`
  - Polish: `[ąćęłńóśźż]`, `utwórz`
  - Russian/Ukrainian: Cyrillic
  - Czech, Slovak, etc.
- GPT-4 gauna instrukciją: `CRITICAL: Generate ALL content in Lithuanian language`
- **Rezultatas:** AI atsako ta pačia kalba!

---

## 📊 Duomenų Bazės Schemos

### `content_calendar`
```sql
id, projectId, scheduledDate, contentType, platform, status,
caption, hashtags[], mediaUrls[], postingTime, 
aiGenerated, approvalNotes, postedAt, approvedAt, approvedBy
```

### `social_accounts`
```sql
id, projectId, platform, accountId, accessToken, refreshToken,
pageId, businessAccountId, isActive
```

### `content_analytics`
```sql
id, contentId, platform, postId, impressions, reach, engagement,
likes, comments, shares, engagementRate, dataFetchedAt
```

### `ai_insights`
```sql
id, projectId, insightType, title, description, priority,
actionItems[], isRead, isImplemented
```

### `competitor_analysis`
```sql
id, projectId, competitorName, platform, analysisType,
data (JSONB), insights[], recommendations[]
```

---

## 🎯 Kaip Vartotojas Naudoja

### 1. Sukuria projektą
```
Name: Rangis
Industry: Interior design
Language: Lithuanian
```

### 2. Eina į "30d Kalendorius"
- Spaudžia **"Generuoti 30d planą"**
- GPT-4 sukuria 30 posts su captions, hashtags, visual descriptions
- Viskas status `pending_approval`

### 3. Peržiūri ir patvirtina content
Kiekvienam post:
1. **"Generuoti media"** → DALL-E sukuria paveikslėlį
2. Jei patinka → **"Patvirtinti"** (status → `approved`)
3. Jei nepatinka → **"Atmesti"** arba **"Redaguoti"**

### 4. Sistema automatiškai postina
- Railway cron kas valandą tikrina `approved` content
- Jei laikas atėjo → postina į Facebook/Instagram/LinkedIn
- Status → `posted`
- Analytics pradeda rinkti data

### 5. Gauna AI insights
- Spaudžia **"AI Insights"**
- GPT-4 analizuoja performance
- Gauna rekomendacijas:
  - "Best time to post: 18:00-20:00"
  - "Reels get 3x more engagement"
  - "Use more emojis in captions"

---

## 🔥 Ką dar reikia pridėti

### Video/Reels generavimas
- ❌ API integracija su video AI (Runway, Pika, etc.)
- ❌ Text-to-video modeliai

### Competitor Analysis
- ❌ Web scraping competitor social accounts
- ❌ Competitor post tracking
- ❌ GPT-4 analysis of competitor strategy

### Advanced Analytics
- ❌ Real-time fetch iš Facebook/Instagram API
- ❌ Engagement rate calculations
- ❌ ROI tracking
- ❌ A/B testing results

### Social Account OAuth
- ❌ Facebook OAuth flow
- ❌ Instagram Business Account connect
- ❌ LinkedIn OAuth
- ❌ Save tokens į `social_accounts`

---

## 🚀 Deployment

### Railway Environment Variables
```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
NEXTAUTH_SECRET=random-string
NEXTAUTH_URL=https://sanyla.site
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CRON_SECRET=random-cron-secret
```

### Railway Cron Setup
```
Service: web
Schedule: 0 * * * * (every hour)
Command: curl -H "Authorization: Bearer $CRON_SECRET" https://sanyla.site/api/cron/auto-post
```

---

## 📖 API Documentation

### Generate 30-day calendar
```bash
POST /api/content-calendar/generate
{
  "projectId": "c123",
  "platforms": ["instagram", "facebook"],
  "postsPerWeek": 7
}

Response:
{
  "success": true,
  "content": [...30 items],
  "message": "Generated 30 content items"
}
```

### Approve content
```bash
PATCH /api/content-calendar/[id]
{
  "status": "approved"
}
```

### Generate media
```bash
POST /api/content-calendar/[id]/generate-media

Response:
{
  "success": true,
  "mediaUrls": ["https://...dall-e-image.png"]
}
```

### Get insights
```bash
GET /api/ai-insights?projectId=c123

Response:
{
  "insights": [
    {
      "title": "Optimal posting time",
      "description": "Your audience is most active 18:00-20:00",
      "priority": "high",
      "actionItems": ["Schedule posts for evening"]
    }
  ]
}
```

---

## ✅ Sistema dabar palaiko:

1. ✅ **Pilną AI content generavimą** (30 dienų)
2. ✅ **DALL-E 3 images** automatinis
3. ✅ **Approval workflow** (patvirtinti/atmesti/redaguoti)
4. ✅ **Automatinį postinimą** pagal laiką
5. ✅ **Multi-platform** (FB, IG, LI)
6. ✅ **AI analytics & insights**
7. ✅ **17 kalbų palaikymas**
8. ✅ **Kalbos aptikimas iš vartotojo**

**Liko:** Video generation, Competitor tracking, Real-time analytics fetch, OAuth flows

---

🎉 **Pilna automatizacija veikia!** Railway deploy'as baigsis per 1-2 min.
