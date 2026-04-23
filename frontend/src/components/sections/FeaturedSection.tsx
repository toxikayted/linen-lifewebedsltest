import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../ui/Reveal'
import ProductCard from '../ui/ProductCard'
import { useCartStore } from '../../context/cartStore'
import type { Product } from '../../types'
import api from '../../lib/api'

// Fallback mock in case API isn't running
const MOCK: Product[] = [
  {
    _id: '1', name: 'Ceylon Breeze Shirt', slug: 'ceylon-breeze-shirt',
    description: 'Woven by master artisans in Colombo.', price: 12500,
    category: 'shirts', images: ['https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800'],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 6 }],
    material: '100% Handwoven Linen', origin: 'Colombo, Sri Lanka',
    isLimited: true, isPreorder: true, totalStock: 30, soldCount: 14,
    nftTier: 'collectors', tags: ['summer'], featured: true, createdAt: '',
  },
  {
    _id: '2', name: 'Kandy Morning Sheet Set', slug: 'kandy-morning-linen-sheet',
    description: 'Misty mornings of the Kandy hills.', price: 28000,
    category: 'home', images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800'],
    sizes: [{ size: 'Queen', stock: 8 }, { size: 'King', stock: 5 }],
    material: '100% Pure Linen', origin: 'Kandy, Sri Lanka',
    isLimited: false, isPreorder: false, totalStock: 50, soldCount: 23,
    nftTier: 'standard', tags: ['home'], featured: true, createdAt: '',
  },
  {
    _id: '3', name: 'Galle Fort Linen Trousers', slug: 'galle-fort-linen-trousers',
    description: 'Tailored in the style of old Galle merchants.', price: 18500,
    category: 'pants', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4e40?w=800'],
    sizes: [{ size: '30', stock: 9 }, { size: '32', stock: 7 }, { size: '34', stock: 3 }],
    material: '100% Washed Linen', origin: 'Galle, Sri Lanka',
    isLimited: true, isPreorder: true, totalStock: 24, soldCount: 8,
    nftTier: 'genesis', tags: ['resort'], featured: true, createdAt: '',
  },
]

export default function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>(MOCK)
  const { addItem } = useCartStore()

  useEffect(() => {
    api.get('/products?featured=true&limit=3')
      .then(r => { if (r.data.products?.length) setProducts(r.data.products) })
      .catch(() => {/* use mock */})
  }, [])

  const handleAdd = (p: Product, size: string) => {
    addItem({ productId: p._id, name: p.name, slug: p.slug, price: p.price, image: p.images[0], size, quantity: 1 })
  }

  return (
    <section className="section bg-[var(--bg)]">
      <div className="container-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <Reveal>
            <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-2">Featured Pieces</p>
            <h2 className="heading-display text-[clamp(2.5rem,5vw,4rem)]">
              This Season's<br /><i>Signature Collection</i>
            </h2>
          </Reveal>
          <Reveal delay={0.2} direction="left">
            <Link to="/collection" className="btn-outline self-start md:self-auto">
              View all <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.12}>
              <ProductCard product={p} onAddToCart={handleAdd} />
            </Reveal>
          ))}
        </div>

        {/* Marquee divider */}
        <div className="mt-20 overflow-hidden border-t border-b border-[var(--border)] py-4">
          <div className="marquee-track">
            {Array(8).fill('HANDWOVEN  ·  HERITAGE  ·  HEIRLOOM  ·  ').map((t, i) => (
              <span key={i} className="mono text-sm text-[var(--text-muted)] tracking-widest uppercase pr-8 whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
