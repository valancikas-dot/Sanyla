# 💳 STRIPE BILLING SETUP — PHASE 4

Simple, secure Stripe integration for one-time credit purchases.

## 🎯 Features

✅ **One-time purchases** (no subscriptions)  
✅ **Stripe Checkout** (hosted, PCI-compliant)  
✅ **Idempotent processing** (no double-crediting)  
✅ **Server-side verification** (never trust frontend)  
✅ **Atomic transactions** (all-or-nothing credit addition)

---

## 📦 Credit Packs

| Pack | Credits | Price | Best For |
|------|---------|-------|----------|
| **Starter** | 100 | €9 | Testing & small campaigns |
| **Pro** | 500 | €39 | Regular content creators |
| **Power** | 1,000 | €69 | Agencies & heavy users |

---

## 🚀 Setup Instructions

### 1️⃣ Create Stripe Account

1. Go to https://stripe.com
2. Sign up for an account
3. Activate your account

### 2️⃣ Get API Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`

### 3️⃣ Create Products in Stripe Dashboard

**Go to**: https://dashboard.stripe.com/test/products

#### Product 1: Starter Pack
- **Name**: `Starter Pack - 100 AI Credits`
- **Description**: `100 AI credits for content generation`
- **Pricing**: 
  - Type: `One-time`
  - Price: `€9.00`
  - Currency: `EUR`
- **Save** → Copy the **Price ID** (starts with `price_`)

#### Product 2: Pro Pack
- **Name**: `Pro Pack - 500 AI Credits`
- **Description**: `500 AI credits for content generation`
- **Pricing**: 
  - Type: `One-time`
  - Price: `€39.00`
  - Currency: `EUR`
- **Save** → Copy the **Price ID**

#### Product 3: Power Pack
- **Name**: `Power Pack - 1000 AI Credits`
- **Description**: `1000 AI credits for content generation`
- **Pricing**: 
  - Type: `One-time`
  - Price: `€69.00`
  - Currency: `EUR`
- **Save** → Copy the **Price ID**

### 4️⃣ Configure Environment Variables

Add to `.env` or `.env.local`:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxx

# Price IDs from Stripe Dashboard
STRIPE_PRICE_STARTER=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_POWER=price_xxxxxxxxxxxxxxxxxxxxx

# App URL for redirects
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5️⃣ Test Payment Flow

1. **Use Stripe test card**: `4242 4242 4242 4242`
2. **Expiry**: Any future date (e.g., `12/34`)
3. **CVC**: Any 3 digits (e.g., `123`)
4. **ZIP**: Any 5 digits (e.g., `12345`)

---

## 🧪 Testing Checklist

### ✅ Success Flow
```bash
1. Click "Buy Credits" button
2. Select "Pro Pack"
3. POST /api/billing/create-checkout-session → returns Stripe URL
4. Redirect to Stripe Checkout
5. Enter test card: 4242 4242 4242 4242
6. Complete payment
7. Redirect to /billing/success?session_id=cs_xxx
8. GET /api/billing/checkout-success
9. Verify:
   ✓ User.aiCredits increased by 500
   ✓ CreditLog created with action=CREDITS_PURCHASE
   ✓ Success page shows "500 credits added"
```

### ✅ Cancel Flow
```bash
1. Start checkout
2. Click "Back" button in Stripe Checkout
3. Redirect to /billing/cancel
4. Verify:
   ✓ No credits added
   ✓ No CreditLog created
   ✓ User can retry
```

### ✅ Idempotency (Double Refresh)
```bash
1. Complete payment successfully
2. Refresh /billing/success page
3. Verify:
   ✓ Credits NOT added again
   ✓ Response: { alreadyProcessed: true }
   ✓ CreditLog count = 1 (not duplicated)
```

### ✅ Security Test
```bash
1. Try to access /api/billing/checkout-success without session_id
   → 400 "Missing session_id"

2. Try with invalid session_id
   → 500 Stripe error

3. Try with different user's session_id
   → 403 "User ID mismatch"

4. Try before payment completed
   → 400 "Payment not completed"
```

---

## 🔒 Security Features

