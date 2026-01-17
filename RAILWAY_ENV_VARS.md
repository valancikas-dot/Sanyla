# 🚂 Railway Environment Variables

Pridėk šiuos variables į Railway Dashboard → Your Project → Variables:

---

## 📱 Facebook/Instagram Integration

```bash
FACEBOOK_APP_ID=962270328202164337
FACEBOOK_APP_SECRET=7f01f48706b543560b7de37536d6c80dc
```

---

## 💳 Stripe Payment (jau turim local, reikia į Railway)

```bash
# Stripe API Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[GAUTI_IŠ_STRIPE_DASHBOARD]
STRIPE_SECRET_KEY=sk_test_[GAUTI_IŠ_STRIPE_DASHBOARD]

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_1SqcuVRzm2KtI9OITrMxmHQF
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_1SqcuVRzm2KtI9OILsGmuVSU
NEXT_PUBLIC_STRIPE_PRICE_POWER=price_1SqcuVRzm2KtI9OIt0jxsUdT

# Stripe Webhook (pridėsi po webhook setup)
STRIPE_WEBHOOK_SECRET=whsec_[GAUSITE_VĖLIAU]
```

---

## 🤖 OpenAI (jau turėtum)

```bash
OPENAI_API_KEY=sk-proj-[TAVO_OPENAI_KEY]
```

---

## 🔐 NextAuth (jau turėtum)

```bash
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
NEXTAUTH_URL=https://sanyla.site
```

---

## 👨‍💼 Admin Email

```bash
ADMIN_EMAIL_ALLOWLIST=valancikas@gmail.com
```

---

## 📊 Database (jau turėtum)

```bash
DATABASE_URL=postgresql://postgres:GLWTpqYFuqRniFyOQLGuldveOgtUWjbJ@tramway.proxy.rlwy.net:59033/railway
```

---

## 🎯 PRIORITY ORDER:

### Dabar TUOJ PAT pridėk:
1. **FACEBOOK_APP_ID**
2. **FACEBOOK_APP_SECRET**

### Vėliau (kai reikės payment):
3. Stripe keys (jau local veikia)

### Turim (tikėtina):
4. OPENAI_API_KEY
5. DATABASE_URL
6. NEXTAUTH_SECRET

