import { useRef, useEffect, useState } from 'react'
import { motion, useInView, Variant } from 'framer-motion'

interface Props {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  once?: boolean
}

const variants: Record<string, { hidden: Variant; visible: Variant }> = {
  up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 60 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  none:  { hidden: { opacity: 0 },          visible: { opacity: 1 } },
}

export default function Reveal({ children, delay = 0, direction = 'up', className = '', once = true }: Props) {
  const ref   = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
