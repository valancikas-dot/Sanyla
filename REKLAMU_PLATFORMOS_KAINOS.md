# 💰 Reklamų Platformų Veikimas ir Kaštai

## Facebook & Instagram Reklamos

### **2 Būdai Publikuoti:**

#### **1️⃣ NEMOKAMAS - Organic Posts (Paprastas Postinimas)**

**Kaip veikia:**
```
Sistema postina į:
- Facebook Business puslapį (ne asmeninį profilį)
- Instagram Business paskyrą

Tai NEMOKAMA, bet:
❌ Mažas reach (5-10% sekėjų)
❌ Nėra targeting'o
❌ Lėtas augimas
✅ Nemokama
✅ Gerai organic auditorijai
```

**API Endpoint:**
```typescript
// Organic Facebook post
POST https://graph.facebook.com/v18.0/{page-id}/feed
{
  "message": "Jūsų AI sugeneruotas tekstas...",
  "link": "https://yourwebsite.com",
  "access_token": "{token}"
}

// Organic Instagram post
POST https://graph.facebook.com/v18.0/{ig-account}/media
{
  "image_url": "https://...",
  "caption": "AI tekstas su #hashtags",
  "access_token": "{token}"
}
```

**Kur postina:**
- ✅ Jūsų Facebook **Business puslapis** (ne asmeninis)
- ✅ Jūsų Instagram **Business paskyra**
- ✅ Matys tik jūsų sekėjai + jų draugai (jei dalinas)

---

#### **2️⃣ MOKAMA - Facebook/Instagram Ads (Tikros Reklamos)**

**Kaip veikia:**
```
Sistema kuria:
- Ad Campaign
- Ad Set (targeting, budget)
- Ad Creative (AI sugeneruotas turinys)

Tai MOKAMA, bet:
✅ Didžiulis reach (tūkstančiai žmonių)
✅ Precizus targeting (amžius, pomėgiai, lokacija)
✅ Greitas augimas
❌ Mokama (€1-50+ per dieną)
```

**Meta Ads Manager API:**
```typescript
// Create Campaign
POST https://graph.facebook.com/v18.0/act_{ad-account-id}/campaigns
{
  "name": "iPhone 15 Pro Launch Campaign",
  "objective": "OUTCOME_SALES",
  "status": "PAUSED"
}

// Create Ad Set (Targeting + Budget)
POST https://graph.facebook.com/v18.0/act_{ad-account-id}/adsets
{
  "name": "Tech Enthusiasts 25-45",
  "campaign_id": "{campaign-id}",
  "daily_budget": 2000, // €20 per day
  "targeting": {
    "geo_locations": { "countries": ["LT"] },
    "age_min": 25,
    "age_max": 45,
    "interests": [
      { "id": "6003139266461", "name": "Technology" }
    ]
  }
}
```

**Kaštai:**
- **Minimum:** €1 per dieną
- **Rekomenduojama:** €10-20 per dieną
- **Reach:** ~1000-5000 žmonių per dieną su €10

---

## Google Ads

### **VISADA MOKAMA**

Google Ads **neturi** nemokamo varianto. Tai tik mokama reklama.

**Kaip veikia:**
```
Mokėjimas:
- PPC (Pay Per Click) - moki tik kai kas paspaudžia
- Display - moki už 1000 impressions
- Video - moki už view
```

### **Google Ads Tipai:**

#### **1. Search Ads (Paieškos Reklamos)**
```
Vartotojas google ieško: "pirkt iphone 15 pro"
→ Rodo jūsų reklamą virš rezultatų
→ Mokate tik kai paspaudžia

Kaštai: €0.50 - €5.00 per click
```

#### **2. Display Ads (Banner Reklamos)**
```
Rodo jūsų banner'ius milijonuose svetainių

Kaštai: €1-5 per 1000 impressions
```

#### **3. YouTube Video Ads**
```
Rodo jūsų video prieš/vidury YouTube video

Kaštai: €0.10 - €0.30 per view
```

---

## TikTok

### **2 Būdai:**

#### **NEMOKAMAS - Organic Posts**
```
AI postina video į jūsų TikTok paskyrą
- Mato tik sekėjai + "For You" algoritmas
- Gali tapti viral (milijonai view) - NEMOKAMAI
- Bet nėra garantijos

TikTok algoritmas labai galingas!
Geras content gali gauti milijonus views 100% nemokamai
```

#### **MOKAMA - TikTok Ads**
```
Targeted ads

Kaštai: €10+ per dieną
```