✅ **Server-side verification**: All payment checks via Stripe API  
✅ **User ID validation**: Metadata userId must match session  
✅ **Payment status check**: Only "paid" status accepted  
✅ **Idempotency**: stripeSessionId prevents double-crediting  
✅ **Atomic transactions**: Credits + log created together  
✅ **No frontend trust**: Never accept credits amount from client

---

## 📊 Database Schema

### CreditLog Entry (Purchase)
```json
{
  "action": "CREDITS_PURCHASE",
  "cost": -500,  // Negative = credits added
  "metadata": {
    "pack": "pro",
    "credits": 500,
    "stripeSessionId": "cs_test_xxx",
    "stripePaymentIntentId": "pi_xxx",
    "amount": 3900,  // in cents
    "currency": "eur"
  }
}
```

---

## 🚫 What's NOT Implemented (By Design)

❌ **Stripe Webhooks**: Not needed for simple checkout  
❌ **Subscriptions**: Only one-time purchases  
❌ **Recurring billing**: No monthly/yearly plans  
❌ **Refunds**: Manual via Stripe Dashboard  
❌ **Invoices**: Stripe provides PDF receipts  
❌ **Organization billing**: User-level only

---

## 🔄 Flow Diagram

```
User Dashboard
    ↓
Click "Buy Credits"
    ↓
Select Pack (Starter/Pro/Power)
    ↓
POST /api/billing/create-checkout-session
    ↓
Redirect to Stripe Checkout (hosted page)
    ↓
User enters card details
    ↓
Payment processed by Stripe
    ↓
Redirect to /billing/success?session_id=cs_xxx
    ↓
GET /api/billing/checkout-success
    ├─ Verify payment with Stripe API
    ├─ Check idempotency (prevent double-add)
    ├─ Atomic transaction:
    │   ├─ User.aiCredits += 500
    │   └─ Create CreditLog
    └─ Return success
    ↓
Show success page with new balance
```

---

## 🚀 Production Checklist

Before going live:

- [ ] Switch to **live API keys** (sk_live_xxx, pk_live_xxx)
- [ ] Create products in **live mode** (not test mode)
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Test with real card (small amount first)
- [ ] Set up Stripe email receipts (automatic)
- [ ] Add business details in Stripe Dashboard
- [ ] Enable 3D Secure (SCA compliance in EU)
- [ ] Review Stripe fees (1.4% + €0.25 per transaction in EU)

---

## 💡 Future Enhancements (Post-Phase 4)

- [ ] Webhooks for async processing
- [ ] Credit purchase history page
- [ ] Stripe Customer Portal
- [ ] Promo codes / discounts
- [ ] Monthly subscription option
- [ ] Usage analytics dashboard

---

## 📝 API Endpoints

### POST `/api/billing/create-checkout-session`
**Request**:
```json
{
  "pack": "starter" | "pro" | "power"
}
```

**Response**:
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_xxx",
  "sessionId": "cs_test_xxx"
}
```

### GET `/api/billing/checkout-success?session_id=cs_xxx`
**Response** (Success):
```json
{
  "success": true,
  "message": "Successfully added 500 credits to your account",
  "credits": 500,
  "pack": "pro",
  "previousBalance": 100,
  "newBalance": 600
}
```

**Response** (Already Processed):
```json
{
  "success": true,
  "alreadyProcessed": true,
  "message": "Credits already added for this purchase",
  "credits": 500,
  "pack": "pro",
  "currentBalance": 600
}
```

---

## 🆘 Troubleshooting

### Issue: "Missing Stripe Price ID for X pack"
**Solution**: Add `STRIPE_PRICE_STARTER/PRO/POWER` to `.env`

### Issue: "Payment not completed"
**Solution**: User cancelled or payment failed. Show retry button.

### Issue: Credits added twice
**Solution**: Shouldn't happen (idempotency check). Check `CreditLog` for duplicates.

### Issue: "User ID mismatch"
**Solution**: Security check failed. User might be logged out or session tampered.

---

## 📞 Support

- **Stripe Docs**: https://stripe.com/docs/payments/checkout
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Test Cards**: https://stripe.com/docs/testing

---

**✅ PHASE 4 COMPLETE** — Simple, secure credit purchases via Stripe! 🎉
