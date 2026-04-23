import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Box, ShoppingBag } from 'lucide-react'
import { Product3DCanvas } from '../3d/LinenCanvas'
import { formatLKR, stockPercent, nftLabel, remainingStock } from '../../lib/utils'
import type { Product } from '../../types'

interface Props {
  product: Product
  onAddToCart?: (product: Product, size: string) => void
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const cardRef   = useRef<HTMLDivElement>(null)
  const [show3D, setShow3D]     = useState(false)
  const [selSize, setSelSize]   = useState('')
  const [hovered, setHovered]   = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -16
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateZ(8px)`
    }
  }
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
    setHovered(false)
  }

  const remaining = remainingStock(product.soldCount, product.totalStock)
  const stockPct  = stockPercent(product.soldCount, product.totalStock)

  return (
    <div
      ref={cardRef}
      className="tilt-card rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-card dark:shadow-card-dark transition-all duration-300 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      {/* Image / 3D area */}
      <div className="relative aspect-[4/5] bg-[var(--bg-alt)] overflow-hidden">
        <AnimatePresence>
          {show3D ? (
            <motion.div
              key="3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Product3DCanvas />
            </motion.div>
          ) : (
            <motion.img
              key="img"
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isLimited && (
            <span className="mono text-[10px] bg-[var(--accent-gold)] text-[#2C2418] px-2 py-0.5 rounded-full font-semibold tracking-wide">
              LIMITED
            </span>
          )}
          {product.isPreorder && (
            <span className="mono text-[10px] bg-[var(--accent-sage)] bg-opacity-20 text-[var(--accent-sage)] px-2 py-0.5 rounded-full border border-[var(--accent-sage)] border-opacity-30">
              PRE-ORDER
            </span>
          )}
        </div>

        {/* NFT tier */}
        <div className="absolute top-3 right-3">
          <span className={`nft-badge nft-${product.nftTier}`}>{nftLabel(product.nftTier)}</span>
        </div>

        {/* 3D toggle */}
        <button
          onClick={() => setShow3D(v => !v)}
          className="absolute bottom-3 right-3 glass text-[10px] mono px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:border-[var(--accent-gold)]"
        >
          <Box size={10} />
          {show3D ? '2D' : '3D'}
        </button>

        {/* Tx hash overlay */}
        <div className="tx-hash-parent absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="tx-hash text-white/60 truncate">
            0x{product._id?.slice(0,8)}...{product._id?.slice(-8)}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="heading-display text-lg hover:text-[var(--accent-gold)] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-[var(--text-muted)] mb-3">{product.origin} · {product.material}</p>

        {/* Stock bar */}
        {product.isLimited && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="mono text-[10px] text-[var(--text-muted)]">
                {remaining} of {product.totalStock} remaining
              </span>
              <span className="mono text-[10px] text-[var(--accent-gold)]">{100 - stockPct}% left</span>
            </div>
            <div className="stock-bar">
              <div className="stock-fill" style={{ width: `${100 - stockPct}%` }} />
            </div>
          </div>
        )}

        {/* Size selector (inline quick-add) */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sizes.map(({ size, stock }) => (
            <button
              key={size}
              onClick={() => setSelSize(size)}
              disabled={stock === 0}
              className={`text-[11px] mono px-2 py-0.5 rounded border transition-all ${
                selSize === size
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)] text-[#2C2418]'
                  : stock === 0
                    ? 'border-[var(--border)] text-[var(--text-muted)] opacity-40 cursor-not-allowed line-through'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Price + add */}
        <div className="flex items-center justify-between">
          <p className="heading-display text-xl">{formatLKR(product.price)}</p>
          <button
            onClick={() => {
              if (!selSize) { alert('Please select a size'); return }
              onAddToCart?.(product, selSize)
            }}
            className="btn-primary text-xs py-2 px-4"
          >
            <ShoppingBag size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
