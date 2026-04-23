export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  category: 'shirts' | 'pants' | 'home' | 'accessories'
  images: string[]
  sizes: { size: string; stock: number }[]
  material: string
  origin: string
  isLimited: boolean
  isPreorder: boolean
  preorderDeadline?: string
  totalStock: number
  soldCount: number
  nftTier: 'standard' | 'collectors' | 'genesis'
  tags: string[]
  featured: boolean
  createdAt: string
}

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  size: string
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  walletAddress?: string
}

export interface Order {
  _id: string
  items: CartItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shippingCost: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  txHash?: string
  createdAt: string
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  postalCode: string
  country: string
}

export interface Preorder {
  product: string
  email: string
  name: string
  size: string
  phone?: string
  notes?: string
  nftTier?: 'standard' | 'collectors' | 'genesis'
  walletAddress?: string
}
