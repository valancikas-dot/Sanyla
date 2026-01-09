# Google OAuth Setup for Sanyla

## Kaip gauti Google OAuth Credentials

### 1. Eikite į Google Cloud Console
- Atidarykite: https://console.cloud.google.com/
- Prisijunkite su savo Google paskyra

### 2. Sukurkite naują projektą
- Viršuje kairėje spustelėkite ant projekto pasirinkimo
- Paspauskite "NEW PROJECT"
- Įveskite pavadinimą: `Sanyla`
- Paspauskite "CREATE"

### 3. Įjunkite Google+ API
- Kairiame meniu pasirinkite "APIs & Services" > "Library"
- Ieškokite "Google+ API"
- Paspauskite ant rezultato ir paspauskite "ENABLE"

### 4. Sukurkite OAuth 2.0 Credentials
- Eikite į "APIs & Services" > "Credentials"
- Paspauskite "+ CREATE CREDENTIALS" > "OAuth client ID"

#### Jei matote "Configure Consent Screen":
1. Paspauskite "CONFIGURE CONSENT SCREEN"
2. Pasirinkite "External"
3. Paspauskite "CREATE"
4. Užpildykite formą:
   - **App name**: Sanyla
   - **User support email**: Jūsų el. paštas
   - **Developer contact**: Jūsų el. paštas
5. Paspauskite "SAVE AND CONTINUE"
6. Paspauskite "ADD OR REMOVE SCOPES"
   - Pasirinkite: `./auth/userinfo.email`, `./auth/userinfo.profile`, `openid`
7. Paspauskite "SAVE AND CONTINUE"
8. Test users: Pridėkite savo el. paštą
9. Paspauskite "SAVE AND CONTINUE"

### 5. Sukurkite OAuth Client ID
- Application type: **Web application**
- Name: `Sanyla Web`
- **Authorized JavaScript origins**:
  - `http://localhost:3000`
  - `https://your-production-domain.com` (vėliau)
- **Authorized redirect URIs**:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://your-production-domain.com/api/auth/callback/google` (vėliau)
- Paspauskite "CREATE"

### 6. Nukopijuokite Credentials
- Po sukūrimo pamatysite dialogo langą su:
  - **Client ID**: Prasideda pvz. `123456789.apps.googleusercontent.com`
  - **Client Secret**: Panašus į `GOCSPX-...`
- Nukopijuokite juos į `.env` failą:

```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
```

### 7. Sugeneruokite NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

Įdėkite rezultatą į `.env`:
```bash
NEXTAUTH_SECRET="generated-secret-here"
```

## Production Setup (Railway)

Kai deployinsite į Railway:

1. **Railway Environment Variables**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = `https://your-railway-domain.railway.app`

2. **Google Console**:
   - Grįžkite į Google Cloud Console > Credentials
   - Redaguokite OAuth 2.0 Client ID
   - Pridėkite:
     - Authorized JavaScript origins: `https://your-railway-domain.railway.app`
     - Authorized redirect URIs: `https://your-railway-domain.railway.app/api/auth/callback/google`

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Patikrinkite ar redirect URI Google Console TIKSLIAI atitinka tą, kurį naudojate (įskaitant `http`/`https`)
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Error: "Access blocked: This app's request is invalid"
- Įsitikinkite, kad įjungėte Google+ API
- Patikrinkite OAuth consent screen konfigūraciją

### Email not showing after Google sign-in
- Patikrinkite ar pridėjote scopes: `userinfo.email`, `userinfo.profile`, `openid`
