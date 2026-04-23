import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'

const LinenHeroCanvas = lazy(() => import('../3d/LinenCanvas'))

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--bg)]">
      {/* Soft radial gradient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[var(--accent-flax)] opacity-10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent-sage)] opacity-10 blur-[100px]" />
      </div>

      <div className="container-xl relative z-10 grid md:grid-cols-2 items-center gap-12 pt-32 pb-20">
        {/* Left: Text */}
        <div>
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-[1px] bg-[var(--accent-gold)]" />
            <span className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase">
              2025 Collection · Sri Lanka
            </span>
          </motion.div>

          {/* Main heading */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] text-[var(--text-primary)]"
            >
              Woven
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] italic text-[var(--accent-flax)]"
            >
              by Hand
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="script text-[clamp(1.2rem,3vw,2rem)] text-[var(--accent-sage)]"
            >
              Created for you, this season.
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-[var(--text-muted)] text-base leading-relaxed max-w-sm mb-10"
          >
            A new language for Sri Lankan linen — where heritage looms meet digital precision.
            Limited editions. Handwoven. Permanent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/collection" className="btn-gold">
              Explore Collection <ArrowRight size={16} />
            </Link>
            <Link to="/preorder" className="btn-outline">
              Pre-order Now
            </Link>
          </motion.div>

          {/* Web3 badge row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex items-center gap-3 mt-10"
          >
            <span className="nft-badge nft-genesis">◈ GENESIS DROP OPEN</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-sage)] animate-pulse-soft" />
            <span className="mono text-[10px] text-[var(--text-muted)]">14 of 30 remaining</span>
          </motion.div>
        </div>

        {/* Right: 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative h-[520px] md:h-[640px]"
        >
          {/* Glass card behind canvas */}
          <div className="absolute inset-4 glass rounded-3xl" />

          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[var(--accent-flax)] border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <LinenHeroCanvas />
          </Suspense>

          {/* Floating card: "This Month's Exclusive" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-8 right-4 glass-strong rounded-2xl p-4 w-52"
          >
            <p className="mono text-[10px] text-[var(--accent-gold)] tracking-widest uppercase mb-1">This Month's Exclusive</p>
            <p className="heading-display text-sm font-semibold mb-1">Colombo Night Jacket</p>
            <p className="mono text-[10px] text-[var(--text-muted)] mb-3">14 units · Genesis tier</p>
            <Link to="/preorder" className="flex items-center gap-1 text-xs text-[var(--accent-gold)] hover:underline">
              See more info <ArrowRight size={10} />
            </Link>
          </motion.div>

          {/* Floating card: "LIMITED PRE-ORDERS" */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute top-8 left-0 md:-left-8 glass rounded-2xl p-3 max-w-[160px]"
          >
            <p className="mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Limited Pre-orders</p>
            <p className="heading-display text-sm leading-tight">Own an exclusive piece of Sri Lanka</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">Scroll</p>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={16} className="text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
