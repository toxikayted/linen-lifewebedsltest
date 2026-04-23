import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ui/ProductCard'
import Reveal from '../components/ui/Reveal'
import { useCartStore } from '../context/cartStore'
import type { Product } from '../types'
import api from '../lib/api'
import { categoryLabel } from '../lib/utils'

const CATS = ['all', 'shirts', 'pants', 'home', 'accessories']

const MOCK_ALL: Product[] = [
  { _id: '1', name: 'Ceylon Breeze Shirt', slug: 'ceylon-breeze-shirt', description: 'Handwoven in Colombo.', price: 12500, category: 'shirts', images: ['https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600'], sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }], material: '100% Handwoven Linen', origin: 'Colombo, Sri Lanka', isLimited: true, isPreorder: true, totalStock: 30, soldCount: 14, nftTier: 'collectors', tags: [], featured: true, createdAt: '' },
  { _id: '2', name: 'Kandy Morning Sheet Set', slug: 'kandy-morning-linen-sheet', description: 'Kandy hills linen.', price: 28000, category: 'home', images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600'], sizes: [{ size: 'Queen', stock: 8 }], material: '100% Pure Linen', origin: 'Kandy, Sri Lanka', isLimited: false, isPreorder: false, totalStock: 50, soldCount: 23, nftTier: 'standard', tags: [], featured: true, createdAt: '' },
  { _id: '3', name: 'Galle Fort Trousers', slug: 'galle-fort-linen-trousers', description: 'Wide-leg linen trousers.', price: 18500, category: 'pants', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4e40?w=600'], sizes: [{ size: '30', stock: 9 }, { size: '32', stock: 7 }], material: '100% Washed Linen', origin: 'Galle, Sri Lanka', isLimited: true, isPreorder: true, totalStock: 24, soldCount: 8, nftTier: 'genesis', tags: [], featured: true, createdAt: '' },
  { _id: '4', name: 'Ella Mist Kurta', slug: 'ella-mist-kurta', description: 'Hand-dyed linen kurta.', price: 14500, category: 'shirts', images: ['https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=600'], sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 10 }], material: 'Hand-dyed Linen', origin: 'Ella, Sri Lanka', isLimited: false, isPreorder: false, totalStock: 40, soldCount: 16, nftTier: 'standard', tags: [], featured: false, createdAt: '' },
  { _id: '5', name: 'Sigiriya Stone Throw', slug: 'sigiriya-stone-throw', description: 'Handloomed throw blanket.', price: 22000, category: 'home', images: ['https://images.unsplash.com/photo-1588528402605-1f4ea7b7df4e?w=600'], sizes: [{ size: 'Standard', stock: 20 }], material: '70% Linen, 30% Cotton', origin: 'Dambulla, Sri Lanka', isLimited: false, isPreorder: false, totalStock: 30, soldCount: 11, nftTier: 'standard', tags: [], featured: false, createdAt: '' },
  { _id: '6', name: 'Colombo Night Jacket', slug: 'colombo-night-jacket', description: 'Sea-ink blue linen jacket.', price: 32000, category: 'shirts', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'], sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 5 }], material: '100% Belgian Linen', origin: 'Colombo, Sri Lanka', isLimited: true, isPreorder: true, preorderDeadline: new Date(Date.now() + 14 * 86400000).toISOString(), totalStock: 14, soldCount: 3, nftTier: 'genesis', tags: [], featured: true, createdAt: '' },
]

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_ALL)
  const [cat, setCat]     = useState('all')
  const [sort, setSort]   = useState('default')
  const { addItem } = useCartStore()

  useEffect(() => {
    const params = cat !== 'all' ? `?category=${cat}` : ''
    api.get(`/products${params}`)
      .then(r => { if (r.data.products?.length) setProducts(r.data.products) })
      .catch(() => {})
  }, [cat])

  const displayed = [...products]
    .filter(p => cat === 'all' || p.category === cat)
    .sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : 0)

  const handleAdd = (p: Product, size: string) =>
    addItem({ productId: p._id, name: p.name, slug: p.slug, price: p.price, image: p.images[0], size, quantity: 1 })

  return (
    <main className="pt-28 min-h-screen">
      <div className="container-xl">
        {/* Header */}
        <Reveal className="mb-12">
          <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-2">The Collection</p>
          <h1 className="heading-display text-[clamp(2.5rem,6vw,5rem)]">
            Sri Lankan Linen,<br /><i>Curated by Season</i>
          </h1>
        </Reveal>

        {/* Filter bar */}
        <Reveal delay={0.1} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`mono text-xs px-4 py-2 rounded-full border transition-all ${
                  cat === c
                    ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'
                }`}
              >
                {c === 'all' ? 'All' : categoryLabel(c)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-base w-auto text-sm"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </Reveal>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24"
          >
            {displayed.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.05}>
                <ProductCard product={p} onAddToCart={handleAdd} />
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
