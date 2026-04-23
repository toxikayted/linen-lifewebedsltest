import { useEffect, useState } from 'react'

interface Props {
  deadline: string | Date
  label?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ deadline, label = 'Pre-order closes in' }: Props) {
  const calc = (): TimeLeft => {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    }
  }

  const [t, setT] = useState<TimeLeft>(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [deadline])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="space-y-2">
      <p className="mono text-xs text-[var(--text-muted)] uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-3">
        {[{ v: t.days, l: 'Days' }, { v: t.hours, l: 'Hrs' }, { v: t.minutes, l: 'Min' }, { v: t.seconds, l: 'Sec' }].map(({ v, l }) => (
          <div key={l} className="text-center">
            <div className="glass w-14 h-14 flex items-center justify-center rounded-xl border border-[var(--border)] glow-border">
              <span className="mono text-xl font-semibold text-[var(--accent-gold)]">{pad(v)}</span>
            </div>
            <p className="mono text-[10px] text-[var(--text-muted)] mt-1 uppercase">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
