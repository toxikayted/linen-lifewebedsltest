import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../ui/Reveal'
import CountdownTimer from '../ui/CountdownTimer'

// 14 days from now — in production this would come from the API
const DEADLINE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

const TIERS = [
  { name: 'Standard',   badge: 'nft-standard',   desc: 'Access to the collection + provenance hash', price: '12,500+' },
  { name: 'Collectors', badge: 'nft-collectors',  desc: 'Priority shipping + signed artisan card + digital certificate', price: '18,500+' },
  { name: 'Genesis',    badge: 'nft-genesis',     desc: 'One-of-one colorway + wallet-linked ownership record + early access forever', price: '32,000+' },
]

export default function PreorderCTASection() {
  return (
    <section className="section bg-[var(--bg)]">
      <div className="container-xl">
        {/* Top bar */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <Reveal>
            <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-3">Limited Edition Drop</p>
            <h2 className="heading-display text-[clamp(2.2rem,5vw,4rem)] mb-6">
              Pre-order Before<br /><i>The Loom Closes</i>
            </h2>
            <p className="text-[var(--text-muted)] max-w-sm mb-8">
              Each season we produce a finite number of pieces. Once the loom stops, there are no reprints.
              Pre-order now to guarantee your size and tier.
            </p>
            <CountdownTimer deadline={DEADLINE} />
          </Reveal>

          <Reveal delay={0.2} direction="left">
            <div className="glass-strong rounded-3xl p-8 space-y-4">
              {TIERS.map((tier, i) => (
                <div key={tier.name} className={`p-4 rounded-xl border transition-all group hover:border-[var(--accent-gold)] ${i === 2 ? 'bg-[var(--bg-alt)]' : 'bg-transparent'} border-[var(--border)]`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`nft-badge ${tier.badge}`}>{tier.name.toUpperCase()}</span>
                    </div>
                    <span className="mono text-sm font-semibold text-[var(--accent-gold)]">LKR {tier.price}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{tier.desc}</p>
                </div>
              ))}

              <Link to="/preorder" className="btn-gold w-full justify-center text-center mt-2">
                Secure Your Pre-order <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Full-width editorial image */}
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[520px] group">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400"
              alt="Editorial linen"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--text-primary)] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div>
                <p className="script text-3xl text-white mb-1">Colombo Night Jacket</p>
                <p className="mono text-xs text-white/70 tracking-widest uppercase">Genesis Tier · 14 Remaining</p>
              </div>
              <Link to="/preorder" className="btn-gold hidden md:flex">
                Pre-order <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
