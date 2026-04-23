import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useCartStore } from '../context/cartStore'
import api from '../lib/api'

/**
 * PayHere redirects to /order-success?orderId=xxx after payment.
 * We poll the backend to confirm the payment status.
 * (The actual order confirmation happens server-to-server via /notify)
 */
export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderId  = params.get('orderId')
  const { clearCart } = useCartStore()

  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'failed'>('loading')
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!orderId) { setStatus('failed'); return }

    // Poll up to 10 times (PayHere notify can take a few seconds)
    const poll = async () => {
      try {
        const r = await api.get(`/payment/order/${orderId}`)
        if (r.data.paymentStatus === 'paid') {
          setStatus('paid')
          clearCart()
        } else if (attempts >= 10) {
          setStatus('pending') // Notify might be delayed — show pending
        } else {
          setAttempts(a => a + 1)
          setTimeout(poll, 2000)
        }
      } catch {
        setStatus('failed')
      }
    }
    poll()
  }, [orderId])

  if (status === 'loading') {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="heading-display text-2xl">Confirming your payment…</p>
          <p className="text-[var(--text-muted)] mono text-sm">Please don't close this window</p>
        </div>
      </main>
    )
  }

  if (status === 'paid') {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-10 max-w-md w-full text-center"
        >
          <CheckCircle size={56} className="text-[var(--accent-sage)] mx-auto mb-6" />
          <h2 className="heading-display text-3xl mb-2">Payment Successful!</h2>
          <p className="text-[var(--text-muted)] mb-6">
            Your order is confirmed. A confirmation email has been sent to you.
          </p>
          {orderId && (
            <div className="glass rounded-xl p-4 mb-6">
              <p className="mono text-[10px] text-[var(--text-muted)] mb-1">Order Reference</p>
              <p className="mono text-sm text-[var(--accent-gold)]">#{orderId.slice(-10).toUpperCase()}</p>
            </div>
          )}
          <div className="flex gap-3">
            <Link to="/account" className="btn-outline flex-1 justify-center text-sm">View Orders</Link>
            <Link to="/collection" className="btn-gold flex-1 justify-center text-sm">Shop More</Link>
          </div>
        </motion.div>
      </main>
    )
  }

  if (status === 'pending') {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center">
          <Clock size={48} className="text-[var(--accent-gold)] mx-auto mb-6" />
          <h2 className="heading-display text-2xl mb-2">Payment Pending</h2>
          <p className="text-[var(--text-muted)] mb-6">
            Your payment is being processed. We'll email you once it's confirmed — usually within a few minutes.
          </p>
          <Link to="/account" className="btn-outline">Check Order Status</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-28 min-h-screen flex items-center justify-center p-4">
      <div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-6" />
        <h2 className="heading-display text-2xl mb-2">Something went wrong</h2>
        <p className="text-[var(--text-muted)] mb-6">
          We couldn't confirm your payment. If you were charged, please contact us and we'll sort it out immediately.
        </p>
        <Link to="/checkout" className="btn-gold">Try Again</Link>
      </div>
    </main>
  )
}
