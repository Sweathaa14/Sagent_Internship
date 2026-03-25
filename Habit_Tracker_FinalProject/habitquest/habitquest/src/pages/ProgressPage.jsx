import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { useHabits, useTasks } from '../hooks/useData'
import XPBar from '../components/gamification/XPBar'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import dayjs from 'dayjs'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
        <p className="font-bold text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-black text-sm" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Generate last 7 days of mock data
function generateWeeklyData(habits, tasks) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().subtract(6 - i, 'day')
    return {
      day: date.format('ddd'),
      habits: Math.floor(Math.random() * (habits.length || 4)) + (habits.length || 3),
      tasks: Math.floor(Math.random() * 5) + 1,
      xp: Math.floor(Math.random() * 80) + 20,
    }
  })
}

export default function ProgressPage() {
  const { t } = useTranslation()
  const { xp, streak } = useApp()
  const { habits } = useHabits()
  const { tasks, completed } = useTasks()

  const weeklyData = generateWeeklyData(habits, tasks)
  const xpData = Array.from({ length: 7 }, (_, i) => ({
    day: dayjs().subtract(6 - i, 'day').format('ddd'),
    xp: Math.floor(xp * (i + 1) / 7),
  }))

  const totalHabitsCompleted = completed.length + Math.floor(xp / 10)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('progress.title')}</h1>
        <p className="page-subtitle">{t('progress.subtitle')}</p>
      </div>

      {/* XP Bar */}
      <div className="mb-6">
        <XPBar xp={xp} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: t('progress.totalXP'), value: xp, emoji: '⚡', color: 'from-primary-400 to-primary-600' },
          { label: t('progress.bestStreak'), value: streak, emoji: '🔥', unit: 'days', color: 'from-red-400 to-red-600' },
          { label: 'Habits Done', value: habits.filter(h => h.completedToday).length, emoji: '💪', unit: `/ ${habits.length}`, color: 'from-olive-400 to-olive-600' },
          { label: 'Tasks Done', value: completed.length, emoji: '✅', color: 'from-accent-400 to-accent-600' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}
          >
            <span className="text-2xl">{s.emoji}</span>
            <p className="text-3xl font-black mt-2">{s.value.toLocaleString()}{s.unit ? <span className="text-lg font-semibold opacity-80"> {s.unit}</span> : ''}</p>
            <p className="text-sm font-semibold opacity-90 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly habits bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="section-title">{t('progress.weekly')} — Habits 💪</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="habits" name="Habits" fill="#f97316" radius={[6, 6, 0, 0]} />
              <Bar dataKey="tasks" name="Tasks" fill="#7d9440" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* XP growth line chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <h3 className="section-title">{t('progress.xpGrowth')} ⚡</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={xpData}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="xp" name="XP" stroke="#f97316" strokeWidth={2.5} fill="url(#xpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Habit completion trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <h3 className="section-title">{t('progress.habitTrends')} 📈</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="habits" name="Habits" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} />
              <Line type="monotone" dataKey="tasks" name="Tasks" stroke="#7d9440" strokeWidth={2.5} dot={{ r: 4, fill: '#7d9440' }} />
              <Line type="monotone" dataKey="xp" name="XP/10" stroke="#eab308" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Habit breakdown */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5"
        >
          <h3 className="section-title">Habit Performance</h3>
          <div className="space-y-3">
            {habits.map((habit, i) => {
              const rate = habit.weeklyCompletions ? Math.round((habit.weeklyCompletions / 7) * 100) : 0
              return (
                <div key={habit.id} className="flex items-center gap-3">
                  <span className="text-lg">{habit.icon || '🎯'}</span>
                  <span className="flex-1 font-semibold text-sm text-gray-700 dark:text-gray-300 truncate">{habit.name}</span>
                  <span className="text-xs font-bold text-orange-500 w-8 text-right">🔥{habit.streak || 0}</span>
                  <div className="w-24 xp-bar">
                    <motion.div
                      className="progress-bar-fill bg-gradient-to-r from-primary-400 to-primary-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${rate}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-9 text-right">{rate}%</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
