import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../components/ui/Reveal'
import { ArrowRight } from 'lucide-react'

const EDITORIALS = [
  {
    id: 1,
    issue: 'Issue 01',
    title: 'Morning in Kandy',
    subtitle: 'When mist meets linen',
    body: 'The Kandy hills at 6am are unlike anywhere else. There is a specific quality of light — soft, unhurried, carrying the scent of cinnamon and wet earth — that we tried to weave into this collection.',
    image: 'https://images.unsplash.com/photo-1539786774582-0707555f1f72?w=1200',
    tag: 'ATMOSPHERE',
    color: 'var(--accent-flax)',
  },
  {
    id: 2,
    issue: 'Issue 02',
    title: 'The Weaver\'s Hand',
    subtitle: 'A portrait of craft',
    body: 'We spent three days with Krishanthi, a third-generation weaver from Galle. This is not just documentation — it is a love letter to a disappearing art that we are determined will not disappear.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    tag: 'CRAFT',
    color: 'var(--accent-sage)',
  },
  {
    id: 3,
    issue: 'Issue 03',
    title: 'Colombo After Dark',
    subtitle: 'The night collection',
    body: 'Colombo at midnight has its own dress code. The Colombo Night Jacket was designed for exactly this — the after-hours of the city that never quite sleeps.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
    tag: 'NIGHTLIFE',
    color: 'var(--accent-gold)',
  },
]

export default function EditorialsPage() {
  const [active, setActive] = useState(0)
  const ed = EDITORIALS[active]

  return (
    <main className="pt-28 min-h-screen">
      {/* Featured editorial: large split */}
      <section className="relative h-[80vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={ed.id}
            src={ed.image}
            alt={ed.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/80 via-[var(--bg)]/30 to-transparent" />

        <div className="relative z-10 container-xl h-full flex items-center">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={ed.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="mono text-[10px] tracking-widest uppercase" style={{ color: ed.color }}>{ed.tag}</span>
                  <span className="mono text-[10px] text-[var(--text-muted)]">{ed.issue}</span>
                </div>
                <h1 className="heading-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] mb-3">
                  {ed.title}
                </h1>
                <p className="script text-2xl mb-6" style={{ color: ed.color }}>{ed.subtitle}</p>
                <p className="text-[var(--text-muted)] leading-relaxed max-w-md mb-8">{ed.body}</p>
                <button className="btn-outline">
                  Read Editorial <ArrowRight size={14} />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Issue selector */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {EDITORIALS.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setActive(i)}
              className={`mono text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                i === active ? 'bg-[var(--accent-gold)] border-[var(--accent-gold)] text-[#2C2418]' : 'glass border-[var(--border)] text-[var(--text-muted)]'
              }`}
            >
              {e.issue}
            </button>
          ))}
        </div>
      </section>

      {/* All editorials grid */}
      <section className="section">
        <div className="container-xl">
          <Reveal className="mb-12">
            <h2 className="heading-display text-[clamp(2rem,4vw,3.5rem)]">All Issues</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {EDITORIALS.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.12}>
                <div
                  className="group cursor-pointer"
                  onClick={() => setActive(i)}
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                    <img
                      src={e.image}
                      alt={e.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] mb-1">{e.issue} · {e.tag}</p>
                  <h3 className="heading-display text-xl group-hover:text-[var(--accent-gold)] transition-colors">{e.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{e.subtitle}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
