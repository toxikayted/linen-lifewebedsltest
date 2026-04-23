require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const authRoutes     = require('./routes/auth');
const productRoutes  = require('./routes/products');
const orderRoutes    = require('./routes/orders');
const preorderRoutes = require('./routes/preorders');
const cartRoutes     = require('./routes/cart');
const adminRoutes    = require('./routes/admin');
const paymentRoutes  = require('./routes/payment');

const app = express();

// ── Stripe webhook needs raw body BEFORE json middleware ──────
app.use('/api/payment/stripe-webhook', express.raw({ type: 'application/json' }));

// ── Standard middleware ───────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/preorders', preorderRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/payment',   paymentRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'OK', brand: 'Linen & Life' }));

// ── MongoDB Connection with detailed logging ──────────────────
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔄 Starting MongoDB connection...');
console.log('📝 Environment check:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Exists (hidden for security)' : '❌ MISSING!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL ERROR: MONGODB_URI is not defined in .env file');
  console.error('💡 Please create a .env file in the backend folder with:');
  console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linen-and-life');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📊 Database name:', mongoose.connection.name);
  console.log('📍 Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Troubleshooting tips:');
  console.error('   1. Check if your MongoDB Atlas cluster is active');
  console.error('   2. Verify username and password in MONGODB_URI');
  console.error('   3. Check if IP address is whitelisted (0.0.0.0/0)');
  console.error('   4. Ensure the database name is correct');
  process.exit(1);
});

// ── Local Development Server ──────────────────────────────────
// Only listen if this file is run directly (not imported by Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌿 Linen & Life API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Products API: http://localhost:${PORT}/api/products`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
}

// ── Export for Vercel Serverless ──────────────────────────────
module.exports = app;