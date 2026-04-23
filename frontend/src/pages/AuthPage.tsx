import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/ui/Reveal'

export default function AuthPage() {
  const [mode, setMode]   = useState<'login' | 'register'>('login')
  const [form, setForm]   = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register }   = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      navigate('/account')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-28 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Reveal>
          <div className="glass-strong rounded-3xl p-10">
            <div className="text-center mb-8">
              <p className="heading-display text-3xl mb-1">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {mode === 'login' ? 'Sign in to your Linen & Life account' : 'Join the Linen & Life community'}
              </p>
            </div>

            {/* Tab toggle */}
            <div className="flex glass rounded-full p-1 mb-8">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className={`flex-1 py-2 rounded-full mono text-xs transition-all ${mode === m ? 'bg-[var(--text-primary)] text-[var(--bg)]' : 'text-[var(--text-muted)]'}`}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {mode === 'register' && (
                  <div>
                    <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Name</label>
                    <input className="input-base" required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                )}
                <div>
                  <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Email</label>
                  <input type="email" className="input-base" required placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Password</label>
                  <input type="password" className="input-base" required placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>

                {error && (
                  <p className="mono text-xs text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>
                )}

                <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                  {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
