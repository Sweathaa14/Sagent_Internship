import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function AnimatedCounter({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const to = typeof value === 'number' ? value : 0

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return <span>{display.toLocaleString()}</span>
}

export default function StatCard({ icon, label, value, unit, color = 'primary', trend, delay = 0 }) {
  const colorMap = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    olive: 'bg-olive-100 dark:bg-olive-900/30 text-olive-600 dark:text-olive-400',
    highlight: 'bg-highlight-100 dark:bg-highlight-900/30 text-highlight-600 dark:text-highlight-400',
    accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{label}</p>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-black text-gray-800 dark:text-gray-100">
            <AnimatedCounter value={typeof value === 'number' ? value : 0} />
          </span>
          {unit && <span className="text-sm text-gray-400 mb-1 font-medium">{unit}</span>}
        </div>
        {trend !== undefined && (
          <p className={`text-xs font-bold mt-0.5 ${trend >= 0 ? 'text-green-500' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last week
          </p>
        )}
      </div>
    </motion.div>
  )
}
