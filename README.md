# Linen & Life — Sri Lankan Luxury Linen Store

Premium ecommerce with **Stripe** (international) + **PayHere** (Sri Lanka) payment gateways.

---

## Quick Start (Windows)

### Terminal 1 — Backend
```
cd backend
copy .env.example .env
notepad .env        ← fill in your keys (see below)
npm install
npm run dev
```

### Terminal 2 — Seed products (one time only)
```
Invoke-WebRequest -Uri http://localhost:5000/api/products/seed -Method GET
```

### Terminal 3 — Frontend
```
cd frontend
copy .env.example .env
notepad .env        ← fill in Stripe publishable key
npm install
npm run dev
```

Open browser: **http://localhost:5173**

---

## Payment Setup

### Stripe (international cards)

1. Create a free account at **https://stripe.com**
2. Go to **Developers → API Keys**
3. Copy your **Publishable key** → paste into `frontend/.env` as `VITE_STRIPE_PUBLISHABLE_KEY`
4. Copy your **Secret key** → paste into `backend/.env` as `STRIPE_SECRET_KEY`
5. For webhooks (local testing): install Stripe CLI from **https://stripe.com/docs/stripe-cli**
   ```
   stripe listen --forward-to localhost:5000/api/payment/stripe-webhook
   ```
   Copy the **webhook signing secret** → paste into `backend/.env` as `STRIPE_WEBHOOK_SECRET`

**Test cards:**
- Success:  `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- 3D Secure:`4000 0025 0000 3155`
- Expiry: any future date · CVC: any 3 digits

---

### PayHere (Sri Lanka)

1. Create a merchant account at **https://www.payhere.lk**
2. Go to **Settings → Domains & Credentials**
3. Copy **Merchant ID** → `backend/.env` as `PAYHERE_MERCHANT_ID`
4. Copy **Merchant Secret** → `backend/.env` as `PAYHERE_MERCHANT_SECRET`
5. For sandbox testing, keep `PAYHERE_BASE_URL=https://sandbox.payhere.lk`
6. For live, change to `PAYHERE_BASE_URL=https://www.payhere.lk`
7. In PayHere dashboard, set your **Notify URL** to:
   `https://yourdomain.com/api/payment/payhere/notify`

**PayHere notify** works server-to-server — the payment is only confirmed
after PayHere calls your `/notify` endpoint and the hash is verified.

---

### Email Confirmations (Gmail)

1. Go to **https://myaccount.google.com/apppasswords**
2. Create an App Password for "Mail"
3. Fill in `backend/.env`:
   ```
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx   ← the 16-char app password
   ```

If you skip email setup, the store still works — just no confirmation emails.

---

## Backend .env (full)

```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/linen-and-life
JWT_SECRET=change_to_long_random_string

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

PAYHERE_MERCHANT_ID=1234567
PAYHERE_MERCHANT_SECRET=your_secret
PAYHERE_BASE_URL=https://sandbox.payhere.lk

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Linen & Life <you@gmail.com>
```

## Frontend .env

```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Project Structure

```
linen-and-life/
├── backend/
│   └── src/
│       ├── index.js              ← Express server
│       ├── middleware/auth.js    ← JWT
│       ├── models/               ← User, Product, Order, Preorder
│       └── routes/
│           ├── payment.js        ← Stripe + PayHere + webhooks + email
│           ├── products.js       ← CRUD + seed data
│           ├── orders.js         ← Order history
│           ├── preorders.js      ← Pre-order form submissions
│           ├── auth.js           ← Register / Login
│           ├── cart.js           ← Stock validation
│           └── admin.js          ← Admin dashboard API
└── frontend/
    └── src/
        ├── pages/
        │   ├── CheckoutPage.tsx      ← Stripe Elements + PayHere
        │   ├── OrderSuccessPage.tsx  ← PayHere return URL handler
        │   ├── CollectionPage.tsx    ← Shop (in-stock products)
        │   ├── PreorderPage.tsx      ← Pre-order drops
        │   └── ...
        └── components/
            ├── 3d/LinenCanvas.tsx    ← Three.js fabric
            └── ...
```

## How Payments Work

### Stripe Flow
1. User fills address → clicks "Continue to Payment"
2. Frontend calls `/api/payment/stripe/create-intent` → creates pending Order in DB + Stripe PaymentIntent
3. User enters card in Stripe Elements (card never touches your server)
4. Stripe confirms → calls your `/api/payment/stripe-webhook`
5. Webhook verifies signature → marks order paid → decrements stock → sends email

### PayHere Flow
1. User fills address → clicks "Continue to Payment" → selects PayHere
2. Frontend calls `/api/payment/payhere/initiate` → creates pending Order + generates hash
3. User is redirected to PayHere's hosted payment page
4. After payment, PayHere calls your `/api/payment/payhere/notify` (server-to-server)
5. Backend verifies MD5 hash → marks order paid → decrements stock → sends email
6. User is redirected to `/order-success?orderId=xxx` which polls for confirmation

