import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/ui/Reveal'
import { formatLKR } from '../lib/utils'
import api from '../lib/api'
import { BarChart2, Package, ShoppingBag, Users, CheckCircle } from 'lucide-react'

interface Stats { orders: number; preorders: number; products: number; users: number; revenue: number }
interface Order  { _id: string; user: { name: string; email: string }; total: number; status: string; createdAt: string }

const STATUS_OPTS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminPage() {
  const { user } = useAuth()
  const [stats,  setStats]   = useState<Stats | null>(null)
  const [orders, setOrders]  = useState<Order[]>([])
  const [tab,    setTab]     = useState<'overview' | 'orders' | 'preorders'>('overview')

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/admin/orders').then(r => setOrders(r.data)).catch(() => {})
  }, [user])

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  const updateOrderStatus = async (id: string, status: string) => {
    await api.patch(`/admin/orders/${id}`, { status })
    setOrders(o => o.map(x => x._id === id ? { ...x, status } : x))
  }

  const STAT_CARDS = stats ? [
    { icon: ShoppingBag, label: 'Orders',    value: stats.orders    },
    { icon: Package,     label: 'Pre-orders',value: stats.preorders },
    { icon: BarChart2,   label: 'Revenue',   value: formatLKR(stats.revenue) },
    { icon: Users,       label: 'Users',     value: stats.users     },
  ] : []

  return (
    <main className="pt-28 min-h-screen">
      <div className="container-xl pb-24">
        <Reveal className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="nft-badge nft-genesis">ADMIN PANEL</span>
          </div>
          <h1 className="heading-display text-[clamp(2rem,5vw,4rem)]">Dashboard</h1>
        </Reveal>

        {/* Stat cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {STAT_CARDS.map(({ icon: Icon, label, value }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <div className="glass rounded-2xl p-5 border border-[var(--border)]">
                  <Icon size={20} className="text-[var(--accent-gold)] mb-3" />
                  <p className="heading-display text-3xl">{value}</p>
                  <p className="mono text-xs text-[var(--text-muted)]">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-2 mb-8">
          {(['overview', 'orders', 'preorders'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`mono text-xs px-4 py-2 rounded-full border transition-all capitalize ${tab === t ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Orders table */}
        {tab === 'orders' && (
          <Reveal>
            <div className="glass rounded-2xl overflow-hidden border border-[var(--border)]">
              <table className="w-full text-sm">
                <thead className="border-b border-[var(--border)]">
                  <tr className="text-left">
                    {['Order ID', 'Customer', 'Total', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)] mono text-xs">No orders yet. Run /api/products/seed to add products.</td></tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order._id} className="border-b border-[var(--border)] hover:bg-[var(--bg-alt)] transition-colors">
                        <td className="px-4 py-3 mono text-xs">{order._id?.slice(-8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{order.user?.name || 'Guest'}</p>
                          <p className="mono text-[10px] text-[var(--text-muted)]">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-3 mono text-sm">{formatLKR(order.total)}</td>
                        <td className="px-4 py-3">
                          <span className="mono text-xs capitalize">{order.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order._id, e.target.value)}
                            className="input-base py-1 text-xs w-auto"
                          >
                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}

        {tab === 'overview' && (
          <Reveal>
            <div className="glass rounded-2xl p-8 border border-[var(--border)]">
              <p className="heading-display text-2xl mb-4">Quick Actions</p>
              <div className="flex flex-wrap gap-3">
                <a href="/api/products/seed" target="_blank" rel="noopener" className="btn-outline text-sm">
                  Seed Products via API
                </a>
                <button onClick={() => setTab('orders')} className="btn-outline text-sm">
                  Manage Orders
                </button>
              </div>
              <div className="mt-6 glass rounded-xl p-4">
                <p className="mono text-[10px] text-[var(--text-muted)] mb-2 uppercase tracking-widest">API Endpoint</p>
                <p className="mono text-xs text-[var(--accent-gold)]">GET {import.meta.env.VITE_API_URL}/products/seed</p>
                <p className="mono text-[10px] text-[var(--text-muted)] mt-1">Run this once to populate the database with mock products</p>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  )
}
