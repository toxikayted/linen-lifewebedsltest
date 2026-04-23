import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Sun, Moon, Menu, X, Wallet } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useCartStore } from '../../context/cartStore'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { to: '/collection', label: 'Collection' },
  { to: '/concept',    label: 'Concept' },
  { to: '/editorials', label: 'Editorials' },
  { to: '/lookbook',   label: 'Lookbook' },
]

export default function Navbar() {
  const { toggleTheme, isDark } = useTheme()
  const { itemCount, openCart } = useCartStore()
  const { user } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddr, setWalletAddr] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const mockConnectWallet = () => {
    if (walletConnected) { setWalletConnected(false); setWalletAddr(''); return }
    // Mock wallet address
    const addr = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...'
    setWalletConnected(true)
    setWalletAddr(addr)
  }

  const count = itemCount()

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-card py-3' : 'py-6 bg-transparent'
        }`}
      >
        <div className="container-xl flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 border border-[var(--accent-gold)] rounded-sm flex items-center justify-center">
              <span className="text-[var(--accent-gold)] text-xs font-mono font-semibold">L</span>
            </div>
            <span className="heading-display text-xl tracking-wide text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
              Linen <span className="italic">&amp;</span> Life
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm tracking-wider uppercase transition-colors duration-200 hover:text-[var(--accent-gold)] ${
                  location.pathname === to
                    ? 'text-[var(--accent-gold)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Wallet connect */}
            <button
              onClick={mockConnectWallet}
              className={`hidden lg:flex items-center gap-2 text-xs mono px-3 py-1.5 rounded-full transition-all ${
                walletConnected
                  ? 'bg-[var(--accent-sage)] bg-opacity-15 text-[var(--accent-sage)] border border-[var(--accent-sage)] border-opacity-40'
                  : 'glass border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]'
              }`}
            >
              <Wallet size={12} />
              {walletConnected ? walletAddr : 'Connect'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full glass hover:border-[var(--accent-gold)] transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="text-[var(--accent-flax)]" /> : <Moon size={16} className="text-[var(--text-muted)]" />}
            </button>

            {/* Cart */}
            <button
              onClick={() => openCart()}
              className="relative w-9 h-9 flex items-center justify-center rounded-full glass hover:border-[var(--accent-gold)] transition-all"
            >
              <ShoppingBag size={16} className="text-[var(--text-primary)]" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-gold)] text-[#2C2418] text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </button>

            {/* Account / preorder CTA */}
            <Link to="/preorder" className="hidden md:block btn-gold text-sm py-2 px-4 !rounded-full">
              Pre-order
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center"
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 glass-strong flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="heading-display text-4xl text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link to="/preorder" className="btn-gold mt-4">Pre-order Now</Link>
            <Link to={user ? '/account' : '/login'} className="text-sm text-[var(--text-muted)]">
              {user ? user.name : 'Sign In'}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
