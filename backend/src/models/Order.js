const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  price:    Number,
  quantity: Number,
  size:     String,
  image:    String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],

  shippingAddress: {
    name:       String,
    line1:      String,
    line2:      String,
    city:       String,
    postalCode: String,
    country:    { type: String, default: 'Sri Lanka' },
    phone:      String,
  },

  subtotal:     { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total:        { type: Number, required: true },

  // Order lifecycle
  status: {
    type: String,
    enum: ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending_payment',
  },

  // Payment
  paymentMethod: { type: String, enum: ['stripe', 'payhere'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },

  // Stripe fields
  stripePaymentIntentId: { type: String, default: null },
  stripeClientSecret:    { type: String, default: null },

  // PayHere fields
  payhereOrderId:   { type: String, default: null },
  payherePaymentId: { type: String, default: null },

  // Fulfilment
  trackingNumber:  { type: String, default: null },
  shippedAt:       { type: Date,   default: null },
  deliveredAt:     { type: Date,   default: null },

  notes: String,
}, { timestamps: true });

// Index for quick lookups by payment IDs
orderSchema.index({ stripePaymentIntentId: 1 });
orderSchema.index({ payhereOrderId: 1 });

module.exports = mongoose.model('Order', orderSchema);
