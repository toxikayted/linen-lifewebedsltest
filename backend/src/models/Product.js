const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size:  { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, enum: ['shirts', 'pants', 'home', 'accessories', 'blazers'], required: true }, // Added 'blazers'
  images:      [String],
  sizes:       [sizeStockSchema],

  material: { type: String, default: '100% Handwoven Linen' },
  origin:   { type: String, default: 'Sri Lanka' },

  // Stock management
  totalStock:  { type: Number, required: true },
  soldCount:   { type: Number, default: 0 },
  isInStock:   { type: Boolean, default: true },  // auto-managed

  // Product type
  isLimited:  { type: Boolean, default: false },
  isPreorder: { type: Boolean, default: false },   // true = pre-order only drop
  preorderDeadline: Date,

  // Web3 / NFT tier (UI only)
  nftTier: { type: String, enum: ['standard', 'collectors', 'genesis'], default: 'standard' },

  tags:     [String],
  featured: { type: Boolean, default: false },
  active:   { type: Boolean, default: true },  // soft delete / hide from store
}, { timestamps: true });

// Auto-update isInStock based on totalStock and soldCount
productSchema.pre('save', function(next) {
  this.isInStock = (this.totalStock - this.soldCount) > 0;
  next();
});

module.exports = mongoose.model('Product', productSchema);