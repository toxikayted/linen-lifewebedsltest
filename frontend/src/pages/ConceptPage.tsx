import Reveal from '../components/ui/Reveal'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const TIMELINE = [
  { year: '2019', title: 'The Discovery', body: 'Our founder Niroshan Perera walked through a loom workshop in Kandy and witnessed something that would change his life — the rhythm of the handloom, the texture of raw linen, the patience of the weaver.' },
  { year: '2021', title: 'The Collective', body: 'We partnered with 14 artisan families across Colombo, Galle, and Kandy. A quiet agreement: we provide design direction and global distribution. They provide irreplaceable skill.' },
  { year: '2023', title: 'The Digital Layer', body: 'Each piece received a provenance record — a hash linked to the weaver, the date, and the loom. Heritage made legible. The first fashion brand on the island to do this.' },
  { year: '2025', title: 'The Collection', body: 'Linen & Life launches its first public collection. Limited. Authenticated. Permanent.' },
]

export default function ConceptPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <main className="pt-28 min-h-screen">
      {/* Hero */}
      <section className="section">
        <div className="container-xl grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-3">Our Concept</p>
            <h1 className="heading-display text-[clamp(2.5rem,6vw,5.5rem)] mb-6">
              The Story<br />of <i>Linen & Life</i>
            </h1>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-lg">
              We started with a question: what would it look like if Sri Lanka's oldest craft
              met the world's most advanced design tools? The answer became Linen & Life.
            </p>
          </Reveal>

          <Reveal direction="left" delay={0.2}>
            <div ref={containerRef} className="relative h-[500px] overflow-hidden rounded-3xl">
              <motion.img
                style={{ y }}
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900"
                alt="Loom artisan"
                className="w-full h-[130%] object-cover -mt-[15%]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--text-primary)]/40 via-transparent" />
              <div className="absolute bottom-6 left-6 glass-strong rounded-xl p-4">
                <p className="mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Artisan Partners</p>
                <p className="heading-display text-3xl text-[var(--accent-gold)]">14</p>
                <p className="mono text-xs text-[var(--text-muted)]">Families across Sri Lanka</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-[var(--bg-alt)]">
        <div className="container-lg">
          <Reveal className="mb-14">
            <h2 className="heading-display text-[clamp(2rem,4vw,3.5rem)]">
              How We Got Here
            </h2>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)] hidden md:block" />

            <div className="space-y-12">
              {TIMELINE.map(({ year, title, body }, i) => (
                <Reveal key={year} delay={i * 0.1}>
                  <div className="md:flex gap-10 items-start">
                    <div className="flex items-center gap-4 mb-4 md:mb-0 md:w-32 flex-shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--accent-gold)] bg-[var(--bg-alt)] flex-shrink-0" />
                      <span className="mono text-sm font-semibold text-[var(--accent-gold)]">{year}</span>
                    </div>
                    <div>
                      <h3 className="heading-display text-2xl mb-2">{title}</h3>
                      <p className="text-[var(--text-muted)] leading-relaxed max-w-xl">{body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="section">
        <div className="container-xl grid lg:grid-cols-3 gap-8">
          {[
            { n: '0', unit: 'synthetic dyes', label: 'All natural pigments' },
            { n: '100%', unit: 'linen', label: 'Natural, biodegradable' },
            { n: '14', unit: 'artisan families', label: 'Fair-wage partnerships' },
          ].map(({ n, unit, label }, i) => (
            <Reveal key={unit} delay={i * 0.12}>
              <div className="glass rounded-2xl p-8 text-center border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all">
                <p className="heading-display text-[4rem] text-[var(--accent-gold)] leading-none mb-1">{n}</p>
                <p className="mono text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">{unit}</p>
                <p className="text-sm text-[var(--text-muted)]">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}
