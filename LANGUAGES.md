# 🌍 Multi-Language Support - 17 Languages

## ✅ Implemented Languages

Sistema palaiko **17 kalbų** content generavimui (kaip Rangis):

| # | Language | Native Name | Code | Flag |
|---|----------|-------------|------|------|
| 1 | **Lithuanian** | Lietuvių | `LITHUANIAN` | 🇱🇹 |
| 2 | **English** | English | `ENGLISH` | 🇬🇧 |
| 3 | **Latvian** | Latviešu | `LATVIAN` | 🇱🇻 |
| 4 | **Estonian** | Eesti | `ESTONIAN` | 🇪🇪 |
| 5 | **Russian** | Русский | `RUSSIAN` | 🇷🇺 |
| 6 | **Polish** | Polski | `POLISH` | 🇵🇱 |
| 7 | **German** | Deutsch | `GERMAN` | 🇩🇪 |
| 8 | **French** | Français | `FRENCH` | 🇫🇷 |
| 9 | **Spanish** | Español | `SPANISH` | 🇪🇸 |
| 10 | **Italian** | Italiano | `ITALIAN` | 🇮🇹 |
| 11 | **Portuguese** | Português | `PORTUGUESE` | 🇵🇹 |
| 12 | **Dutch** | Nederlands | `DUTCH` | 🇳🇱 |
| 13 | **Swedish** | Svenska | `SWEDISH` | 🇸🇪 |
| 14 | **Norwegian** | Norsk | `NORWEGIAN` | 🇳🇴 |
| 15 | **Danish** | Dansk | `DANISH` | 🇩🇰 |
| 16 | **Finnish** | Suomi | `FINNISH` | 🇫🇮 |
| 17 | **Czech** | Čeština | `CZECH` | 🇨🇿 |

---

## 🎯 How It Works

### 1. User Selects Language (Project Creation)

```typescript
// Frontend: apps/web/src/app/org/[orgId]/projects/new/page.tsx

<select value={formData.language}>
  <option value="LITHUANIAN">Lietuvių</option>
  <option value="ENGLISH">English</option>
  <option value="LATVIAN">Latviešu</option>
  <option value="ESTONIAN">Eesti</option>
  <option value="RUSSIAN">Русский</option>
  <option value="POLISH">Polski</option>
  <option value="GERMAN">Deutsch</option>
  <option value="FRENCH">Français</option>
  <option value="SPANISH">Español</option>
  <option value="ITALIAN">Italiano</option>
  <option value="PORTUGUESE">Português</option>
  <option value="DUTCH">Nederlands</option>
  <option value="SWEDISH">Svenska</option>
  <option value="NORWEGIAN">Norsk</option>
  <option value="DANISH">Dansk</option>
  <option value="FINNISH">Suomi</option>
  <option value="CZECH">Čeština</option>
</select>
```

### 2. Language Stored in Database

```prisma
// prisma/schema.prisma

model Project {
  id       String @id @default(cuid())
  name     String
  language String @default("ENGLISH")  // ← Selected language
  // ... other fields
}
```

### 3. AI Generates Content in Selected Language

```typescript
// Backend: apps/api/src/ai/ai.service.ts

const prompt = `
You are an expert marketing strategist.
Content Language: ${languageName}  // e.g., "Lithuanian (Lietuvių kalba)"

CRITICAL REQUIREMENTS:
- ALL content MUST be written in ${languageName}
- Use native language expressions and idioms
`;

// GPT-4 generates:
// - Strategy in Lithuanian ✅
// - Posts in Lithuanian ✅
// - Reels scripts in Lithuanian ✅
// - etc.
```

---

## 📋 Language Support by Feature

| Feature | Multi-Language | Notes |
|---------|----------------|-------|
| **30-day Strategy** | ✅ All 17 languages | Full strategy in selected language |
| **Content Calendar** | ✅ All 17 languages | Daily topics in native language |
| **20 Posts Pack** | ✅ All 17 languages | Captions + hashtags localized |
| **8 Reels Scripts** | ✅ All 17 languages | Hooks, voiceover, text in native language |
| **Weekly Insights** | ✅ All 17 languages | Analysis in selected language |
| **UI Labels** | ❌ English only (MVP) | Future: i18n support |
| **Error Messages** | ❌ English only | Future: translation |

---

## 🌐 Language Selection UI

### Project Creation Page

<img src="language-selector.png" alt="Language dropdown showing all 17 languages">

Users see:
```
Content Language
[Lietuvių ▼]  ← Dropdown with 17 options

ℹ️ AI will generate content in this language
```

### Brand Kit Settings Page

Users can change language later:
```
Brand Kit → Content Language → Select new language
```

All future AI generations will use the new language.

---

## 💡 Examples

### Lithuanian Example
```json
{
  "projectName": "Vilniaus Kavos Namai",
  "language": "LITHUANIAN",
  "generated_post": {
    "caption": "☕ Rytinis kavos ritualas – tai daugiau nei tik gėrimas. Tai akimirka sau, ramybė prieš dieną, aromatas, kuris žadina pojūčius. 🌅\n\nAplankykite mus šį rytą ir atraskite savo tobulą kavą! 💛",
    "hashtags": ["#VilniausKava", "#KavosMėgėjai", "#RytinėKava"],
    "platform": "META"
  }
}
```

### Russian Example
```json
{
  "projectName": "Московская Пекарня",
  "language": "RUSSIAN",
  "generated_post": {
    "caption": "🥐 Свежая выпечка каждое утро! Наши круассаны готовятся с любовью и настоящим французским маслом.\n\nЗаходите к нам на завтрак – начните день правильно! ☀️",
    "hashtags": ["#СвежаяВыпечка", "#МосковскаяПекарня", "#Круассаны"],
    "platform": "META"
  }
}
```

