const mongoose = require('mongoose');

const preorderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  phone: String,
  notes: String,
  status: { type: String, enum: ['pending', 'confirmed', 'fulfilled', 'cancelled'], default: 'pending' },
  depositPaid: { type: Boolean, default: false },
  stripePaymentIntentId: String,
  nftTier: { type: String, enum: ['standard', 'collectors', 'genesis'], default: 'standard' },
  walletAddress: String,
}, { timestamps: true });

module.exports = mongoose.model('Preorder', preorderSchema);
