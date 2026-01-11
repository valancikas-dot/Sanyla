# ⚡ 5 Minučių Railway Setup

Greitas vadovas kaip baigti Sanyla platformos konfigūraciją Railway.

## ✅ Kas jau padaryta

- ✅ Code deployed į GitHub
- ✅ Railway web service running
- ✅ PostgreSQL database sukurta ir migrated
- ✅ Visas kodas parašytas ir tested

## 🔧 Kas lieka (5 minutės)

### 1️⃣ Facebook Developer App (2 min)

**Kodėl reikia?** Facebook/Instagram postinimui reikalingas OAuth.

1. Eiti: https://developers.facebook.com/apps/
2. Spausk **"Create App"**
3. Pasirink **"Business"** → Next
4. App name: `Sanyla Marketing`
5. App contact email: tavo email
6. Click **"Create App"**

#### Setup Facebook Login:
1. Dashboard → Add Product → **Facebook Login** → Set Up
2. Settings → Facebook Login → Settings
3. Valid OAuth Redirect URIs: 
   ```
   https://sanyla.site/api/social-accounts/oauth/callback
   ```
4. Save Changes

#### Setup Instagram:
1. Dashboard → Add Product → **Instagram** → Set Up
2. Basic Display → Save

#### Get Credentials:
1. Settings → Basic
2. Copy **App ID** (bus `FACEBOOK_APP_ID`)
3. Show **App Secret** → Copy (bus `FACEBOOK_APP_SECRET`)

#### Make Live:
1. App Mode viršuje: **Development** → Switch to **Live**

---

### 2️⃣ LinkedIn Developer App (2 min)

**Kodėl reikia?** LinkedIn postinimui.

1. Eiti: https://www.linkedin.com/developers/apps/
2. Click **"Create app"**
3. Užpildyk:
   - App name: `Sanyla Marketing`
   - LinkedIn Page: Pasirink savo company page (arba sukurk naują)
   - Privacy policy URL: `https://sanyla.site/privacy`
   - App logo: Upload bet kokį logo
4. Create app

#### Request Access:
1. Products tab → **Share on LinkedIn** → Request access
2. Products tab → **Sign In with LinkedIn** → Request access

#### Setup OAuth:
1. Auth tab
2. Redirect URLs: 
   ```
   https://sanyla.site/api/social-accounts/oauth/callback
   ```
3. Update

#### Get Credentials:
1. Auth tab
2. Copy **Client ID** (bus `LINKEDIN_CLIENT_ID`)
3. Copy **Client Secret** (bus `LINKEDIN_CLIENT_SECRET`)

---

### 3️⃣ Railway Variables Update (1 min)

1. Eiti: https://railway.app/project/sanyla
2. Pasirink **Web Service**
3. Variables tab
4. Pridėk/Update šias variables:

```bash
# Jau turėtų būti (patikrink):
DATABASE_URL=postgresql://postgres:GLWTpqYFuqRniFyOQLGuldveOgtUWjbJ@tramway.proxy.rlwy.net:59033/railway
NEXTAUTH_SECRET=... (jau turėtum)
NEXTAUTH_URL=https://sanyla.site
GOOGLE_CLIENT_ID=... (jau turėtum)
GOOGLE_CLIENT_SECRET=... (jau turėtum)
OPENAI_API_KEY=... (jau turėtum)

# NAUJOS (įdėk iš Facebook/LinkedIn):
FACEBOOK_APP_ID=tavo-facebook-app-id
FACEBOOK_APP_SECRET=tavo-facebook-app-secret
LINKEDIN_CLIENT_ID=tavo-linkedin-client-id
LINKEDIN_CLIENT_SECRET=tavo-linkedin-client-secret

# CRON SECRET (sugeneruok random string):
CRON_SECRET=VerySecureRandomString123!@#
```

**Generate CRON_SECRET:**
```bash
# Naudok šitą komandą:
openssl rand -base64 32

# Arba bet kokį random string (pvz.):
sanyla_cron_secret_2026_secure_key_XYZ123
```

5. Spausk **"Add"** kiekvienai variable
6. Railway **automatically redeploy** (~1-2 min)

---

### 4️⃣ Setup Automated Posting (OPTIONAL bet rekomenduojama)

