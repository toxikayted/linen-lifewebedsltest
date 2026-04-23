const express    = require('express');
const stripe     = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
const Order      = require('../models/Order');
const Product    = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// Email helper
// ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderConfirmation(order, userEmail, userName) {
  if (!process.env.EMAIL_USER) return; // skip if email not configured

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #EDE3D0;">
        <strong>${item.name}</strong><br>
        <small style="color:#7A6A52;">Size: ${item.size} &nbsp;·&nbsp; Qty: ${item.quantity}</small>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #EDE3D0;text-align:right;">
        LKR ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const html = `
    <div style="max-width:560px;margin:0 auto;font-family:'Georgia',serif;color:#2C2418;background:#FDFBF7;padding:40px 32px;border-radius:12px;">
      <div style="text-align:center;margin-bottom:32px;">
        <p style="font-size:11px;letter-spacing:4px;color:#C4A962;text-transform:uppercase;margin:0;">Linen &amp; Life</p>
        <h1 style="font-size:28px;font-weight:300;margin:8px 0 0;">Order Confirmed</h1>
      </div>
      <p style="color:#7A6A52;">Dear ${userName},</p>
      <p style="color:#7A6A52;">Thank you for your order. Your handwoven linen is being prepared with care.</p>
      <div style="background:#fff;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #EDE3D0;">
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#C4A962;text-transform:uppercase;">Order Summary</p>
        <table style="width:100%;border-collapse:collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding:12px 0 4px;color:#7A6A52;">Shipping</td>
            <td style="padding:12px 0 4px;text-align:right;color:#7A6A52;">${order.shippingCost === 0 ? 'Free' : 'LKR ' + order.shippingCost.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:18px;font-weight:600;">Total</td>
            <td style="padding:4px 0;text-align:right;font-size:18px;color:#C4A962;font-weight:600;">LKR ${order.total.toLocaleString()}</td>
          </tr>
        </table>
      </div>
      <div style="background:#fff;border-radius:8px;padding:16px 20px;border:1px solid #EDE3D0;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#C4A962;text-transform:uppercase;">Shipping To</p>
        <p style="margin:0;color:#2C2418;line-height:1.6;">
          ${order.shippingAddress.name}<br>
          ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.country}
        </p>
      </div>
      <p style="color:#7A6A52;font-size:13px;margin-top:24px;">
        We'll send you a tracking number once your order is dispatched. 
        For any questions, reply to this email.
      </p>
      <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #EDE3D0;">
        <p style="font-size:11px;color:#7A6A52;letter-spacing:2px;">HANDWOVEN IN SRI LANKA &nbsp;·&nbsp; MADE WITH INTENTION</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || 'Linen & Life <noreply@linenandlife.com>',
      to:      userEmail,
      subject: `Order Confirmed — Linen & Life #${order._id.toString().slice(-8).toUpperCase()}`,
      html,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// Helper: decrement stock after successful payment
// ─────────────────────────────────────────────────────────────
async function decrementStock(items) {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { soldCount: item.quantity },
      $set: { 'sizes.$[el].stock': null }, // handled below per size
    });

    // Decrement per-size stock
    await Product.updateOne(
      { _id: item.product, 'sizes.size': item.size },
      { $inc: { 'sizes.$.stock': -item.quantity, soldCount: 0 } }
    );

    // Re-check isInStock
    const prod = await Product.findById(item.product);
    if (prod) {
      prod.soldCount += item.quantity;
      await prod.save(); // triggers pre-save isInStock update
    }
  }
}


// ═════════════════════════════════════════════════════════════
// STRIPE ROUTES
// ═════════════════════════════════════════════════════════════

/**
 * POST /api/payment/stripe/create-intent
 * Create a PaymentIntent and a pending order
 */
