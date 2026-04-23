import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  loadStripe,
  StripeCardElementChangeEvent,
} from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Lock, CheckCircle, AlertCircle, CreditCard, Smartphone } from 'lucide-react'
import { useCartStore } from '../context/cartStore'
import { useAuth } from '../context/AuthContext'
import { formatLKR } from '../lib/utils'
import Reveal from '../components/ui/Reveal'
import api from '../lib/api'

// ── Load Stripe once ──────────────────────────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

// ── Stripe card element styles ────────────────────────────────
const CARD_STYLE = {
  style: {
    base: {
      color: 'var(--text-primary, #2C2418)',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '15px',
      '::placeholder': { color: '#7A6A52' },
      iconColor: '#C4A962',
    },
    invalid: { color: '#e53e3e', iconColor: '#e53e3e' },
  },
}

// ─────────────────────────────────────────────────────────────
// Address form (shared between both payment methods)
// ─────────────────────────────────────────────────────────────
interface Address {
  name: string; line1: string; line2: string
  city: string; postalCode: string; country: string; phone: string
}

interface AddressFormProps {
  addr: Address
  onChange: (a: Address) => void
  onNext: () => void
}

function AddressForm({ addr, onChange, onNext }: AddressFormProps) {
  const set = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...addr, [key]: e.target.value })

  return (
    <form onSubmit={e => { e.preventDefault(); onNext() }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Full Name *</label>
          <input className="input-base" required value={addr.name} onChange={set('name')} placeholder="Niroshan Perera" />
        </div>
        <div className="col-span-2">
          <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Address Line 1 *</label>
          <input className="input-base" required value={addr.line1} onChange={set('line1')} placeholder="123 Galle Road" />
        </div>
        <div className="col-span-2">
          <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Address Line 2</label>
          <input className="input-base" value={addr.line2} onChange={set('line2')} placeholder="Apartment, suite, etc." />
        </div>
        <div>
          <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">City *</label>
          <input className="input-base" required value={addr.city} onChange={set('city')} placeholder="Colombo" />
        </div>
        <div>
          <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Postal Code</label>
          <input className="input-base" value={addr.postalCode} onChange={set('postalCode')} placeholder="00300" />
        </div>
        <div>
          <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Country</label>
          <input className="input-base" value={addr.country} onChange={set('country')} />
        </div>
        <div>
          <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">Phone *</label>
          <input className="input-base" required value={addr.phone} onChange={set('phone')} placeholder="+94 77 000 0000" />
        </div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center">
        Continue to Payment
      </button>
    </form>
  )
}

// ─────────────────────────────────────────────────────────────
// Stripe payment form (inner — must be inside <Elements>)
// ─────────────────────────────────────────────────────────────
interface StripeFormProps {
  cartItems: any[]; shippingAddress: Address
  subtotal: number; shippingCost: number; total: number
  onSuccess: (orderId: string) => void
}

