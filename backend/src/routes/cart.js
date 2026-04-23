const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Cart is managed client-side; this endpoint validates items and returns fresh prices
router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, size, quantity }]
    const validated = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const sizeObj = product.sizes.find(s => s.size === item.size);
      validated.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        size: item.size,
        quantity: item.quantity,
        available: sizeObj ? sizeObj.stock >= item.quantity : false,
      });
    }
    res.json({ items: validated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
