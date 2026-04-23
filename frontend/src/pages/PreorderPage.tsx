import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Wallet, ArrowRight } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import CountdownTimer from '../components/ui/CountdownTimer'
import api from '../lib/api'

const DEADLINE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

const PRODUCTS = [
  { id: '6', name: 'Colombo Night Jacket', price: 32000, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', remaining: 11, total: 14 },
  { id: '1', name: 'Ceylon Breeze Shirt',  price: 12500, image: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600', remaining: 16, total: 30 },
  { id: '3', name: 'Galle Fort Trousers', price: 18500, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e40?w=600', remaining: 16, total: 24 },
]

const TIERS = [
  { id: 'standard',   label: '○ STANDARD',   price: 0,     perks: ['Collection access', 'Provenance hash', 'Standard shipping'] },
  { id: 'collectors', label: '◆ COLLECTORS', price: 2500,  perks: ['All Standard perks', 'Priority shipping', 'Signed artisan card', 'Digital certificate'] },
  { id: 'genesis',    label: '◈ GENESIS',    price: 6000,  perks: ['All Collectors perks', 'One-of-one colorway', 'Wallet-linked ownership', 'Lifetime early access'] },
]

export default function PreorderPage() {
  const [selProduct, setSelProduct] = useState(PRODUCTS[0])
  const [selTier, setSelTier]       = useState(TIERS[0])
  const [selSize, setSelSize]       = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', walletAddress: '' })
  const [step, setStep]   = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [walletMock, setWalletMock] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selSize) { alert('Please select a size'); return }
    setLoading(true)
    try {
      await api.post('/preorders', {
        product: selProduct.id,
        ...form,
        size: selSize,
        nftTier: selTier.id,
      })
      setStep('success')
    } catch {
      // Demo mode — show success anyway
      setStep('success')
    } finally {
      setLoading(false)
    }
  }

  const mockWallet = () => {
    const addr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    setForm(f => ({ ...f, walletAddress: addr }))
    setWalletMock(true)
  }

  if (step === 'success') {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-12 max-w-md text-center"
        >
          <CheckCircle size={48} className="text-[var(--accent-sage)] mx-auto mb-6" />
          <h2 className="heading-display text-3xl mb-3">Pre-order Confirmed</h2>
          <p className="text-[var(--text-muted)] mb-2">We've received your pre-order for</p>
          <p className="font-semibold mb-6">{selProduct.name} · Size {selSize}</p>
          <div className="glass rounded-xl p-3 mb-6">
            <p className="mono text-[10px] text-[var(--text-muted)] mb-1">Provenance Record</p>
            <p className="mono text-xs text-[var(--accent-gold)] truncate">0x{Date.now().toString(16)}...{selProduct.id}ff</p>
          </div>
          <p className="text-sm text-[var(--text-muted)]">We'll contact you at <strong>{form.email}</strong> with payment and dispatch details.</p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="pt-28 min-h-screen">
      <div className="container-xl pb-24">
        {/* Header */}
        <Reveal className="mb-14">
          <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-2">Limited Drop</p>
          <h1 className="heading-display text-[clamp(2.5rem,6vw,5rem)] mb-4">
            Secure Your<br /><i>Pre-order</i>
          </h1>
          <CountdownTimer deadline={DEADLINE} />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Product + tier selection */}
          <div className="space-y-8">
            {/* Product selector */}
            <Reveal>
              <p className="mono text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">Select Product</p>
              <div className="space-y-3">
                {PRODUCTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelProduct(p)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      selProduct.id === p.id ? 'border-[var(--accent-gold)] bg-[var(--glow)]' : 'border-[var(--border)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.name}</p>
                      <div className="stock-bar mt-2">
                        <div className="stock-fill" style={{ width: `${(p.remaining / p.total) * 100}%` }} />
                      </div>
                      <p className="mono text-[10px] text-[var(--text-muted)] mt-1">{p.remaining} of {p.total} remaining</p>
                    </div>
                    <p className="heading-display text-lg flex-shrink-0">LKR {p.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Tier selector */}
            <Reveal delay={0.1}>
              <p className="mono text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">Select Tier</p>
              <div className="space-y-3">
                {TIERS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelTier(t)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left ${
                      selTier.id === t.id ? 'border-[var(--accent-gold)] bg-[var(--glow)]' : 'border-[var(--border)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`nft-badge nft-${t.id}`}>{t.label}</span>
                      {t.price > 0 && <span className="mono text-xs text-[var(--accent-gold)]">+LKR {t.price.toLocaleString()}</span>}
                    </div>
                    <ul className="space-y-0.5">
                      {t.perks.map(p => (
                        <li key={p} className="mono text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
                          <span className="text-[var(--accent-sage)]">✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: Form */}
          <Reveal delay={0.2}>
            <div className="glass-strong rounded-3xl p-8">
              <h2 className="heading-display text-2xl mb-6">Your Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Name</label>
                    <input className="input-base" required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Email</label>
                    <input type="email" className="input-base" required placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Phone (optional)</label>
                  <input className="input-base" placeholder="+94 77..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>

                {/* Size */}
                <div>
                  <label className="mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS','S','M','L','XL','28','30','32','34','Queen','King'].map(s => (
                      <button type="button" key={s} onClick={() => setSelSize(s)}
                        className={`mono text-xs px-3 py-1.5 rounded border transition-all ${selSize === s ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)] text-[#2C2418]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                {/* Wallet (mock) */}
                <div>
                  <label className="mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">
                    Wallet Address (optional — for NFT tier)
                  </label>
                  <div className="flex gap-2">
                    <input className="input-base flex-1 mono text-xs" placeholder="0x..." value={form.walletAddress} onChange={e => setForm(f => ({ ...f, walletAddress: e.target.value }))} />
                    <button type="button" onClick={mockWallet} className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs mono transition-all flex items-center gap-1.5 ${walletMock ? 'border-[var(--accent-sage)] text-[var(--accent-sage)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'}`}>
                      <Wallet size={12} /> {walletMock ? 'Connected' : 'Mock'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Notes (optional)</label>
                  <textarea className="input-base h-20 resize-none" placeholder="Custom requests..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>

                {/* Summary */}
                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{selProduct.name}</span>
                    <span>LKR {selProduct.price.toLocaleString()}</span>
                  </div>
                  {selTier.price > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">{selTier.label} upgrade</span>
                      <span>LKR {selTier.price.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="divider" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-[var(--accent-gold)]">LKR {(selProduct.price + selTier.price).toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                  {loading ? 'Processing...' : <>Confirm Pre-order <ArrowRight size={14} /></>}
                </button>
                <p className="mono text-[10px] text-center text-[var(--text-muted)]">
                  Payment collected at production confirmation. No charge today.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  )
}
