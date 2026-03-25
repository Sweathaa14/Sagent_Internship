import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Lightbulb } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

export default function SmartSuggestions({ habits = [], tasks = [], streak = 0 }) {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState([])

  const suggestions = []

  // Streak warning
  if (streak > 0) {
    const pendingToday = habits.filter(h => !h.completedToday)
    if (pendingToday.length > 0) {
      suggestions.push({
        id: 'streak-warning',
        type: 'warning',
        icon: '⚠️',
        text: t('suggestions.streakWarning', { days: streak }),
        color: 'yellow',
      })
    }
  }

  // Overdue tasks
  const overdueTasks = tasks.filter(t => t.dueDate && dayjs(t.dueDate).isBefore(dayjs(), 'day') && !t.completed)
  if (overdueTasks.length > 0) {
    suggestions.push({
      id: 'overdue-tasks',
      type: 'alert',
      icon: '⏰',
      text: t('suggestions.dueSoon', { count: overdueTasks.length }),
      color: 'red',
    })
  }

  // All habits done today
  const allDone = habits.length > 0 && habits.every(h => h.completedToday)
  if (allDone) {
    suggestions.push({
      id: 'all-done',
      type: 'success',
      icon: '🌟',
      text: t('suggestions.greatJob'),
      color: 'green',
    })
  }

  // Time-based tip
  const hour = new Date().getHours()
  if (hour < 10 && habits.length > 0) {
    suggestions.push({ id: 'morning-tip', type: 'tip', icon: '🌅', text: t('suggestions.morningTip'), color: 'blue' })
  } else if (hour >= 20) {
    suggestions.push({ id: 'evening-tip', type: 'tip', icon: '🌙', text: t('suggestions.eveningTip'), color: 'purple' })
  }

  const colorMap = {
    yellow: 'bg-highlight-50 dark:bg-highlight-900/20 border-highlight-200 dark:border-highlight-700 text-highlight-800 dark:text-highlight-200',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300',
    blue: 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-700 text-accent-700 dark:text-accent-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300',
  }

  const visible = suggestions.filter(s => !dismissed.includes(s.id))
  if (visible.length === 0) return null

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-highlight-500" />
        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Smart Suggestions</span>
      </div>
      <AnimatePresence>
        {visible.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16, height: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-start gap-3 p-3 rounded-xl border text-sm font-semibold ${colorMap[s.color] || colorMap.blue}`}
          >
            <span className="text-base flex-shrink-0">{s.icon}</span>
            <span className="flex-1">{s.text}</span>
            <button
              onClick={() => setDismissed(d => [...d, s.id])}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
