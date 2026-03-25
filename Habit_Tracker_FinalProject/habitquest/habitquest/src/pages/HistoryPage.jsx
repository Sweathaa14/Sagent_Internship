import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTasks } from '../hooks/useData'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Calendar, Filter } from 'lucide-react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)

const FILTERS = [
  { key: 'today', label: 'today' },
  { key: 'week', label: 'week' },
  { key: 'month', label: 'month' },
  { key: 'all', label: 'all' },
]

export default function HistoryPage() {
  const { t } = useTranslation()
  const { tasks } = useTasks()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const completed = useMemo(() => {
    return tasks
      .filter(t => t.completed)
      .filter(t => {
        const completedAt = t.completedAt ? dayjs(t.completedAt) : null
        if (!completedAt) return filter === 'all'
        if (filter === 'today') return completedAt.isSame(dayjs(), 'day')
        if (filter === 'week') return completedAt.isSameOrAfter(dayjs().startOf('week'))
        if (filter === 'month') return completedAt.isSameOrAfter(dayjs().startOf('month'))
        return true
      })
      .filter(t => {
        if (!search.trim()) return true
        return (t.title || t.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (t.description || '').toLowerCase().includes(search.toLowerCase())
      })
      .sort((a, b) => dayjs(b.completedAt).diff(dayjs(a.completedAt)))
  }, [tasks, filter, search])

  // Group by date
  const grouped = useMemo(() => {
    const groups = {}
    completed.forEach(task => {
      const date = task.completedAt ? dayjs(task.completedAt).format('YYYY-MM-DD') : 'Unknown'
      if (!groups[date]) groups[date] = []
      groups[date].push(task)
    })
    return Object.entries(groups).sort(([a], [b]) => dayjs(b).diff(dayjs(a)))
  }, [completed])

  const PRIORITY_COLORS = {
    high: 'bg-red-100 dark:bg-red-900/20 text-red-600',
    medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600',
    low: 'bg-green-100 dark:bg-green-900/20 text-green-600',
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('history.title')}</h1>
        <p className="page-subtitle">{t('history.subtitle')}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder={t('history.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all
                ${filter === f.key
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {t(`history.${f.label}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-6">
        <div className="glass-card px-5 py-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="font-black text-gray-800 dark:text-gray-100">{completed.length}</span>
          <span className="text-sm text-gray-500 font-medium">completed</span>
        </div>
      </div>

      {/* Timeline */}
      {grouped.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass-card"
        >
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-400 dark:text-gray-500 font-medium">{t('history.empty')}</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {grouped.map(([date, dateTasks], groupIdx) => {
              const isToday = dayjs(date).isSame(dayjs(), 'day')
              const isYesterday = dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
              const displayDate = isToday ? 'Today' : isYesterday ? 'Yesterday' : dayjs(date).format('MMMM D, YYYY')

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.05 }}
                >
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span className="font-black text-gray-700 dark:text-gray-200">{displayDate}</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      {dateTasks.length} tasks
                    </span>
                  </div>

                  {/* Task list */}
                  <div className="space-y-2 ml-2 pl-4 border-l-2 border-primary-100 dark:border-primary-900">
                    {dateTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="glass-card-solid p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 dark:text-gray-100 text-sm line-through opacity-70">
                              {task.title || task.name}
                            </p>
                            {task.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              {task.priority && (
                                <span className={`badge text-xs ${PRIORITY_COLORS[task.priority]}`}>
                                  {task.priority}
                                </span>
                              )}
                              {task.completedAt && (
                                <span className="text-xs text-gray-400 font-medium">
                                  {t('history.completedOn')} {dayjs(task.completedAt).format('h:mm A')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
