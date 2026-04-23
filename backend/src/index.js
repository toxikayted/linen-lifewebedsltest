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

// ── CORS configuration for production ─────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
  'https://linenandlifewebedsltest.vercel.app',
  'https://linen-and-life.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow anyway for now
    }
  },
  credentials: true
}));
app.use(express.json());

// ── Request logging middleware ────────────────────────────────
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/preorders', preorderRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/payment',   paymentRoutes);

// ── Health check endpoint ─────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ 
  status: 'OK', 
  brand: 'Linen & Life',
  timestamp: new Date().toISOString(),
  mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

// ── Root endpoint ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    message: 'Linen & Life API is running!',
    endpoints: ['/api/products', '/api/health', '/api/auth']
  });
});

// ── Error handling middleware ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// ── MongoDB Connection for Serverless ─────────────────────────
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔄 Starting MongoDB connection...');
console.log('📝 Environment check:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Exists' : '❌ MISSING!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Connection options for serverless
const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
};

// Connect to MongoDB if URI exists
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
      console.log('📊 Database name:', mongoose.connection.name);
      console.log('📍 Host:', mongoose.connection.host);
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('💡 Make sure IP address is whitelisted in MongoDB Atlas');
    });
} else {
  console.error('❌ MONGODB_URI is not defined in environment variables');
}

// ── Export for Vercel Serverless ──────────────────────────────
module.exports = app;

// ── Local development server (only when run directly) ─────────
if (require.main === module && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌿 Linen & Life API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Products API: http://localhost:${PORT}/api/products`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
}