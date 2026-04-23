export const formatLKR = (n: number) =>
  new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n)

export const shortHash = (seed?: string) => {
  const chars = '0123456789abcdef'
  let hash = seed ? seed.slice(0, 2) : '0x'
  for (let i = 0; i < 62; i++) hash += chars[Math.floor(Math.random() * chars.length)]
  return hash
}

export const stockPercent = (sold: number, total: number) =>
  Math.min(100, Math.round((sold / total) * 100))

export const remainingStock = (sold: number, total: number) => total - sold

export const nftLabel = (tier: string) => {
  if (tier === 'genesis')    return '◈ GENESIS'
  if (tier === 'collectors') return '◆ COLLECTORS'
  return '○ STANDARD'
}

export const categoryLabel = (cat: string) => ({
  shirts: 'Shirts & Tops',
  pants:  'Trousers',
  home:   'Home Linen',
  accessories: 'Accessories',
  blazers: 'Blazers & Jackets',
}[cat] ?? cat)
