# Railway Automated Posting Setup

## Kaip sukonfigūruoti automatinį postinimą Railway platformoje

### 1. Pridėti Cron Service

1. Eik į Railway projektą: https://railway.app/project/sanyla
2. Spausk **"+ New Service"**
3. Pasirink **"Empty Service"**
4. Pavadink: `auto-posting-cron`

### 2. Sukonfigūruoti Cron Schedule

1. Pasirinktame cron service spausk **"Settings"**
2. Pasirink **"Cron Schedule"** tab
3. Įveskite cron expression:
   ```
   */15 * * * *
   ```
   (Tai reikš: kas 15 minučių)

4. Arba naudokite kitą intervalą:
   - `*/5 * * * *` - kas 5 minutes
   - `*/30 * * * *` - kas 30 minučių
   - `0 * * * *` - kas valandą
   - `0 */3 * * *` - kas 3 valandas

### 3. Pridėti Environment Variables

1. Cron service eikite į **"Variables"**
2. Pridėkite šias variables:

```
CRON_SECRET=jūsų-labai-saugus-raktas-12345
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@tramway.proxy.rlwy.net:59033/railway
NEXTAUTH_URL=https://sanyla.site
OPENAI_API_KEY=sk-proj-YOUR-OPENAI-KEY-HERE
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

**SVARBU**: Sukurkite naują `CRON_SECRET` - tai apsaugos endpoint nuo neleistino prieigos.

### 4. Sukonfigūruoti Command

1. Cron service eikite į **"Settings"** → **"Deploy"**
2. Build Command: *palikti tuščią*
3. Start Command:
   ```bash
   curl -X POST https://sanyla.site/api/cron/auto-post \
     -H "Authorization: Bearer ${CRON_SECRET}" \
     -H "Content-Type: application/json"
   ```

### 5. Alternatyvus būdas: Naudoti išorinį Cron

Jei Railway cron neveikia, galite naudoti **cron-job.org** arba **EasyCron**:

1. Eikite į https://cron-job.org
2. Sukurkite nemokamą paskyrą
3. Pridėkite naują Cron Job:
   - URL: `https://sanyla.site/api/cron/auto-post`
   - Method: `POST`
   - Headers:
     ```
     Authorization: Bearer jūsų-CRON_SECRET
     Content-Type: application/json
     ```
   - Schedule: Kas 15 minučių

### 6. Prisidėti CRON_SECRET į Web Service

1. Eikite į Railway web service (ne cron service)
2. Pridėkite variable:
   ```
   CRON_SECRET=toks-pats-raktas-kaip-cron-service
   ```

### 7. Testuoti Cron

1. Paleiskite cron job rankiniu būdu:
   ```bash
   curl -X POST https://sanyla.site/api/cron/auto-post \
     -H "Authorization: Bearer jūsų-CRON_SECRET" \
     -H "Content-Type: application/json"
   ```

2. Patikrinkite logs:
   - Railway console → Cron service → Logs
   - Turėtų matyti: "Auto-post job completed. Posted: X items"

### 8. Kaip veikia sistema

1. **Vartotojas generuoja turinį**: 
   - Eina į `/dashboard/projects/[id]/calendar`
   - Spaudžia "Generuoti 30 dienų turinį"
   - Sistema sukuria 30 įrašų su datais ir laikomis

2. **Vartotojas peržiūri ir patvirtina**:
   - Mato visus sugeneruotus įrašus
   - Gali redaguoti tekstą
   - Spaudžia ✅ "Patvirtinti" arba ❌ "Atmesti"

3. **Automatinis postinimas**:
   - Cron job kas 15 min tikrina `content_calendar` lentelę
   - Ieško įrašų su `status = 'approved'` ir `scheduled_date <= NOW()`
   - Postina į socialines paskyras (Facebook, Instagram, LinkedIn)
   - Pakeičia status į `'posted'`

### Troubleshooting

**Problema**: Cron neveikia
- Patikrinkite ar CRON_SECRET teisingas
- Patikrinkite Railway logs
- Testuokite endpoint rankiniu curl

**Problema**: Posts neskelbiami
- Patikrinkite ar social accounts prijungtos
- Patikrinkite ar turinys patvirtintas (`status = 'approved'`)
- Patikrinkite ar `scheduled_date` yra praeity

**Problema**: Facebook/Instagram errors
- Patikrinkite ar access_token galioja
- Patikrinkite ar turite reikalingas permissions
- Instagram reikalauja Facebook Business paskyros

## Papildomos funkcijos

### Video/Reels generavimas

Šiuo metu sistema palaiko tekstą ir nuotraukas. Video generavimui reikia:

1. Integruoti AI video service (pvz. Runway, Synthesia, D-ID)
2. Pridėti `media_type = 'video'` palaikymą
3. Naudoti Instagram Reels API

### Konkurentų analizė

Sistema turi `competitor_analysis` lentelę. Galite pridėti:

1. Web scraping konkurentų puslapių
2. Social media analytics
3. AI palyginimą su savo turiniu

### Advanced Analytics

`content_analytics` lentelė renka:
- Impressions (peržiūros)
- Engagement rate (įsitraukimas)
- Likes, shares, comments
- Click-through rates

Galite sukurti:
- Performance dashboard
- A/B testing
- Best posting times analysis
