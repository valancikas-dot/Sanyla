# 🔴 PRODUCTION STRIPE SETUP — LIVE PAYMENTS

**STATUS**: Ready for production deployment  
**COST**: €0 setup (pay only when customers purchase)  
**TIME**: 10 minutes

---

## ⚠️ CRITICAL PRE-FLIGHT CHECKLIST

**BEFORE enabling live payments, verify:**

- [ ] **SSL Certificate**: Production domain has HTTPS (Stripe requires it)
- [ ] **Domain**: Know your final URL (e.g., `https://sanyla.com` or `https://app.sanyla.com`)
- [ ] **Business Info**: Stripe may require ID, address, bank details for verification
- [ ] **Legal Pages**: Have Terms of Service + Privacy Policy (required by Stripe)
- [ ] **Refund Policy**: Decided how to handle refund requests
- [ ] **Tax Compliance**: PVM/VAT number if required in Lithuania/EU
- [ ] **Test First**: Created test products and tested checkout flow

---

## 🚀 STEP-BY-STEP SETUP (10 MIN)

### **STEP 1: Switch to Live Mode** (1 min)

```bash
1. Login: https://dashboard.stripe.com
2. Top-right toggle: "Test mode" → "Live mode"
3. If prompted, complete business verification:
   - Upload ID/passport
   - Provide business address
   - Add bank account for payouts
   - This may take 1-2 business days for approval
```

---

### **STEP 2: Get Live API Keys** (2 min)

```bash
1. Navigate: https://dashboard.stripe.com/apikeys
2. Under "Standard keys" (Live mode):
   
   → Copy "Publishable key"
   pk_live_YOUR_PUBLISHABLE_KEY_HERE
   
   → Click "Reveal test key" on Secret key
   → Copy immediately (shown only once!)
   sk_live_YOUR_SECRET_KEY_HERE

⚠️ SECURITY: Never commit these to Git!
   Store in Railway/Vercel environment variables only.
```

---

### **STEP 3: Create Live Products** (5 min)

```bash
1. Navigate: https://dashboard.stripe.com/products
2. Click "Add product" (create 3 products):
```

#### **Product 1: Sanyla Starter**
```
Name: Sanyla Starter
Description: 100 AI credits for content generation
Pricing model: One-time
Price: €9.00 EUR

→ After creation, copy Price ID:
   price_xxxxxxxxxxxxxxxxxxxxxx (this is STRIPE_PRICE_STARTER)
```

#### **Product 2: Sanyla Pro** ⭐
```
Name: Sanyla Pro
Description: 500 AI credits for content generation
Pricing model: One-time
Price: €39.00 EUR

→ After creation, copy Price ID:
   price_xxxxxxxxxxxxxxxxxxxxxx (this is STRIPE_PRICE_PRO)
```

#### **Product 3: Sanyla Power**
```
Name: Sanyla Power
Description: 1000 AI credits for content generation
Pricing model: One-time
Price: €69.00 EUR

→ After creation, copy Price ID:
   price_xxxxxxxxxxxxxxxxxxxxxx (this is STRIPE_PRICE_POWER)
```

---

### **STEP 4: Configure Environment Variables** (2 min)

Add these to your **production** environment (Railway/Vercel):

```bash
# Stripe Live Keys
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY_HERE

# Stripe Price IDs (from Step 3)
STRIPE_PRICE_STARTER=price_STARTER_ID_HERE
STRIPE_PRICE_PRO=price_PRO_ID_HERE
STRIPE_PRICE_POWER=price_POWER_ID_HERE

# Production URL (MUST be HTTPS)
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
```

**⚠️ IMPORTANT:**
- `NEXT_PUBLIC_APP_URL` must NOT end with `/`
- Must start with `https://` (not `http://`)
- Must match your actual production domain
- Example: `https://sanyla.com` or `https://app.sanyla.com`

---

## ✅ VALIDATION (Before Going Live)

### **Test Configuration**

```bash
# 1. Deploy to production with environment variables set

# 2. Call validation endpoint:
curl https://your-domain.com/api/billing/validate-env

# 3. Expected response:
{
  "status": "ok",
  "message": "Stripe configuration is valid",
  "account": {
    "id": "acct_xxxxx",
    "email": "your@email.com",
    "country": "LT",
    "charges_enabled": true,
    "payouts_enabled": true
  },
  "prices": ["price_xxx", "price_xxx", "price_xxx"],
  "mode": "LIVE",
  "warnings": []
}

# ❌ If you see errors:
# - Check all environment variables are set correctly
# - Verify price IDs match Stripe dashboard
# - Ensure APP_URL is HTTPS
# - Check Stripe account is fully verified
```

---

## 🧪 TEST PURCHASE (Production)

**⚠️ THIS WILL CHARGE YOUR REAL CARD €9**

```bash
1. Navigate to: https://your-domain.com/billing
2. Click "Buy Starter" (€9)
3. Use your REAL card in Stripe Checkout
4. Complete payment
5. Verify:
   - Redirected to /billing/success
   - Credits added to your account in database
   - Payment appears in Stripe Dashboard → Payments
   - Refresh success page → Credits should NOT double (idempotency)

6. Refund test payment:
   - Go to Stripe Dashboard → Payments
   - Click on the €9 payment
   - Click "Refund" → Full refund
```

---

## 💰 PRICING BREAKDOWN

