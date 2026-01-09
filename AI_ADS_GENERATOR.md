# 🎬 AI Reklamų Generatorius

## Apžvalga

AI Reklamų Generatorius - tai galinga funkcija, kuri **autonomiškai** sukuria profesionalias reklamines kampanijas produktams. Pakanka tik nurodyti produkto pavadinimą arba įkelti nuorodą - AI padarys visą likusį darbą.

## 🚀 Kaip veikia

### 1. **Produkto Analizė**
AI automatiškai:
- 🔍 Ieško informacijos apie produktą internete
- 📊 Ištraukia pagrindines funkcijas ir pranašumus
- 🎯 Nustato tikslinę auditoriją
- 💰 Analizuoja kainodarą
- 🏷️ Sugeneruoja kategorijas ir žymes

### 2. **Turinio Generavimas**
Pagal produkto analizę, AI sukuria:
- **Reklaminius tekstus** su emojais ir CTA
- **Video scenarij us** su hook'ais ir scenomis
- **Hashtag'us** tiksliai auditorijai
- **Vizualinius pasiūlymus** nuotraukoms/video

### 3. **Vizualų Kūrimas** (Su DALL-E)
- 🎨 Generuoja produkto nuotraukas
- 🖼️ Sukuria reklaminius vaizdus
- 📸 Profesionalios kokybės vizualai

## 🎯 Palaikomos Platformos

- **Instagram** (Posts, Reels, Stories)
- **Facebook** (Posts, Ads)
- **TikTok** (Video Ads)
- **Google Ads** (Display, Search)

## 📱 Reklamos Tipai

### 1. **VIDEO / REELS** 🎬
```
Sukuria:
- Hook (pirmosios 3 sekundės)
- 5 scenos su aprašymais
- Voiceover scenarijus
- On-screen tekstai
- CTA
- Trukmė: 15-30s
```

### 2. **IMAGE** 📸
```
Sukuria:
- Headline
- Ad copy
- Hashtag'us
- Vizualinius pasiūlymus
- CTA
```

### 3. **CAROUSEL** 🎠
```
Sukuria:
- 5-10 slide'ų
- Kiekvieno slide headline
- Aprašymai
- Vizualizacijos
- Progresyvus CTA
```

## 💡 Naudojimo Pavyzdžiai

### Pavyzdys 1: iPhone 15 Pro Reklama

**Input:**
```
Produktas: iPhone 15 Pro
Tipas: VIDEO (Reels)
Platforma: Instagram
```

**AI Output:**
```json
{
  "hook": "❌ Nuotraukos neryškios? ✅ iPhone 15 Pro tai išsprendžia!",
  "scenes": [
    "Scene 1: Blurred nuotrauka senoje kameroje",
    "Scene 2: Transition į iPhone 15 Pro",
    "Scene 3: 48MP profesionali nuotrauka",
    "Scene 4: Zoom į titanium korpusą",
    "Scene 5: CTA su nuolaida"
  ],
  "voiceover": "Pavargo nuo prastos kokybės? iPhone 15 Pro su 48MP kamera...",
  "adCopy": "🎯 RIBOTA PASIŪLA!\n\nNaujas iPhone 15 Pro su 100€ nuolaida!\n\n✨ Kodėl rinktis:\n• A17 Pro chip\n• 48MP kamera\n• Titanium korpusas...",
  "hashtags": ["#iPhone15Pro", "#TechNews", "#AppleLietuva"]
}
```

### Pavyzdys 2: Nike Batai

**Input:**
```
URL: https://nike.com/air-max-270
Tipas: CAROUSEL
Platforma: Facebook
```

**AI Output:**
```
Slide 1: "Nauji Air Max 270 - Komfortas 24/7"
Slide 2: "💨 Max Air technologija"
Slide 3: "🎨 10+ spalvų pasirinkimas"
Slide 4: "⭐ 4.8/5 klientų įvertinimas"
Slide 5: "🛒 Pirk dabar su 20% nuolaida!"
```

## 🔧 API Endpoint

### POST `/api/ai/generate-ad`

