# 💳 STRIPE KAINŲ NUSTATYMAS - ŽINGSNIS PO ŽINGSNIO

**Data**: 2026-01-17  
**Produktas**: Sanyla AI Credits  

---

## 🎯 KAS REIKIA PADARYTI

Tu jau:
- ✅ Sukūrei produktą Stripe Dashboard
- ✅ Įrašei pavadinimą
- ✅ Parašei aprašymą
- ✅ Įkėlei logo

**Dabar reikia**:
- [ ] Sukurti 3 kainas (Pricing)
- [ ] Copy Price IDs
- [ ] Įdėti į .env failą

---

## 📝 ŽINGSNIS 1: SUKURTI KAINAS

### **Eik į savo produktą**:
```
Stripe Dashboard → Products → [Tavo produkto pavadinimas] → Pricing
```

### **Sukurk 3 kainas**:

---

#### **KAINA #1: Starter Pack (€9)**

**Click "Add pricing"**

**Nustatymai**:
```
Pricing model: Standard pricing
Price: 9.00
Currency: EUR
Billing period: One-time
Payment type: One-time payment
```

**Price description** (optional):
```
100 AI credits for content generation
Perfect for trying out Sanyla
```

**Click "Add price"**

**SVARBU**: 
- Copy **Price ID** (prasideda `price_...`)
- Įsirašyk kažkur: `STARTER_PRICE_ID=price_xxx...`

---

#### **KAINA #2: Growth Pack (€39)**

**Click "Add pricing" dar kartą**

**Nustatymai**:
```
Pricing model: Standard pricing
Price: 39.00
Currency: EUR
Billing period: One-time
Payment type: One-time payment
```

**Price description** (optional):
```
500 AI credits (13% savings)
For regular content creators
```

**Click "Add price"**

**SVARBU**: 
- Copy **Price ID**
- Įsirašyk: `PRO_PRICE_ID=price_yyy...`

---

#### **KAINA #3: Pro Pack (€69)**

**Click "Add pricing" trečią kartą**

**Nustatymai**:
```
Pricing model: Standard pricing
Price: 69.00
Currency: EUR
Billing period: One-time
Payment type: One-time payment
```

**Price description** (optional):
```
1000 AI credits (23% savings)
For agencies & power users
```

**Click "Add price"**

**SVARBU**: 
- Copy **Price ID**
- Įsirašyk: `POWER_PRICE_ID=price_zzz...`

---

## 📝 ŽINGSNIS 2: PRIDĖTI Į .ENV

### **Local Development** (apps/web/.env):

```bash
# Stripe Price IDs (Test Mode)
STRIPE_PRICE_STARTER=price_TAVO_STARTER_ID_ČIA
STRIPE_PRICE_PRO=price_TAVO_PRO_ID_ČIA
STRIPE_PRICE_POWER=price_TAVO_POWER_ID_ČIA

# Example (REPLACE with your actual IDs):
# STRIPE_PRICE_STARTER=price_1QRStabcdefghijk
# STRIPE_PRICE_PRO=price_1QRStlmnopqrstuv
# STRIPE_PRICE_POWER=price_1QRStwxyzABCDEFG
```

### **Railway Production**:

```bash
# Railway Dashboard → Sanyla → Variables → New Variable

# Add 3 variables:
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_yyy
STRIPE_PRICE_POWER=price_zzz
```

---

## 📝 ŽINGSNIS 3: TESTUOTI

### **Local Test**:

```bash
# 1. Restart dev server
cd apps/web
pnpm dev

# 2. Eik į billing page
http://localhost:3000/billing

# 3. Click "Buy Now" ant bet kurio pack
# Turėtų atidaryti Stripe Checkout
# Naudok test card: 4242 4242 4242 4242

# 4. Complete payment
# Turėtų redirect į success page
# Check credits balance navbar'e
```

---

## 🔍 KAIP RASTI PRICE IDS STRIPE DASHBOARD

### **Metodas 1: Per Products**:
```
1. Stripe Dashboard → Products
2. Click ant savo produkto pavadinimo
3. Scroll žemyn į "Pricing" sekciją
4. Matai visas 3 kainas su ID (price_xxx)
5. Click "..." → "Copy Price ID"
```

### **Metodas 2: Per Prices**:
```
1. Stripe Dashboard → Products → Prices (tab viršuje)
2. Rask savo 3 kainas (€9, €39, €69)
3. Click ant kiekvienos
4. Copy ID iš URL arba puslapio
```

---

## ✅ COMPLETION CHECKLIST

**Stripe Dashboard**:
- [ ] Sukurtos 3 kainos (€9, €39, €69)
- [ ] Visos "One-time payment"
- [ ] Visos "EUR" currency
- [ ] Copy 3 Price IDs

**Local .env**:
- [ ] Pridėtas `STRIPE_PRICE_STARTER`
- [ ] Pridėtas `STRIPE_PRICE_PRO`
- [ ] Pridėtas `STRIPE_PRICE_POWER`
- [ ] Restart dev server

**Testing**:
- [ ] `/billing` page rodo 3 packs
- [ ] "Buy Now" atidaro Stripe Checkout
- [ ] Test payment su 4242 card success
- [ ] Credits pridėti į account
- [ ] Success page rodo correct amount

**Production (Railway)**:
- [ ] 3 Price IDs pridėti į Railway env vars
- [ ] Redeploy app
- [ ] Test production payment

---

## 🚨 COMMON ISSUES

### **"Invalid Price ID" Error**:
```
Problem: Price ID doesn't exist in Stripe
Solution: 
1. Check typo in .env
2. Verify Price ID in Stripe Dashboard
3. Make sure using TEST mode Price IDs for development
```

### **"Missing environment variable" Error**:
```
Problem: .env doesn't have STRIPE_PRICE_XXX
Solution:
1. Add all 3 price IDs to .env
2. Restart dev server (pnpm dev)
```

### **Checkout page 404**:
```
Problem: Stripe Secret Key not configured
Solution:
1. Add STRIPE_SECRET_KEY to .env
2. Get from Stripe Dashboard → Developers → API keys
```

---

## 📊 EXPECTED RESULT

Po sėkmingo nustatymo:

**Billing Page** (`/billing`):
```
┌─────────────────────────────────────┐
│  🌟 Buy AI Credits                  │
│  One-time purchase. No subscriptions│
└─────────────────────────────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│ Starter  │  │ Growth   │  │  Pro     │
│   €9     │  │   €39    │  │  €69     │
│ 100 cred │  │ 500 cred │  │ 1000 cred│
│ Buy Now  │  │ Buy Now  │  │ Buy Now  │
└──────────┘  └──────────┘  └──────────┘
              ↑ POPULAR
```

**Click "Buy Now"**:
- Redirect to Stripe Checkout
- Form su payment details
- Test card: 4242 4242 4242 4242
- Success → Redirect to `/billing/success`
- Credits added to account

---

## 🎓 NEXT STEPS

After setup completed:

1. **Test all 3 packs** with test card
2. **Verify credits added** (check navbar)
3. **Check webhook logs** (Stripe Dashboard → Developers → Webhooks)
4. **Setup Live Mode** when ready for production
5. **Switch Price IDs** from test to live

---

## 🔗 USEFUL LINKS

- **Stripe Products**: https://dashboard.stripe.com/products
- **Stripe Prices**: https://dashboard.stripe.com/prices
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Test Cards**: https://stripe.com/docs/testing

---

**Need Help?** 
- Stripe Support: https://support.stripe.com
- Stripe Docs: https://stripe.com/docs

**Created**: 2026-01-17  
**Version**: 1.0
