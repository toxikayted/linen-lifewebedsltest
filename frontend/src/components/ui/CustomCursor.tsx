import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX  = useMotionValue(-100)
  const cursorY  = useMotionValue(-100)
  const dotX     = useMotionValue(-100)
  const dotY     = useMotionValue(-100)
  const isHover  = useRef(false)
  const scale    = useMotionValue(1)

  const springX = useSpring(cursorX, { stiffness: 120, damping: 20 })
  const springY = useSpring(cursorY, { stiffness: 120, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      dotX.set(e.clientX - 4)
      dotY.set(e.clientY - 4)
    }

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const isClickable = el.closest('a,button,[data-cursor="hover"]')
      if (isClickable && !isHover.current) { isHover.current = true; scale.set(1.8) }
      else if (!isClickable && isHover.current) { isHover.current = false; scale.set(1) }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [cursorX, cursorY, dotX, dotY, scale])

  // Only show on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998] w-8 h-8 rounded-full border border-[var(--accent-gold)] mix-blend-difference"
        style={{ x: springX, y: springY, scale }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-2 h-2 rounded-full bg-[var(--accent-gold)]"
        style={{ x: dotX, y: dotY }}
      />
    </>
  )
}
