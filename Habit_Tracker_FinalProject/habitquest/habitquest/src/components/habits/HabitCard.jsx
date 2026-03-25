import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Flame, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const COLORS = {
  orange: 'from-primary-400 to-primary-600',
  green: 'from-olive-400 to-olive-600',
  yellow: 'from-highlight-400 to-highlight-500',
  blue: 'from-accent-400 to-accent-600',
  purple: 'from-purple-400 to-purple-600',
  red: 'from-red-400 to-red-600',
}

const ICONS = {
  '💪': 'Workout', '📚': 'Study', '🧘': 'Meditate', '🏃': 'Run',
  '💧': 'Water', '🛌': 'Sleep', '✍️': 'Journal', '🥗': 'Eat Well',
  '🎯': 'Focus', '🎨': 'Create',
}

export default function HabitCard({ habit, onComplete, onEdit, onDelete, index = 0 }) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [completing, setCompleting] = useState(false)

  const handleComplete = async () => {
    if (completing || habit.completedToday) return
    setCompleting(true)
    await onComplete(habit.id)
    setCompleting(false)
  }

  const completionPercent = habit.weeklyCompletions
    ? Math.round((habit.weeklyCompletions / 7) * 100)
    : habit.completedToday ? 100 : 0

  const color = COLORS[habit.color] || COLORS.orange

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`habit-card ${habit.completedToday ? 'completed' : ''} relative overflow-hidden`}
    >
      {/* Color accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${color} rounded-l-2xl`} />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl shadow-sm`}>
              {habit.icon || '🎯'}
            </div>
            <div>
              <h3 className={`font-black text-gray-800 dark:text-gray-100 leading-tight
                ${habit.completedToday ? 'line-through opacity-60' : ''}`}>
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{habit.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak badge */}
            {(habit.streak || 0) > 0 && (
              <div className="streak-badge">
                <span className="fire-emoji">🔥</span>
                {habit.streak} {t('habits.streak')}
              </div>
            )}

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10 min-w-[130px]"
                  onBlur={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => { onEdit(habit); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(habit.id); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium">
            <span>Weekly progress</span>
            <span>{completionPercent}%</span>
          </div>
          <div className="xp-bar">
            <motion.div
              className={`progress-bar-fill bg-gradient-to-r ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 }}
            />
          </div>
        </div>

        {/* Complete button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          disabled={completing}
          className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200
            ${habit.completedToday
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default'
              : `bg-gradient-to-r ${color} text-white shadow-sm hover:shadow-md active:scale-98`}`}
        >
          {habit.completedToday ? (
            <><CheckCircle2 className="w-4 h-4" /> {t('habits.completed')}</>
          ) : completing ? (
            <span className="animate-pulse">{t('common.loading')}</span>
          ) : (
            <><Circle className="w-4 h-4" /> {t('habits.complete')}</>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
