import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string) => void
  updateQty: (productId: string, size: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(i => i.productId === item.productId && i.size === item.size)
        if (existing) {
          set(s => ({ items: s.items.map(i =>
            i.productId === item.productId && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )}))
        } else {
          set(s => ({ items: [...s.items, item] }))
        }
        set({ isOpen: true })
      },

      removeItem: (productId, size) =>
        set(s => ({ items: s.items.filter(i => !(i.productId === productId && i.size === size)) })),

      updateQty: (productId, size, qty) =>
        set(s => ({ items: s.items.map(i =>
          i.productId === productId && i.size === size ? { ...i, quantity: qty } : i
        ).filter(i => i.quantity > 0) })),

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'll-cart' }
  )
)
