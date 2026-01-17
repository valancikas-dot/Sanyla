# ⚡ STRIPE KAINOS - GREITAS NUSTATYMAS

## 🎯 3 ŽINGSNIAI:

### 1️⃣ SUKURTI KAINAS STRIPE DASHBOARD

Eik: https://dashboard.stripe.com/products

1. Rask savo produktą
2. Click "Add pricing" (3 kartus)

**Kaina #1**: €9.00 → One-time → EUR → Copy Price ID
**Kaina #2**: €39.00 → One-time → EUR → Copy Price ID  
**Kaina #3**: €69.00 → One-time → EUR → Copy Price ID

---

### 2️⃣ PRIDĖTI Į .ENV

```bash
cd apps/web
nano .env
```

**Įdėk**:
```bash
STRIPE_PRICE_STARTER=price_XXX  # €9 pack
STRIPE_PRICE_PRO=price_YYY      # €39 pack
STRIPE_PRICE_POWER=price_ZZZ    # €69 pack
```

Save (Ctrl+O, Enter, Ctrl+X)

---

### 3️⃣ TESTUOTI

```bash
pnpm dev
```

Eik: http://localhost:3000/billing

Click "Buy Now" → Test card: **4242 4242 4242 4242**

✅ Success → Credits added!

---

## 📋 KAINŲ SCHEMA

| Pack    | Price | Credits | Savings | Use Case |
|---------|-------|---------|---------|----------|
| Starter | €9    | 100     | -       | Try it   |
| Growth  | €39   | 500     | 13%     | Regular  |
| Pro     | €69   | 1000    | 23%     | Agency   |

---

## 🔑 KUR RASTI PRICE IDS?

**Stripe Dashboard** → **Products** → **Tavo produktas** → **Pricing section**

Matai:
```
€9.00 EUR / one time    price_ABC123...  [Copy]
€39.00 EUR / one time   price_DEF456...  [Copy]
€69.00 EUR / one time   price_GHI789...  [Copy]
```

---

## ✅ CHECKLIST

- [ ] 3 kainos sukurtos Stripe
- [ ] Price IDs nukopijuoti
- [ ] .env atnaujintas
- [ ] Dev server restart'intas
- [ ] Test payment veikia

**Done!** 🎉
