import { Link } from 'react-router-dom'
import { Instagram, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-alt)]">
      {/* Marquee */}
      <div className="py-4 border-b border-[var(--border)] overflow-hidden">
        <div className="marquee-track">
          {Array(6).fill('HANDWOVEN IN SRI LANKA  ·  CRAFTED WITH INTENTION  ·  LIMITED EDITIONS  ·  DIGITAL MEETS LOOM  ·  ').map((t, i) => (
            <span key={i} className="mono text-xs text-[var(--text-muted)] tracking-widest uppercase pr-8 whitespace-nowrap">{t}</span>
          ))}
        </div>
      </div>

      <div className="container-xl py-16 grid grid-cols-2 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <p className="heading-display text-2xl mb-3">Linen <i>&amp;</i> Life</p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            Sri Lankan luxury linen where heritage craftsmanship meets Web3 innovation.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 glass rounded-full flex items-center justify-center hover:border-[var(--accent-gold)] transition-all">
                <Icon size={14} className="text-[var(--text-muted)]" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4 mono">Shop</p>
          {['Collection', 'Preorder', 'Lookbook', 'Editorials'].map(l => (
            <Link key={l} to={`/${l.toLowerCase()}`} className="block text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] mb-2 transition-colors">
              {l}
            </Link>
          ))}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4 mono">Info</p>
          {['Concept', 'Sustainability', 'Sizing', 'Care Guide'].map(l => (
            <a key={l} href="#" className="block text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] mb-2 transition-colors">{l}</a>
          ))}
        </div>

        {/* Web3 */}
        <div>
          <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4 mono">Web3</p>
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-muted)]">NFT Pre-order Tiers</p>
            <div className="flex flex-col gap-1">
              <span className="nft-badge nft-standard w-fit">○ STANDARD</span>
              <span className="nft-badge nft-collectors w-fit">◆ COLLECTORS</span>
              <span className="nft-badge nft-genesis w-fit">◈ GENESIS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-6">
        <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--text-muted)] mono">© 2025 Linen &amp; Life. All rights reserved.</p>
          <p className="text-xs text-[var(--text-muted)] mono">Made in Sri Lanka 🌿</p>
        </div>
      </div>
    </footer>
  )
}