---

## 📊 Sanyla Sistema - Kaip Veiks

### **Sanyla palaikys 2 režimus:**

#### **1️⃣ FREE TIER - Organic Posting (NEMOKAMA)**

**Kur postina:**
- ✅ Facebook **Business puslapis** (ne asmeninis)
- ✅ Instagram **Business paskyra**
- ✅ TikTok **paskyra**
- ✅ LinkedIn **Company Page**

**Apribojimai:**
- Mato tik jūsų sekėjai
- Mažas reach (5-10% sekėjų Facebook)
- Nėra targeting
- Nemokama!

---

#### **2️⃣ PRO TIER - Paid Advertising (MOKAMA)**

**Targeting galimybės:**
```typescript
const targeting = {
  demographics: {
    age: [25, 45],
    gender: 'ALL',
    location: ['Lithuania', 'Latvia', 'Estonia']
  },
  interests: [
    'Technology',
    'Smartphones', 
    'Photography'
  ],
  behaviors: [
    'Online shoppers',
    'Tech early adopters'
  ]
};
```

---

## 🎯 Kaip Sistema Veiks

### **Scenario 1: Nemokamas Variantas**
```
1. Vartotojas generuoja iPhone 15 Pro reklamą
2. Pasirenka "Publikuoti Organic"
3. Pasirenka Instagram + Facebook
4. Sistema postina:
   - Instagram: Reel į @jusu_verslas
   - Facebook: Post į "Jūsų Verslas" puslapį
5. Mato: Jūsų 5,000 sekėjų + draugai
6. Kainavo: €0

Reach: ~500-1,000 žmonių (organic)
```

### **Scenario 2: Mokamas Variantas**
```
1. Vartotojas generuoja iPhone 15 Pro reklamą
2. Pasirenka "Run Ads"
3. Nustato:
   - Budget: €20/day
   - Duration: 7 days
   - Targeting: LT, 25-45, Tech interests
4. Sistema kuria Meta Ads kampaniją
5. Rodo reklamą targeted žmonėms
6. Kainavo: €140 (€20 × 7 days) → Meta

Reach: ~10,000-20,000 žmonių (paid)
```

### **Scenario 3: Google Ads**
```
1. Vartotojas generuoja reklamą
2. Pasirenka "Google Search Ads"
3. Nustato:
   - Budget: €10/day
   - Keywords: "pirkt iphone 15 pro"
   - Max CPC: €2
4. Sistema kuria Google Ads kampaniją
5. Rodo reklamą kai kas google ieško
6. Moka tik kai paspaudžia (~5 clicks/day)
7. Kainavo: €70 (7 days) → Google

Clicks: ~35 clicks per savaitę
```

---

## 🔑 Raktiniai Skirtumai

| Platforma | Nemokama? | Reach | Targeting | Rekomenduojama |
|-----------|-----------|-------|-----------|----------------|
| **Instagram Organic** | ✅ Taip | Mažas | ❌ Ne | Turinio kūrimui |
| **Facebook Page Post** | ✅ Taip | Labai mažas | ❌ Ne | Community building |
| **TikTok Organic** | ✅ Taip | **Viral potencialas!** | ❌ Ne | **Geriausias organic** |
| **Meta Ads** | ❌ €1+/day | Didžiulis | ✅ Taip | Pardavimams |
| **Google Ads** | ❌ €1+/day | Labai didelis | ✅ Taip | Paieškos intent |

---

## 💰 Rekomendacija Sanyla Vartotojams

### **Pradedantiems:**
```
1. Naudok ORGANIC postingą (nemokama)
   - Auginkit sekėjus
   - Testuokit turinį
   - Matykite kas veikia

2. Kai gavot 1000+ sekėjų:
   - Pradėk Meta Ads (€10/day)
   - Targetink lookalike audience

3. Kai pardavinėjat:
   - Google Search Ads (€20/day)
   - Tik high-intent keywords
```

---

**TL;DR:**
- Facebook/Instagram/TikTok: **Organic = NEMOKAMA** (postina į jūsų business paskyrą, mato sekėjai)
- Facebook/Instagram Ads: **Mokama** (€1-50+/day) → didžiulis reach su targeting
- Google Ads: **VISADA mokama** (€1-100+/day) → high intent paieška
- **Sanyla postins nemokamai į jūsų business paskyras (FREE), ARBA leis paleisti paid ads su jūsų budget'u (PRO)**
