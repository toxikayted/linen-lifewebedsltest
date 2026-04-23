const express = require('express');
const Preorder = require('../models/Preorder');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const preorder = await Preorder.create(req.body);
    res.status(201).json({ message: 'Pre-order registered!', preorder });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const preorders = await Preorder.find().populate('product', 'name slug').sort('-createdAt');
    res.json(preorders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const preorder = await Preorder.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(preorder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