router.post('/stripe/create-intent', protect, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shippingCost, total } = req.body;

    // Validate stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });
      if (!product.active) return res.status(400).json({ message: `${product.name} is no longer available` });
      const sizeObj = product.sizes.find(s => s.size === item.size);
      if (!sizeObj || sizeObj.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.size})` });
      }
    }

    // Create Stripe PaymentIntent
    const intent = await stripe.paymentIntents.create({
      amount:   Math.round(total * 100), // Stripe uses cents
      currency: 'lkr',
      metadata: { userId: req.user._id.toString() },
      automatic_payment_methods: { enabled: true },
    });

    // Create pending order in DB
    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        product:  i.productId,
        name:     i.name,
        price:    i.price,
        quantity: i.quantity,
        size:     i.size,
        image:    i.image,
      })),
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      paymentMethod:         'stripe',
      paymentStatus:         'pending',
      status:                'pending_payment',
      stripePaymentIntentId: intent.id,
      stripeClientSecret:    intent.client_secret,
    });

    res.json({
      clientSecret: intent.client_secret,
      orderId:      order._id,
    });
  } catch (err) {
    console.error('Stripe intent error:', err);
    res.status(500).json({ message: err.message });
  }
});


/**
 * POST /api/payment/stripe-webhook
 * Stripe calls this automatically after payment succeeds/fails
 * MUST use raw body — set up in index.js BEFORE express.json()
 */
router.post('/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,                              // raw Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const order  = await Order.findOne({ stripePaymentIntentId: intent.id }).populate('user', 'name email');

    if (order && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.status        = 'processing';
      await order.save();

      // Decrement stock
      await decrementStock(order.items);

      // Send confirmation email
      if (order.user?.email) {
        await sendOrderConfirmation(order, order.user.email, order.user.name);
      }

      console.log(`✅ Stripe payment confirmed: ${order._id}`);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object;
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: intent.id },
      { paymentStatus: 'failed', status: 'cancelled' }
    );
    console.log(`❌ Stripe payment failed: ${intent.id}`);
  }

  res.json({ received: true });
});


// ═════════════════════════════════════════════════════════════
// PAYHERE ROUTES
// ═════════════════════════════════════════════════════════════

/**
 * POST /api/payment/payhere/initiate
 * Returns the PayHere form data to render on the frontend
 */
router.post('/payhere/initiate', protect, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shippingCost, total } = req.body;

    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });
      if (!product.active) return res.status(400).json({ message: `${product.name} is no longer available` });
      const sizeObj = product.sizes.find(s => s.size === item.size);
      if (!sizeObj || sizeObj.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.size})` });
      }
    }

    // Create pending order
    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        product:  i.productId,
        name:     i.name,
        price:    i.price,
        quantity: i.quantity,
        size:     i.size,
        image:    i.image,
      })),
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      paymentMethod:  'payhere',
      paymentStatus:  'pending',
      status:         'pending_payment',
      payhereOrderId: null, // set after PayHere responds
    });

    // Generate PayHere hash
    // Format: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
    const merchantId     = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const orderId        = order._id.toString();
    const amount         = total.toFixed(2);
    const currency       = 'LKR';

    const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hashString = `${merchantId}${orderId}${amount}${currency}${secretHash}`;
    const hash       = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    // Update order with the payhereOrderId
    order.payhereOrderId = orderId;
    await order.save();

    res.json({
      orderId,
      merchantId,
      amount,
      currency,
      hash,
      baseUrl:      process.env.PAYHERE_BASE_URL || 'https://sandbox.payhere.lk',
      returnUrl:    `${process.env.CLIENT_URL}/order-success?orderId=${orderId}`,
      cancelUrl:    `${process.env.CLIENT_URL}/checkout?cancelled=true`,
      notifyUrl:    `${process.env.CLIENT_URL?.replace('localhost:5173', 'localhost:5000')}/api/payment/payhere/notify`,
      firstName:    shippingAddress.name.split(' ')[0],
      lastName:     shippingAddress.name.split(' ').slice(1).join(' ') || '.',
      email:        req.user.email,
      phone:        shippingAddress.phone || '0000000000',
      address:      shippingAddress.line1,
      city:         shippingAddress.city,
      country:      shippingAddress.country || 'Sri Lanka',
      itemsDescription: items.map(i => `${i.name} (${i.size})`).join(', '),
    });
  } catch (err) {
    console.error('PayHere initiate error:', err);
    res.status(500).json({ message: err.message });
  }
});


/**
 * POST /api/payment/payhere/notify
 * PayHere posts here after payment (server-to-server notification)
 * This is the SECURE confirmation — not the return URL
 */
router.post('/payhere/notify', async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id,
    } = req.body;

    // Verify the hash from PayHere
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const secretHash     = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const localSig       = crypto.createHash('md5')
      .update(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${secretHash}`)
      .digest('hex')
      .toUpperCase();

    if (localSig !== md5sig) {
      console.error('❌ PayHere hash mismatch — possible fraud attempt');
      return res.status(400).send('Hash mismatch');
    }

    // status_code 2 = success, 0 = pending, -1 = cancelled, -2 = failed, -3 = chargedback
    if (status_code === '2') {
      const order = await Order.findOne({ payhereOrderId: order_id }).populate('user', 'name email');

      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus    = 'paid';
        order.status           = 'processing';
        order.payherePaymentId = payment_id;
        await order.save();

        await decrementStock(order.items);

        if (order.user?.email) {
          await sendOrderConfirmation(order, order.user.email, order.user.name);
        }

        console.log(`✅ PayHere payment confirmed: ${order._id}`);
      }
    } else if (status_code === '-1' || status_code === '-2') {
      await Order.findOneAndUpdate(
        { payhereOrderId: order_id },
        { paymentStatus: 'failed', status: 'cancelled' }
      );
      console.log(`❌ PayHere payment failed/cancelled: ${order_id}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('PayHere notify error:', err);
    res.sendStatus(500);
  }
});


/**
 * GET /api/payment/order/:orderId
 * Poll order status (used by frontend after PayHere redirect)
 */
router.get('/order/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id:  req.params.orderId,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ status: order.status, paymentStatus: order.paymentStatus, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