### German Example
```json
{
  "projectName": "Berliner Bäckerei",
  "language": "GERMAN",
  "generated_post": {
    "caption": "🥨 Frische Backwaren jeden Morgen! Unsere Brezel werden nach traditionellem Rezept hergestellt.\n\nBesuchen Sie uns zum Frühstück – starten Sie richtig in den Tag! ☕",
    "hashtags": ["#BerlinerBäckerei", "#FrischeBackwaren", "#Brezel"],
    "platform": "META"
  }
}
```

---

## 🔧 Technical Implementation

### Constants Definition

```typescript
// packages/shared/src/constants.ts

export const LANGUAGES = [
  'LITHUANIAN', 'ENGLISH', 'LATVIAN', 'ESTONIAN',
  'RUSSIAN', 'POLISH', 'GERMAN', 'FRENCH',
  'SPANISH', 'ITALIAN', 'PORTUGUESE', 'DUTCH',
  'SWEDISH', 'NORWEGIAN', 'DANISH', 'FINNISH', 'CZECH'
] as const;

export type Language = typeof LANGUAGES[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  LITHUANIAN: 'Lietuvių',
  ENGLISH: 'English',
  LATVIAN: 'Latviešu',
  // ... etc
};
```

### Schema Validation

```typescript
// packages/shared/src/schemas.ts

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  language: z.enum(LANGUAGES).default('ENGLISH'),  // ← Validates language
  // ... other fields
});
```

### AI Prompt Engineering

```typescript
// apps/api/src/ai/ai.service.ts

const languageMap: Record<string, string> = {
  LITHUANIAN: 'Lithuanian (Lietuvių kalba)',
  ENGLISH: 'English',
  LATVIAN: 'Latvian (Latviešu valoda)',
  // ... full map
};

const prompt = `
Content Language: ${languageMap[project.language]}

CRITICAL REQUIREMENTS:
- ALL content MUST be written in ${languageMap[project.language]}
- Use native language expressions and idioms
`;
```

---

## 📊 Language Coverage

### Baltic Region (Focus Market)
- ✅ Lithuanian 🇱🇹
- ✅ Latvian 🇱🇻
- ✅ Estonian 🇪🇪
- ✅ Russian 🇷🇺 (widely spoken)
- ✅ Polish 🇵🇱 (large diaspora)

### Western Europe
- ✅ English 🇬🇧
- ✅ German 🇩🇪
- ✅ French 🇫🇷
- ✅ Spanish 🇪🇸
- ✅ Italian 🇮🇹
- ✅ Portuguese 🇵🇹
- ✅ Dutch 🇳🇱

### Nordic Countries
- ✅ Swedish 🇸🇪
- ✅ Norwegian 🇳🇴
- ✅ Danish 🇩🇰
- ✅ Finnish 🇫🇮

### Central Europe
- ✅ Czech 🇨🇿

---

## 🚀 Future Enhancements

### Phase 2: Additional Languages
- [ ] Ukrainian 🇺🇦
- [ ] Romanian 🇷🇴
- [ ] Bulgarian 🇧🇬
- [ ] Hungarian 🇭🇺
- [ ] Greek 🇬🇷
- [ ] Turkish 🇹🇷

### Phase 3: Asian Languages
- [ ] Chinese (Simplified) 🇨🇳
- [ ] Japanese 🇯🇵
- [ ] Korean 🇰🇷

### Phase 4: RTL Languages
- [ ] Arabic 🇸🇦
- [ ] Hebrew 🇮🇱

### UI Translation (i18n)
- [ ] next-intl integration
- [ ] UI in all 17 languages
- [ ] Language selector in navbar
- [ ] Auto-detect browser language

---

## 🎯 Benefits

### For Users
- ✅ Generate content in their native language
- ✅ Authentic local expressions
- ✅ Better engagement with local audience
- ✅ No need for manual translation

### For Business
- ✅ Serve 17 European markets
- ✅ Competitive advantage vs. English-only tools
- ✅ Higher conversion in non-English markets
- ✅ Match Rangis feature parity

---

## 📝 Usage Instructions

1. **Create Project:**
   - Go to "Create New Project"
   - Select "Content Language" from dropdown
   - Choose from 17 languages

2. **Generate Content:**
   - Click "Generate Strategy" (or Posts, Reels, etc.)
   - AI automatically uses selected language
   - All content will be in that language

3. **Change Language:**
   - Go to "Brand Kit" page
   - Update "Content Language"
   - Future generations use new language

4. **Verify Language:**
   - Check generated content
   - All text should be in selected language
   - Hashtags, CTAs, everything localized

---

## 🧪 Testing

Test with different languages:

```bash
# Create project in Lithuanian
POST /orgs/xxx/projects
{
  "name": "Mano Kavine",
  "language": "LITHUANIAN"
}

# Generate strategy
POST /projects/xxx/ai/strategy
# → Should return strategy in Lithuanian

# Change to German
PATCH /projects/xxx
{
  "language": "GERMAN"
}

# Generate posts
POST /projects/xxx/ai/posts
# → Should return 20 posts in German
```

---

## 💬 Support

All 17 languages are production-ready! 🚀

**Default:** English  
**Most Used (Baltic):** Lithuanian, Latvian, Estonian, Russian  
**Popular EU:** German, French, Spanish  
**Quality:** GPT-4 is fluent in all 17 languages ✅