function StripePaymentForm({ cartItems, shippingAddress, subtotal, shippingCost, total, onSuccess }: StripeFormProps) {
  const stripe   = useStripe()
  const elements = useElements()
  const [cardError, setCardError]   = useState('')
  const [cardReady, setCardReady]   = useState(false)
  const [processing, setProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId]       = useState('')

  // Create PaymentIntent on mount
  useEffect(() => {
    api.post('/payment/stripe/create-intent', {
      items: cartItems,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
    }).then(r => {
      setClientSecret(r.data.clientSecret)
      setOrderId(r.data.orderId)
    }).catch(err => {
      setCardError(err.response?.data?.message || 'Could not initiate payment. Please try again.')
    })
  }, [])

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    setCardError(e.error?.message || '')
    setCardReady(e.complete)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return
    setProcessing(true)
    setCardError('')

    const cardEl = elements.getElement(CardElement)
    if (!cardEl) return

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardEl,
        billing_details: {
          name:  shippingAddress.name,
          phone: shippingAddress.phone,
          address: {
            line1:   shippingAddress.line1,
            line2:   shippingAddress.line2 || undefined,
            city:    shippingAddress.city,
            country: 'LK',
            postal_code: shippingAddress.postalCode || undefined,
          },
        },
      },
    })

    if (error) {
      setCardError(error.message || 'Payment failed. Please try again.')
      setProcessing(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(orderId)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card input */}
      <div>
        <label className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-2">Card Details</label>
        <div className="input-base p-4">
          <CardElement options={CARD_STYLE} onChange={handleCardChange} />
        </div>
      </div>

      {cardError && (
        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 rounded-lg p-3">
          <AlertCircle size={14} />
          <p className="mono text-xs">{cardError}</p>
        </div>
      )}

      <div className="glass rounded-xl p-3 flex items-center gap-2">
        <Lock size={12} className="text-[var(--accent-sage)]" />
        <p className="mono text-[10px] text-[var(--text-muted)]">
          Secured by Stripe · 256-bit TLS encryption · PCI DSS compliant
        </p>
      </div>

      {/* Stripe test card hint */}
      {import.meta.env.DEV && (
        <div className="glass rounded-xl p-3 border border-[var(--accent-gold)] border-opacity-30">
          <p className="mono text-[10px] text-[var(--accent-gold)] mb-1">TEST MODE — use card: 4242 4242 4242 4242</p>
          <p className="mono text-[10px] text-[var(--text-muted)]">Any future expiry · Any 3-digit CVC · Any postal code</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !cardReady || processing || !clientSecret}
        className="btn-gold w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#2C2418] border-t-transparent rounded-full animate-spin" />
            Processing payment…
          </span>
        ) : (
          <>
            <Lock size={14} />
            Pay {formatLKR(total)} with Card
          </>
        )}
      </button>
    </form>
  )
}

// ─────────────────────────────────────────────────────────────
// PayHere payment form
// ─────────────────────────────────────────────────────────────
interface PayHereFormProps {
  cartItems: any[]; shippingAddress: Address
  subtotal: number; shippingCost: number; total: number
  onSuccess: (orderId: string) => void
}

function PayHerePaymentForm({ cartItems, shippingAddress, subtotal, shippingCost, total, onSuccess }: PayHereFormProps) {
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [phData, setPhData]     = useState<any>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  // Pre-generate the PayHere data so user just clicks "Pay"
  const initiate = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/payment/payhere/initiate', {
        items: cartItems, shippingAddress, subtotal, shippingCost, total,
      })
      setPhData(r.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { initiate() }, [])

  const handleSubmit = () => {
    // Form submits to PayHere — user is redirected to their hosted page
    // PayHere will POST to our /notify endpoint server-to-server
    if (formRef.current) formRef.current.submit()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-8 gap-2">
      <div className="w-5 h-5 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
      <span className="mono text-xs text-[var(--text-muted)]">Preparing payment…</span>
    </div>
  )

  if (error) return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-red-500 bg-red-500/10 rounded-lg p-3">
        <AlertCircle size={14} />
        <p className="mono text-xs">{error}</p>
      </div>
      <button onClick={initiate} className="btn-outline w-full justify-center text-sm">Try Again</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4 space-y-2">
        <p className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1">You will pay via</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FF6B00] flex items-center justify-center">
            <Smartphone size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">PayHere</p>
            <p className="mono text-[10px] text-[var(--text-muted)]">Visa · Mastercard · Amex · eZ Cash · mCash · FriMi</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-3 flex items-center gap-2">
        <Lock size={12} className="text-[var(--accent-sage)]" />
        <p className="mono text-[10px] text-[var(--text-muted)]">
          You'll be redirected to PayHere's secure hosted page · PCI DSS Level 1
        </p>
      </div>

      {/* Hidden form that submits to PayHere */}
      {phData && (
        <form
          ref={formRef}
          method="POST"
          action={`${phData.baseUrl}/pay/checkout`}
          style={{ display: 'none' }}
        >
          <input name="merchant_id"   value={phData.merchantId}          readOnly />
          <input name="return_url"    value={phData.returnUrl}            readOnly />
          <input name="cancel_url"    value={phData.cancelUrl}            readOnly />
          <input name="notify_url"    value={phData.notifyUrl}            readOnly />
          <input name="order_id"      value={phData.orderId}              readOnly />
          <input name="items"         value={phData.itemsDescription}     readOnly />
          <input name="currency"      value={phData.currency}             readOnly />
          <input name="amount"        value={phData.amount}               readOnly />
          <input name="first_name"    value={phData.firstName}            readOnly />
          <input name="last_name"     value={phData.lastName}             readOnly />
          <input name="email"         value={phData.email}                readOnly />
          <input name="phone"         value={phData.phone}                readOnly />
          <input name="address"       value={phData.address}              readOnly />
          <input name="city"          value={phData.city}                 readOnly />
          <input name="country"       value={phData.country}              readOnly />
          <input name="hash"          value={phData.hash}                 readOnly />
        </form>
      )}

      <button
        onClick={handleSubmit}
        disabled={!phData}
        className="btn-gold w-full justify-center disabled:opacity-50"
      >
        <Smartphone size={14} />
        Pay {formatLKR(total)} via PayHere
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Checkout Page
// ─────────────────────────────────────────────────────────────
import React from 'react'