**Du variantai:**

#### Variantas A: Cron-job.org (paprasčiau, 1 min) ⭐

1. Eiti: https://cron-job.org
2. Sign Up (free)
3. Create Cron Job:
   - Title: `Sanyla Auto Post`
   - URL: `https://sanyla.site/api/cron/auto-post`
   - Schedule: `Every 15 minutes`
   - Request Method: `POST`
   - Request Headers:
     ```
     Authorization: Bearer tavo-CRON_SECRET
     Content-Type: application/json
     ```
4. Enable → Save

**Done! ✅ Sistema automatiškai postins kas 15 min.**

#### Variantas B: Railway Cron Service (sudėtingiau)

Žr. `RAILWAY-CRON-SETUP.md` pilnai instrukcijai.

---

## 🧪 Testuoti sistemą

### 1. Patikrinti ar veikia:

```bash
# Test cron endpoint (pakeisk CRON_SECRET):
curl -X POST https://sanyla.site/api/cron/auto-post \
  -H "Authorization: Bearer tavo-CRON_SECRET" \
  -H "Content-Type: application/json"

# Turėtum gauti:
{"message":"Auto-post job completed. Posted: 0 items"}
```

### 2. Pilnas workflow testas:

1. **Prisijungti**: https://sanyla.site
2. **Sukurti projektą**: 
   - Dashboard → "Sukurti naują projektą"
   - Užpildyk informaciją
3. **Prijungti Facebook**:
   - Project → "Socialiniai tinklai"
   - "Prijungti Facebook"
   - Autorizuok Facebook app
4. **Generuoti turinį**:
   - Project → "30 dienų turinys"
   - "Generuoti 30 dienų turinį"
   - Palaukti ~30 sek (AI generuoja)
5. **Patvirtinti post**:
   - Pasirink vieną įrašą
   - Spausk ✅ "Patvirtinti"
   - Optionally: "Generuoti paveikslėlį"
6. **Laukti auto-post**:
   - Jei cron setup, sistema automatiškai postins per 15 min
   - Arba test rankiniu:
     ```bash
     curl -X POST https://sanyla.site/api/cron/auto-post \
       -H "Authorization: Bearer tavo-CRON_SECRET"
     ```

### 3. Tikrinti Facebook:

- Eik į savo Facebook page
- Turėtum matyti naują post!

---

## 🐛 Troubleshooting

### "OAuth redirect_uri mismatch"
- Facebook/LinkedIn Redirect URI turi būti **exactly**: `https://sanyla.site/api/social-accounts/oauth/callback`
- Patikrink typos

### "Invalid credentials"
- Railway variables turi būti **exact** App ID/Secret
- Re-deploy jei keitei variables

### "Cron not working"
- Patikrink CRON_SECRET matches tarp Railway ir cron-job.org
- Test su curl (žr. aukščiau)

### "Posts not appearing"
- Facebook: Patikrink ar turite Facebook **Page** (ne profile)
- LinkedIn: Patikrink ar approved "Share on LinkedIn" product
- Check Railway logs: Web Service → Deployments → Logs

### "Database connection failed"
- Railway → Database → Connection → Copy PUBLIC URL
- Update `DATABASE_URL` in Web Service variables

---

## ✅ Checklist

- [ ] Facebook App sukurtas ir Live
- [ ] LinkedIn App sukurtas
- [ ] Railway variables updated (FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, CRON_SECRET)
- [ ] Railway redeploy baigtas
- [ ] Cron-job.org arba Railway Cron setup
- [ ] Tested: Prisijungimas veikia
- [ ] Tested: Projektą galiu sukurti
- [ ] Tested: Facebook/LinkedIn OAuth veikia
- [ ] Tested: AI generavimas veikia
- [ ] Tested: Auto-posting veikia

---

## 🎉 Viskas!

Jei viskas ✅, turite:
- **Pilną AI marketing automation platformą**
- **30 dienų automatinį turinį**
- **Automatinį postinimą į Facebook/Instagram/LinkedIn**
- **AI insights ir analytics**
- **17 kalbų palaikymą**

**Platform live: https://sanyla.site** 🚀

---

Klausimai? Žr. `COMPLETION-STATUS.md` ir `RAILWAY-CRON-SETUP.md`
