# Custom Domain Setup: sanyla.site → Railway

## Railway konfigūracija

### 1. Atidarykite Railway Dashboard
- https://railway.app/
- Pasirinkite **Sanyla** projektą
- Pasirinkite **web** service

### 2. Settings → Networking
- Scroll žemyn iki **Custom Domain**
- Paspauskite **+ Custom Domain**
- Įveskite: `sanyla.site`
- Paspauskite **Add Domain**

### 3. Railway parodys DNS records:
```
Type: CNAME
Name: @
Value: sanyla-production.up.railway.app
```

ARBA (jei CNAME neveikia root domain):

```
Type: A
Name: @
Value: XXX.XXX.XXX.XXX (Railway IP)
```

IR

```
Type: CNAME
Name: www
Value: sanyla-production.up.railway.app
```

## Domain Registrar konfigūracija (kur pirkote sanyla.site)

### Namecheap / GoDaddy / Hostinger / kt.

1. **Prisijunkite** prie domain registrar
2. **Domains** → **sanyla.site** → **Manage** → **Advanced DNS** / **DNS Settings**

### 3. Pridėkite DNS Records:

#### Variantas A (CNAME - paprasčiausias):
```
Type: CNAME Record
Host: @
Value: sanyla-production.up.railway.app
TTL: Automatic (arba 3600)
```

```
Type: CNAME Record
Host: www
Value: sanyla-production.up.railway.app
TTL: Automatic (arba 3600)
```

#### Variantas B (jei @ CNAME neveikia):

**Pašalinkite** senus A/CNAME records su `@` ir pridėkite:

```
Type: A Record
Host: @
Value: (Railway duos IP adresą)
TTL: Automatic
```

```
Type: CNAME Record
Host: www
Value: sanyla-production.up.railway.app
TTL: Automatic
```

### 4. **SVARBU**: Pašalinkite URL Redirect
Jei matote "URL Redirect" arba "Forwarding" - **IŠTRINKITE** juos!

## Patikrinimas

### DNS Propagation (gali užtrukti 5min - 48h)

Patikrinkite:
```bash
# Terminal
nslookup sanyla.site
```

Turėtumėte matyti:
```
Non-authoritative answer:
Name: sanyla.site
Address: XXX.XXX.XXX.XXX
```

Arba:
```bash
dig sanyla.site
```

### Online tools:
- https://dnschecker.org/
- Įveskite: `sanyla.site`
- Turėtumėte matyti Railway IP

## SSL Certificate

Railway **automatiškai** sukurs SSL certificate (Let's Encrypt).

Po ~5-10 minučių galėsite pasiekti:
- ✅ https://sanyla.site
- ✅ https://www.sanyla.site

## Google OAuth Update

Nepamirškite atnaujinti Google Cloud Console:

### Authorized JavaScript origins:
```
https://sanyla.site
```

### Authorized redirect URIs:
```
https://sanyla.site/api/auth/callback/google
```

## Railway Environment Variables

Atnaujinkite:
```
NEXTAUTH_URL=https://sanyla.site
```

## Troubleshooting

### Domain nerodo į Railway po 24h?

1. **Patikrinkite DNS**:
   ```bash
   nslookup sanyla.site
   ```

2. **Patikrinkite Railway**:
   - Settings → Networking → Custom Domain
   - Turėtų būti žalias ✅ šalia `sanyla.site`

3. **Pašalinkite proxy/CDN** (jei naudojate Cloudflare):
   - Cloudflare → DNS → Išjunkite "Proxied" (oranžinis debesis)
   - Palikite "DNS only" (pilkas debesis)

### SSL Error?

- Palaukite 10-15 minučių
- Railway automatiškai generuoja SSL
- Jei neveikia po 30min - susisiekite su Railway support

## Galutinis rezultatas

Po sėkmingo setup:

✅ https://sanyla.site → veikia
✅ https://www.sanyla.site → veikia
✅ SSL certificate → aktyvus
✅ Google OAuth → veikia
✅ Railway deployment → aktyvus

---

**Kur pirkote domeną?** (Namecheap/GoDaddy/Hostinger/kitas?)
Galiu duoti tikslesnes instrukcijas!