type Step = 'address' | 'payment' | 'success'
type PayMethod = 'stripe' | 'payhere'

export default function CheckoutPage() {
  const { items, total: getTotal, clearCart } = useCartStore()
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [params]  = useSearchParams()

  const subtotal    = getTotal()
  const shippingCost = subtotal > 20000 ? 0 : 750
  const grandTotal   = subtotal + shippingCost

  const [step, setStep]         = useState<Step>('address')
  const [payMethod, setPayMethod] = useState<PayMethod>('stripe')
  const [orderId, setOrderId]   = useState('')
  const [addr, setAddr] = useState<Address>({
    name: user?.name || '', line1: '', line2: '',
    city: '', postalCode: '', country: 'Sri Lanka', phone: '',
  })

  // If redirected back from PayHere, poll order status
  useEffect(() => {
    const oid = params.get('orderId')
    if (oid) {
      api.get(`/payment/order/${oid}`)
        .then(r => {
          if (r.data.paymentStatus === 'paid') {
            setOrderId(oid)
            setStep('success')
            clearCart()
          }
        }).catch(() => {})
    }
  }, [])

  const handleSuccess = (oid: string) => {
    setOrderId(oid)
    setStep('success')
    clearCart()
  }

  const cartItems = items.map(i => ({
    productId: i.productId,
    name:      i.name,
    price:     i.price,
    quantity:  i.quantity,
    size:      i.size,
    image:     i.image,
  }))

  // ── Empty cart ──
  if (items.length === 0 && step !== 'success') {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="heading-display text-3xl mb-4">Your bag is empty</p>
          <Link to="/collection" className="btn-gold">Shop Collection</Link>
        </div>
      </main>
    )
  }

  // ── Success ──
  if (step === 'success') {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={56} className="text-[var(--accent-sage)] mx-auto mb-6" />
          </motion.div>
          <h2 className="heading-display text-3xl mb-2">Order Confirmed!</h2>
          <p className="text-[var(--text-muted)] mb-6">
            A confirmation email is on its way to you. Your handwoven linen is being prepared with care.
          </p>
          {orderId && (
            <div className="glass rounded-xl p-4 mb-6 text-left">
              <p className="mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Order Reference</p>
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

  return (
    <main className="pt-28 min-h-screen">
      <div className="container-xl pb-24">
        <Reveal className="mb-10">
          <h1 className="heading-display text-[clamp(2rem,5vw,4rem)]">Checkout</h1>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

          {/* ── Left: Steps ── */}
          <div className="space-y-6">

            {/* Step 1 — Address */}
            <Reveal>
              <div className={`glass rounded-3xl p-8 border transition-all ${step === 'address' ? 'border-[var(--accent-gold)]' : 'border-[var(--border)]'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mono text-xs font-bold ${step === 'address' ? 'bg-[var(--accent-gold)] text-[#2C2418]' : 'bg-[var(--accent-sage)] text-white'}`}>
                    {step === 'address' ? '1' : '✓'}
                  </div>
                  <h2 className="heading-display text-xl">Shipping Address</h2>
                </div>

                {step === 'address' ? (
                  <AddressForm addr={addr} onChange={setAddr} onNext={() => setStep('payment')} />
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--text-muted)]">
                      {addr.name} · {addr.line1} · {addr.city}
                    </p>
                    <button onClick={() => setStep('address')} className="text-[var(--accent-gold)] mono text-xs underline">Edit</button>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Step 2 — Payment */}
            <Reveal delay={0.1}>
              <div className={`glass rounded-3xl p-8 border transition-all ${step === 'payment' ? 'border-[var(--accent-gold)]' : 'border-[var(--border)] opacity-60 pointer-events-none'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] text-[#2C2418] flex items-center justify-center mono text-xs font-bold">2</div>
                  <h2 className="heading-display text-xl">Payment</h2>
                  <Lock size={14} className="text-[var(--text-muted)] ml-auto" />
                </div>

                {step === 'payment' && (
                  <>
                    {/* Method selector */}
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => setPayMethod('stripe')}
                        className={`flex-1 flex items-center gap-2 p-3 rounded-xl border transition-all ${payMethod === 'stripe' ? 'border-[var(--accent-gold)] bg-[var(--glow)]' : 'border-[var(--border)]'}`}
                      >
                        <CreditCard size={16} className="text-[var(--accent-gold)]" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Card (Stripe)</p>
                          <p className="mono text-[10px] text-[var(--text-muted)]">International · Visa · Mastercard</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setPayMethod('payhere')}
                        className={`flex-1 flex items-center gap-2 p-3 rounded-xl border transition-all ${payMethod === 'payhere' ? 'border-[var(--accent-gold)] bg-[var(--glow)]' : 'border-[var(--border)]'}`}
                      >
                        <Smartphone size={16} className="text-[#FF6B00]" />
                        <div className="text-left">
                          <p className="text-sm font-medium">PayHere</p>
                          <p className="mono text-[10px] text-[var(--text-muted)]">Sri Lanka · eZ Cash · FriMi</p>
                        </div>
                      </button>
                    </div>

                    {/* Payment form */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={payMethod}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {payMethod === 'stripe' ? (
                          <Elements stripe={stripePromise}>
                            <StripePaymentForm
                              cartItems={cartItems}
                              shippingAddress={addr}
                              subtotal={subtotal}
                              shippingCost={shippingCost}
                              total={grandTotal}
                              onSuccess={handleSuccess}
                            />
                          </Elements>
                        ) : (
                          <PayHerePaymentForm
                            cartItems={cartItems}
                            shippingAddress={addr}
                            subtotal={subtotal}
                            shippingCost={shippingCost}
                            total={grandTotal}
                            onSuccess={handleSuccess}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </div>
            </Reveal>
          </div>

          {/* ── Right: Order summary ── */}
          <Reveal delay={0.15}>
            <div className="glass-strong rounded-3xl p-6 sticky top-28">
              <h2 className="heading-display text-xl mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3 items-center">
                    <div className="relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--text-primary)] text-[var(--bg)] rounded-full flex items-center justify-center mono text-[10px]">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                      <p className="mono text-[10px] text-[var(--text-muted)]">Size {item.size}</p>
                    </div>
                    <p className="mono text-sm flex-shrink-0">{formatLKR(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="divider mb-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Subtotal</span>
                  <span>{formatLKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-[var(--accent-sage)]' : ''}>
                    {shippingCost === 0 ? 'Free' : formatLKR(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="mono text-[10px] text-[var(--text-muted)]">Free shipping on orders over LKR 20,000</p>
                )}
                <div className="divider my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">Total</span>
                  <span className="heading-display text-2xl text-[var(--accent-gold)]">{formatLKR(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-2">
                <div className="flex items-center gap-2">
                  <Lock size={11} className="text-[var(--accent-sage)]" />
                  <p className="mono text-[10px] text-[var(--text-muted)]">SSL encrypted · Secure checkout</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={11} className="text-[var(--accent-sage)]" />
                  <p className="mono text-[10px] text-[var(--text-muted)]">Confirmation email sent instantly</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={11} className="text-[var(--accent-sage)]" />
                  <p className="mono text-[10px] text-[var(--text-muted)]">Stock reserved until payment completes</p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </main>
  )
}
