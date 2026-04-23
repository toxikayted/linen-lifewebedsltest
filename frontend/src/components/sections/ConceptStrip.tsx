import Reveal from '../ui/Reveal'
import { Leaf, Zap, Globe } from 'lucide-react'

const pillars = [
  {
    icon: Leaf,
    title: 'Heritage Craft',
    body: 'Every thread passes through hands that have woven linen for generations. Our artisans in Colombo, Kandy, and Galle carry forward a tradition older than the colonial forts.',
    accent: 'sage',
  },
  {
    icon: Globe,
    title: 'Island Origin',
    body: 'Sourced from Sri Lankan flax fields and dyed with natural pigments from Ceylon spices — turmeric, indigo, cinnamon bark — each piece is an atlas of this island.',
    accent: 'gold',
  },
  {
    icon: Zap,
    title: 'Digital Permanence',
    body: 'Every limited-edition piece is registered with a provenance hash. Collect the garment, own the record. Heritage made permanent by technology.',
    accent: 'sage',
  },
]

export default function ConceptStrip() {
  return (
    <section className="section bg-[var(--bg-alt)]">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: image collage */}
          <Reveal direction="right">
            <div className="relative h-[480px]">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700"
                  alt="Loom weaving"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-2xl overflow-hidden shadow-card border-4 border-[var(--bg-alt)]">
                <img
                  src="https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=500"
                  alt="Linen texture"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 glass-strong rounded-2xl p-4 max-w-[140px]">
                <p className="heading-display text-3xl text-[var(--accent-gold)]">100%</p>
                <p className="mono text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Handwoven<br />Sri Lanka</p>
              </div>
            </div>
          </Reveal>

          {/* Right: text */}
          <div>
            <Reveal>
              <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-3">Our Concept</p>
              <h2 className="heading-display text-[clamp(2rem,4vw,3.5rem)] mb-6">
                The Island's Thread,<br /><i>Rewoven for Today</i>
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                Linen & Life was born from a simple belief: that the most advanced material in the world
                is one that has been perfected over centuries by human hands. We bring Sri Lanka's ancient
                linen tradition into a new era — without losing a single thread of its soul.
              </p>
            </Reveal>

            <div className="space-y-6">
              {pillars.map(({ icon: Icon, title, body, accent }, i) => (
                <Reveal key={title} delay={i * 0.15}>
                  <div className="flex gap-4 group">
                    <div className={`w-10 h-10 flex-shrink-0 glass rounded-xl flex items-center justify-center border-[var(--border)] group-hover:border-[var(--accent-${accent})] transition-all`}>
                      <Icon size={16} className={`text-[var(--accent-${accent})]`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{title}</p>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