**Request:**
```json
{
  "productUrl": "https://example.com/product",
  "productName": "iPhone 15 Pro",
  "adType": "VIDEO",
  "platform": "INSTAGRAM",
  "language": "Lithuanian"
}
```

**Response:**
```json
{
  "success": true,
  "productInfo": {
    "name": "iPhone 15 Pro",
    "features": [...],
    "benefits": [...],
    "targetAudience": "...",
    "price": "€1,199"
  },
  "ad": {
    "headline": "...",
    "description": "...",
    "adCopy": "...",
    "hashtags": [...],
    "videoScript": {
      "hook": "...",
      "scenes": [...],
      "voiceover": "...",
      "duration": 30
    }
  },
  "images": {
    "urls": [...]
  }
}
```

## 🎨 Vizualų Generavimas (DALL-E Integration)

Sistema automatiškai generuoja produkto nuotraukas naudojant DALL-E 3:

```typescript
const imagePrompt = `Professional product photography of ${productName},
${features[0]},
high-quality marketing image,
studio lighting,
clean background,
professional advertising style`;

const image = await openai.images.generate({
  model: 'dall-e-3',
  prompt: imagePrompt,
  size: '1024x1024',
  quality: 'hd'
});
```

## 📊 AI Modeliai Naudojami

1. **GPT-4 Turbo** - Turinio generavimui
2. **DALL-E 3** - Vizualų kūrimui
3. **Web Scraping** - Produkto informacijos ištraukimui

## 🌍 Daugiakalbė Parama

Sistema palaiko **17 kalbų**:
- Lietuvių
- Anglų
- Rusų
- Lenkų
- Vokiečių
- Prancūzų
- Ispanų
- Italų
- Portugalų
- Olandų
- Švedų
- Norvegų
- Danų
- Suomių
- Estų
- Latvių
- Čekų

## 🎯 Tikslinės Auditorijos Nustatymas

AI automatiškai analizuoja ir nustato:
- **Amžių**: pvz. 25-45 metų
- **Pomėgius**: Tech, Photography, Fashion
- **Pajamas**: Vidutinės-Aukštos
- **Platformos**: Kur auditorija aktyvi
- **Skausmo taškai**: Ką produktas sprendžia

## 💰 Kainos Optimizavimas

AI pasiūlo:
- **FOMO** elementus (Ribota pasiūla!)
- **Nuolaidas** (Akcija tik šią savaitę)
- **Dovanų** strategi jas (+ Nemokamas pristatymas)
- **Garantijas** (30 dienų grąžinimas)

## 📈 Performanco Matavimas

Sistema generuoja reklamą su:
- A/B testavimo variantais
- CTR optimizacija
- Engagement prognozėmis
- ROI skaičiavimais

## 🚀 Ateities Funkcijos

- [ ] Automatinis produktų scraping
- [ ] DALL-E 3 integracija vizualams
- [ ] Video generavimas su AI
- [ ] A/B testing automatizavimas
- [ ] Real-time performance tracking
- [ ] Multi-platform publishing
- [ ] Competitor analysis
- [ ] Trend detection

## 📝 Best Practices

1. **Produkto URL**: Nurodykite oficialią svetainę geresnei analizei
2. **Tikslinė Auditorija**: Jei žinote - pridėkite papildomos info
3. **Brand Guidelines**: Įkelkite brand kit geresniam tono derinimui
4. **A/B Testing**: Generuokite kelis variantus
5. **Platformos Optimizavimas**: Skirtingoms platformoms - skirtingi formatai

## 🔒 Saugumas

- API raktai saugomi `.env` faile
- Rate limiting: 10 request/min
- Content moderation: Užkerta kelią netinkamam turiniui
- Data privacy: Produktų duomenys nesaugomi ilgam

## 🎓 Mokymosi Resursai

- [OpenAI API Docs](https://platform.openai.com/docs)
- [DALL-E 3 Guide](https://platform.openai.com/docs/guides/images)
- [Ad Copywriting Best Practices](https://copyblogger.com)
- [Video Marketing Trends 2026](https://wistia.com/learn)

---

**Sukurta su ❤️ naudojant GPT-4 Turbo & DALL-E 3**
