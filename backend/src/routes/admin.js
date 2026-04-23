const express = require('express');
const Order = require('../models/Order');
const Preorder = require('../models/Preorder');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', async (req, res) => {
  try {
    const [orders, preorders, products, users] = await Promise.all([
      Order.countDocuments(),
      Preorder.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    res.json({ orders, preorders, products, users, revenue: revenue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(50);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
