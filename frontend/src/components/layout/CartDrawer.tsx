import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../context/cartStore'
import { formatLKR } from '../../lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCartStore()
  const cartTotal = total()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-[51] w-full max-w-md glass-strong flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--accent-gold)]" />
                <span className="heading-display text-xl">Your Bag</span>
                <span className="mono text-xs text-[var(--text-muted)]">({items.length})</span>
              </div>
              <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-alt)] transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={40} className="text-[var(--text-muted)] opacity-40" />
                  <p className="heading-display text-2xl text-[var(--text-muted)]">Your bag is empty</p>
                  <p className="text-sm text-[var(--text-muted)]">Explore our handwoven collection</p>
                  <Link to="/collection" onClick={closeCart} className="btn-gold mt-2">
                    Shop Collection
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.size}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)]"
                  >
                    {/* Image */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="heading-display text-base font-medium truncate">{item.name}</p>
                      <p className="mono text-xs text-[var(--text-muted)] mb-2">Size: {item.size}</p>
                      <p className="text-[var(--accent-gold)] font-semibold text-sm">{formatLKR(item.price)}</p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.productId, item.size, item.quantity - 1)}
                            className="w-6 h-6 glass rounded-full flex items-center justify-center hover:border-[var(--accent-gold)] transition-all"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="mono text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
                            className="w-6 h-6 glass rounded-full flex items-center justify-center hover:border-[var(--accent-gold)] transition-all"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--border)] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-muted)]">Subtotal</span>
                  <span className="heading-display text-xl">{formatLKR(cartTotal)}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mono">Shipping calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-gold w-full justify-center text-center"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <button onClick={closeCart} className="btn-outline w-full justify-center text-sm">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
