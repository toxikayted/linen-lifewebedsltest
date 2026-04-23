import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/ui/Reveal'
import { formatLKR, shortHash } from '../lib/utils'
import api from '../lib/api'
import type { Order } from '../types'
import { LogOut, Package, User as UserIcon } from 'lucide-react'

export default function AccountPage() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user) return
    api.get('/orders').then(r => setOrders(r.data)).catch(() => setOrders([]))
  }, [user])

  if (!user) return <Navigate to="/login" replace />

  const STATUS_COLOR: Record<string, string> = {
    pending:    'text-yellow-500',
    confirmed:  'text-[var(--accent-sage)]',
    processing: 'text-[var(--accent-gold)]',
    shipped:    'text-blue-400',
    delivered:  'text-green-500',
    cancelled:  'text-red-400',
  }

  return (
    <main className="pt-28 min-h-screen">
      <div className="container-lg pb-24">
        {/* Header */}
        <Reveal className="mb-12 flex items-center justify-between">
          <div>
            <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-1">Account</p>
            <h1 className="heading-display text-[clamp(2rem,5vw,3.5rem)]">Hello, <i>{user.name}</i></h1>
          </div>
          <button onClick={logout} className="btn-outline flex items-center gap-2 text-sm">
            <LogOut size={14} /> Sign Out
          </button>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <Reveal>
            <div className="glass-strong rounded-3xl p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center">
                <UserIcon size={24} className="text-[var(--accent-gold)]" />
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="mono text-xs text-[var(--text-muted)]">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="nft-badge nft-genesis mt-1 inline-block">ADMIN</span>
                )}
              </div>
              <div className="divider" />
              <div>
                <p className="mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1">Wallet</p>
                <p className="mono text-xs text-[var(--text-muted)] truncate">
                  {user.walletAddress || 'Not connected'}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Orders */}
          <div className="lg:col-span-2 space-y-4">
            <Reveal>
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-[var(--accent-gold)]" />
                <h2 className="heading-display text-xl">Your Orders</h2>
                <span className="mono text-xs text-[var(--text-muted)]">({orders.length})</span>
              </div>
            </Reveal>

            {orders.length === 0 ? (
              <Reveal>
                <div className="glass rounded-2xl p-8 text-center">
                  <Package size={32} className="text-[var(--text-muted)] opacity-40 mx-auto mb-3" />
                  <p className="text-[var(--text-muted)]">No orders yet</p>
                </div>
              </Reveal>
            ) : (
              orders.map((order, i) => (
                <Reveal key={order._id} delay={i * 0.07}>
                  <div className="glass rounded-2xl p-5 border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="mono text-[10px] text-[var(--text-muted)]">Order ID</p>
                        <p className="mono text-xs">{order._id?.slice(-8).toUpperCase()}</p>
                      </div>
                      <span className={`mono text-xs font-semibold capitalize ${STATUS_COLOR[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex gap-2 mb-3 overflow-x-auto">
                      {order.items?.map((item: any, j: number) => (
                        <img key={j} src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="heading-display text-lg">{formatLKR(order.total)}</p>
                      {order.txHash && (
                        <div className="group relative">
                          <span className="mono text-[10px] text-[var(--accent-gold)] cursor-help">View TX</span>
                          <div className="absolute right-0 bottom-5 glass rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            <p className="mono text-[9px] text-[var(--text-muted)]">{order.txHash?.slice(0,20)}...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
