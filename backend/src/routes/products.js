const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Mock seed data — run GET /api/products/seed to populate
const SEED_PRODUCTS = [
  {
    name: 'Ceylon Breeze Blazer',
    slug: 'ceylon-breeze-blazer',
    description: 'Woven by master artisans in Colombo, this blazer captures the coastal wind of Ceylon. Ultra-lightweight, 100% handwoven linen with a heritage stripe motif.',
    price: 12500,
    category: 'blazers',
    images: ['https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNsb3RoaW5nfGVufDB8fDB8fHww', 'https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNsb3RoaW5nfGVufDB8fDB8fHww'],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 4 }],
    material: '100% Handwoven Linen',
    origin: 'Colombo, Sri Lanka',
    isLimited: true,
    isPreorder: true,
    totalStock: 30,
    soldCount: 14,
    nftTier: 'collectors',
    tags: ['summer', 'coastal', 'heritage'],
    featured: true,
  },
  {
    name: 'Kandy Morning Linen Sheet dress',
    slug: 'kandy-morning-linen-dress',
    description: 'Inspired by the misty mornings of the Kandy hills. A 4-piece sheet set in earth linen tones, woven with traditional Kandyan loom patterns. Softer with every wash.',
    price: 2800,
    category: 'home',
    images: ['https://plus.unsplash.com/premium_photo-1661686846030-b1d80f9dcdf4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://plus.unsplash.com/premium_photo-1661686846030-b1d80f9dcdf4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    sizes: [{ size: 'Twin', stock: 10 }, { size: 'Queen', stock: 8 }, { size: 'King', stock: 5 }],
    material: '100% Pure Linen, 180 TC',
    origin: 'Kandy, Sri Lanka',
    isLimited: false,
    isPreorder: false,
    totalStock: 50,
    soldCount: 23,
    nftTier: 'standard',
    tags: ['home', 'bedding', 'kandy'],
    featured: true,
  },
  {
    name: 'Galle Fort Linen Trousers',
    slug: 'galle-fort-linen-trousers',
    description: 'Tailored in the style of old Galle merchants — relaxed, wide-leg linen trousers with a modern cut. A piece that ages like the walls of the Fort itself.',
    price: 18500,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1774005906455-3778bbe0ac00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxpbmVuJTIwdHJvdXNlcnN8ZW58MHx8MHx8fDA%3D', 'https://images.unsplash.com/photo-1774005906455-3778bbe0ac00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxpbmVuJTIwdHJvdXNlcnN8ZW58MHx8MHx8fDA%3D'],
    sizes: [{ size: '28', stock: 5 }, { size: '30', stock: 9 }, { size: '32', stock: 7 }, { size: '34', stock: 3 }],
    material: '100% Washed Linen',
    origin: 'Galle, Sri Lanka',
    isLimited: true,
    isPreorder: true,
    totalStock: 24,
    soldCount: 8,
    nftTier: 'genesis',
    tags: ['resort', 'tailored', 'galle'],
    featured: true,
  },
  {
    name: 'Ella Mist Kurta',
    slug: 'ella-mist-kurta',
    description: 'A contemporary take on the traditional kurta, crafted from hand-dyed linen in Ella mist grey. Loose, breathable, effortlessly poetic.',
    price: 14500,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1610035108052-74195fc6a986?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGluZW4lMjBrdXJ0YXxlbnwwfHwwfHx8MA%3D%3D'],
    sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 }],
    material: 'Hand-dyed Linen',
    origin: 'Ella, Sri Lanka',
    isLimited: false,
    isPreorder: false,
    totalStock: 40,
    soldCount: 16,
    nftTier: 'standard',
    tags: ['kurta', 'heritage', 'ella'],
    featured: false,
  },
  {
    name: 'Sigiriya Stone Throw Blanket',
    slug: 'sigiriya-stone-throw',
    description: 'A textural masterpiece in earthy terracotta and ash tones, handloomed at the base of Sigiriya rock. Oversized and generously weighted.',
    price: 22000,
    category: 'home',
    images: ['https://plus.unsplash.com/premium_photo-1670512215279-7bbb677d52de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmxhbmtldHxlbnwwfHwwfHx8MA%3D%3D'],
    sizes: [{ size: 'Standard', stock: 20 }],
    material: '70% Linen, 30% Cotton',
    origin: 'Dambulla, Sri Lanka',
    isLimited: false,
    isPreorder: false,
    totalStock: 30,
    soldCount: 11,
    nftTier: 'standard',
    tags: ['home', 'throw', 'sigiriya'],
    featured: false,
  },
  {
    name: 'Colombo Night Linen Jacket',
    slug: 'colombo-night-jacket',
    description: 'For the streets of Colombo at dusk. An unlined, unstructured linen jacket in deep sea-ink blue with hand-stitched details. Pre-order exclusive — Genesis tier.',
    price: 32000,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1738052950965-5336c6abb1cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGluZW4lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D'],
    sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 5 }, { size: 'L', stock: 4 }, { size: 'XL', stock: 2 }],
    material: '100% Belgian Linen (Sri Lankan Craftsmanship)',
    origin: 'Colombo, Sri Lanka',
    isLimited: true,
    isPreorder: true,
    preorderDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    totalStock: 14,
    soldCount: 3,
    nftTier: 'genesis',
    tags: ['jacket', 'evening', 'limited'],
    featured: true,
  },
];

router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(SEED_PRODUCTS);
    res.json({ message: `Seeded ${products.length} products`, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, featured, isPreorder, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (isPreorder === 'true') filter.isPreorder = true;
    const products = await Product.find(filter).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
