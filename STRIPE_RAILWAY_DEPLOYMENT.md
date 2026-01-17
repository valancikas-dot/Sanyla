# 🚂 Railway Deployment su Stripe

Greitas gidas kaip įdiegti Sanyla į Railway su Stripe mokėjimais.

---

## ✅ Kas jau padaryta lokaliai

- ✅ Stripe Product sukurtas: `prod_ToFPtEu0ZrVlo2`
- ✅ 3 kainos sukonfigūruotos:
  - €9 Starter: `price_1SqcuVRzm2KtI9OITrMxmHQF`
  - €39 Growth: `price_1SqcuVRzm2KtI9OILsGmuVSU`
  - €69 Pro: `price_1SqcuVRzm2KtI9OIt0jxsUdT`
- ✅ `.env` failas sukonfigūruotas lokaliai
- ✅ Billing puslapis atnaujintas su Price IDs

---

## 🚀 Railway Deployment Žingsniai

### 1. Užsipushink kodą į GitHub

```bash
cd /Users/aleksandrvilcinskas/Desktop/Sanyla

# Pridėk visus pakeitimus
git add .

# Commit su Stripe konfigūracija
git commit -m "feat: Add Stripe payment integration with Price IDs"

# Push į GitHub
git push origin main
```

### 2. Railway Dashboard Setup

1. **Eik į Railway**: https://railway.app/dashboard
2. **Pasirink savo Sanyla projektą**
3. **Pasirink Web Service (Next.js)**

### 3. Pridėk Stripe Environment Variables

Railway Dashboard → Tavo projektas → Variables → Raw Editor

**Pridėk šias eilutes**:

```bash
# Stripe API Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Price IDs (Test Mode - One-time payments)
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_1SqcuVRzm2KtI9OITrMxmHQF
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_1SqcuVRzm2KtI9OILsGmuVSU
NEXT_PUBLIC_STRIPE_PRICE_POWER=price_1SqcuVRzm2KtI9OIt0jxsUdT

# Stripe Webhook (Railway URL)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Kaip gauti trūkstamus keys**:

#### Stripe Publishable Key:
1. Eik į: https://dashboard.stripe.com/test/apikeys
2. Nukopijuok **Publishable key** (prasideda `pk_test_...`)

#### Stripe Secret Key:
1. Tame pačiame puslapyje: https://dashboard.stripe.com/test/apikeys
2. Nukopijuok **Secret key** (prasideda `sk_test_...`)
3. ⚠️ **SVARBU**: Niekada nedėk šito į GitHub! Tik į Railway Environment Variables!

#### Stripe Webhook Secret:
1. Eik į: https://dashboard.stripe.com/test/webhooks
2. Spausk **+ Add endpoint**
3. Endpoint URL: `https://tavo-railway-url.railway.app/api/billing/webhook`
   - Pakeisk `tavo-railway-url` į tikrą Railway URL
4. Events to send pasirink:
   - `checkout.session.completed`
5. Spausk **Add endpoint**
6. Nukopijuok **Signing secret** (prasideda `whsec_...`)

### 4. Redeploy Railway

Railway automatiškai redeployins po kodo push, bet jei ne:

1. Railway Dashboard → Tavo projektas
2. Spausk **Deploy** → **Redeploy**

### 5. Patikrink ar veikia

```bash
# Atidark savo Railway URL
https://tavo-railway-url.railway.app/billing

# Paspausk "Buy Now"
# Naudok test kortelę: 4242 4242 4242 4242
```

---

## 🧪 Test Mode → Live Mode

Kai būsi pasiruošęs priimti tikrus mokėjimus:

### 1. Sukurk Live Prices Stripe Dashboard

1. Eik į: https://dashboard.stripe.com/products (be "test/" URL)
2. Pasirink produktą `prod_ToFPtEu0ZrVlo2`
3. Sukurk 3 live prices:
   - €9 Starter
   - €39 Growth  
   - €69 Pro
4. Nukopijuok naujus **LIVE Price IDs**

### 2. Update Railway Variables su Live Keys

```bash
# Stripe API Keys (LIVE MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Stripe Price IDs (LIVE MODE)
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_LIVE_starter_id
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_LIVE_pro_id
NEXT_PUBLIC_STRIPE_PRICE_POWER=price_LIVE_power_id

# Stripe Webhook (LIVE MODE)
STRIPE_WEBHOOK_SECRET=whsec_LIVE_webhook_secret
```

### 3. Update Webhook Endpoint

1. Eik į: https://dashboard.stripe.com/webhooks (be "test/")
2. Pridėk endpoint: `https://tavo-railway-url.railway.app/api/billing/webhook`
3. Events: `checkout.session.completed`

---

## ✅ Checklist

- [ ] Kodas push'intas į GitHub
- [ ] Railway projektas sukurtas
- [ ] Stripe Publishable Key pridėtas į Railway
- [ ] Stripe Secret Key pridėtas į Railway
- [ ] 3 Price IDs pridėti į Railway
- [ ] Webhook endpoint sukonfigūruotas Stripe Dashboard
- [ ] Webhook secret pridėtas į Railway
- [ ] Railway redeployed
- [ ] Testuota su test kortelė 4242 4242 4242 4242
- [ ] Kreditai prisidėjo po mokėjimo
- [ ] Live mode sukonfigūruotas (kai pasiruošęs)

---

## 🆘 Troubleshooting

### "Payment failed" arba "Checkout not opening"

**Patikrink**:
1. Ar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` prasideda `pk_test_` (test mode)?
2. Ar Railway Environment Variables išsaugoti?
3. Ar Railway redeployintas po variable pridėjimo?

### "Credits not added after payment"

**Patikrink**:
1. Stripe Dashboard → Events → Ar matai `checkout.session.completed`?
2. Railway Logs → Ar webhook endpoint gavo event?
3. Ar `STRIPE_WEBHOOK_SECRET` correct?

### "Invalid Price ID"

**Patikrink**:
1. Ar Price IDs Railway Variables atitinka Stripe Dashboard?
2. Ar naudoji TEST Price IDs su TEST API keys?
3. Ar naudoji LIVE Price IDs su LIVE API keys?

---

## 📊 Monitoring

### Stripe Dashboard:
- **Payments**: https://dashboard.stripe.com/test/payments
- **Customers**: https://dashboard.stripe.com/test/customers
- **Events**: https://dashboard.stripe.com/test/events

### Railway Logs:
```bash
# Railway CLI
railway logs

# Arba Railway Dashboard → Deployments → Logs
```

---

## 🎉 Gatava!

Dabar turėtum turėti fully working Stripe payment integration Railway!

**Testuok**:
1. Eik į production URL: `https://tavo-railway-url.railway.app/billing`
2. Spausk "Buy Now"
3. Naudok test kortelę: `4242 4242 4242 4242`
4. Complete checkout
5. Patikrink ar kreditai prisidėjo! 🚀
