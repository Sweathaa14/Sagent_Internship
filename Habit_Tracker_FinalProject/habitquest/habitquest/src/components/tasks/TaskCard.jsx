import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Calendar, Flag, MoreVertical, Trash2, Edit2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const PRIORITY_CONFIG = {
  high: { color: 'text-red-500 bg-red-50 dark:bg-red-900/20', label: 'High', icon: '🔴' },
  medium: { color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20', label: 'Medium', icon: '🟡' },
  low: { color: 'text-green-500 bg-green-50 dark:bg-green-900/20', label: 'Low', icon: '🟢' },
}

export default function TaskCard({ task, onComplete, onEdit, onDelete, index = 0 }) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [completing, setCompleting] = useState(false)

  const isOverdue = task.dueDate && !task.completed && dayjs(task.dueDate).isBefore(dayjs(), 'day')
  const isDueToday = task.dueDate && dayjs(task.dueDate).isSame(dayjs(), 'day')
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium

  const handleComplete = async () => {
    if (completing || task.completed) return
    setCompleting(true)
    await onComplete(task.id)
    setCompleting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`task-card ${isOverdue ? 'overdue' : ''} ${task.completed ? 'completed' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Complete button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleComplete}
          disabled={completing || task.completed}
          className="flex-shrink-0 mt-0.5"
        >
          {task.completed
            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
            : completing
              ? <div className="w-5 h-5 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
              : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-primary-400 transition-colors" />
          }
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={`font-bold text-gray-800 dark:text-gray-100 text-sm leading-snug
                ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.title || task.name}
              </h4>
              {task.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
              )}
            </div>

            {/* Menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10 min-w-[120px]">
                  <button
                    onClick={() => { onEdit(task); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(task.id); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Priority */}
            <span className={`badge text-xs ${priority.color}`}>
              {priority.icon} {priority.label}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs font-semibold
                ${isOverdue ? 'text-red-500' : isDueToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {isOverdue && <AlertCircle className="w-3 h-3" />}
                <Calendar className="w-3 h-3" />
                {isOverdue ? t('tasks.overdue') + ' — ' : isDueToday ? t('tasks.dueToday') + ' — ' : ''}
                {dayjs(task.dueDate).format('MMM D')}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
