// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ... (keep all your route imports: authRoutes, productRoutes, etc.) ...
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
// ... import all your other routes ...

const app = express();

// --- Middleware ---
// (Keep your existing middleware setup: cors, express.json, raw body for webhook, etc.)

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// ... use all your other routes ...

// --- Simple Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// --- MongoDB Connection ---
// Connect to MongoDB, but DO NOT block the request.
// The first request will trigger the connection.
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ THIS IS THE CRITICAL CHANGE FOR VERCEL
// Do NOT add app.listen() here. Just export the app.
module.exports = app;