| Pack    | Price | Credits | Cost per Credit | Campaigns (~30cr each) |
|---------|-------|---------|-----------------|------------------------|
| Starter | €9    | 100     | €0.09           | ~3 campaigns           |
| Pro     | €39   | 500     | €0.078          | ~16 campaigns          |
| Power   | €69   | 1000    | €0.069          | ~33 campaigns          |

**Free Tier**: 100 credits on signup (3 campaigns free)

---

## 🔒 SECURITY FEATURES

### **Built-in Protection:**
1. ✅ **Idempotency**: Prevent double-crediting on page refresh
2. ✅ **Server-side validation**: All Stripe calls verified server-side
3. ✅ **Payment verification**: Check `payment_status === 'paid'` before crediting
4. ✅ **User validation**: Verify user owns the session before adding credits
5. ✅ **Atomic transactions**: Credits + CreditLog created together (rollback on error)
6. ✅ **No stored cards**: Stripe handles all card storage (PCI compliant)

### **What We DON'T Do (Intentionally):**
- ❌ **No webhooks**: Simpler architecture, one-time payments only
- ❌ **No subscriptions**: Reduces complexity, no recurring billing issues
- ❌ **No stored payment methods**: Stripe Checkout handles everything

---

## 📊 MONITORING

### **Daily Checks:**
```bash
# 1. Check Stripe Dashboard
https://dashboard.stripe.com/payments

# 2. Monitor revenue
SELECT 
  DATE(createdAt) as date,
  COUNT(*) as purchases,
  SUM(credits) as total_credits,
  SUM(CASE 
    WHEN credits = 100 THEN 9
    WHEN credits = 500 THEN 39
    WHEN credits = 1000 THEN 69
  END) as revenue_eur
FROM CreditLog
WHERE type = 'CREDITS_PURCHASE'
  AND createdAt >= NOW() - INTERVAL '7 days'
GROUP BY DATE(createdAt)
ORDER BY date DESC;

# 3. Check for failed payments
# → Stripe Dashboard → Payments → Filter by "Failed"
```

---

## ⚠️ TROUBLESHOOTING

### **"Invalid API key"**
```
→ Check STRIPE_SECRET_KEY starts with sk_live_ (not sk_test_)
→ Verify key copied correctly (no spaces/newlines)
→ Regenerate key in Stripe Dashboard if needed
```

### **"No such price"**
```
→ Verify price IDs in .env match Stripe Dashboard
→ Check you're in LIVE mode in Stripe Dashboard
→ Price ID should start with price_xxx
```

### **"Redirect URI mismatch"**
```
→ Ensure NEXT_PUBLIC_APP_URL matches actual domain
→ Must be HTTPS (not HTTP)
→ Should NOT end with /
→ Example: https://sanyla.com (✅) vs https://sanyla.com/ (❌)
```

### **"Account not verified"**
```
→ Complete business verification in Stripe Dashboard
→ Upload ID, provide address, add bank account
→ May take 1-2 business days
→ Check email for Stripe verification requests
```

### **Credits not added after payment**
```
# 1. Check Stripe Dashboard → Payment status
# 2. Check database CreditLog table:
SELECT * FROM "CreditLog" 
WHERE "stripeSessionId" = 'cs_test_xxxxx' 
ORDER BY "createdAt" DESC;

# 3. Check logs for errors:
# → Railway/Vercel logs → Filter by "checkout-success"

# 4. Manual credit addition (if needed):
UPDATE "User" 
SET "aiCredits" = "aiCredits" + 100 
WHERE id = 'user-id-here';

INSERT INTO "CreditLog" ("userId", "type", "amount", "credits", "description")
VALUES ('user-id-here', 'CREDITS_PURCHASE', 900, 100, 'Manual credit - payment cs_xxx');
```

---

## 🎯 LAUNCH DAY CHECKLIST

**30 minutes before launch:**
- [ ] All environment variables set in production
- [ ] Validation endpoint returns `"status": "ok"`
- [ ] Test purchase completed successfully (€9 charge + refund)
- [ ] Terms of Service page live
- [ ] Privacy Policy page live
- [ ] Support email active (e.g., support@sanyla.com)

**During launch:**
- [ ] Monitor Stripe Dashboard for first real purchase
- [ ] Watch Railway/Vercel logs for errors
- [ ] Check database that credits are being added
- [ ] Test billing page on mobile (50% of traffic)

**First 24 hours:**
- [ ] Reply to all support emails within 2 hours
- [ ] Monitor for any payment failures
- [ ] Check refund requests
- [ ] Celebrate first €50 revenue! 🎉

---

## 📞 SUPPORT

**If something breaks during launch:**

1. **Check logs first**: Railway/Vercel logs → Filter by "billing"
2. **Validation endpoint**: Call `/api/billing/validate-env` to diagnose
3. **Stripe Dashboard**: Check payment status directly
4. **Emergency disable**: Set `STRIPE_SECRET_KEY=""` to disable billing temporarily

**Stripe Support:**
- Dashboard: https://dashboard.stripe.com/support
- Docs: https://stripe.com/docs
- Status: https://status.stripe.com

---

## ✅ COMPLETION CHECKLIST

**Setup Complete When:**
- [x] Live API keys obtained
- [x] 3 products created in Stripe (Starter/Pro/Power)
- [x] Environment variables configured in production
- [ ] Validation endpoint returns "ok"
- [ ] Test purchase completed (€9 charge + refund)
- [ ] Billing page accessible at `/billing`
- [ ] Success page shows correct credits
- [ ] Ready for first real customer! 🚀

---

**Next Step**: Give me your Stripe keys and production URL, I'll help configure `.env`! 🔥
