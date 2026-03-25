import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

export default function CalendarView({ habits = [], tasks = [] }) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(dayjs())
  const [selected, setSelected] = useState(dayjs())
  const [direction, setDirection] = useState(1)

  const startOfMonth = current.startOf('month')
  const endOfMonth = current.endOf('month')
  const startDay = startOfMonth.day()
  const daysInMonth = endOfMonth.date()

  const navigate = (dir) => {
    setDirection(dir)
    setCurrent(c => c.add(dir, 'month'))
  }

  // Build day activity map
  const activityMap = {}

  tasks.forEach(task => {
    if (task.completedAt) {
      const key = dayjs(task.completedAt).format('YYYY-MM-DD')
      if (!activityMap[key]) activityMap[key] = { completedTasks: 0, missedTasks: 0, completedHabits: 0, missedHabits: 0 }
      activityMap[key].completedTasks++
    }
    if (task.dueDate && !task.completed && dayjs(task.dueDate).isBefore(dayjs(), 'day')) {
      const key = dayjs(task.dueDate).format('YYYY-MM-DD')
      if (!activityMap[key]) activityMap[key] = { completedTasks: 0, missedTasks: 0, completedHabits: 0, missedHabits: 0 }
      activityMap[key].missedTasks++
    }
  })

  habits.forEach(habit => {
    if (habit.completionHistory) {
      habit.completionHistory.forEach(date => {
        const key = dayjs(date).format('YYYY-MM-DD')
        if (!activityMap[key]) activityMap[key] = { completedTasks: 0, missedTasks: 0, completedHabits: 0, missedHabits: 0 }
        activityMap[key].completedHabits++
      })
    }
  })

  const getDayStatus = (dateStr) => {
    const activity = activityMap[dateStr]
    if (!activity) return null
    const total = activity.completedHabits + activity.completedTasks + activity.missedHabits + activity.missedTasks
    const completed = activity.completedHabits + activity.completedTasks
    if (total === 0) return null
    const rate = completed / total
    if (rate === 1) return 'completed'
    if (rate === 0) return 'missed'
    return 'partial'
  }

  const statusColors = {
    completed: 'bg-green-400',
    missed: 'bg-red-400',
    partial: 'bg-yellow-400',
  }

  const selectedKey = selected.format('YYYY-MM-DD')
  const selectedActivity = activityMap[selectedKey]

  // Build grid
  const cells = []
  for (let i = 0; i < startDay; i++) {
    cells.push({ day: null, date: null, otherMonth: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = current.date(d)
    cells.push({ day: d, date, otherMonth: false })
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, date: null, otherMonth: true })

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            key={current.format('YYYY-MM')}
            initial={{ opacity: 0, y: direction > 0 ? -12 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-black text-gray-800 dark:text-gray-100"
          >
            {current.format('MMMM YYYY')}
          </motion.h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setCurrent(dayjs()); setSelected(dayjs()) }}
              className="px-4 py-1.5 rounded-xl text-sm font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 hover:bg-primary-200 transition-colors"
            >
              {t('calendar.today')}
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs font-black text-gray-400 dark:text-gray-500 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.format('YYYY-MM')}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 30 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-7 gap-1"
          >
            {cells.map((cell, idx) => {
              if (cell.otherMonth) return <div key={idx} />
              const dateStr = cell.date.format('YYYY-MM-DD')
              const isToday = cell.date.isSame(dayjs(), 'day')
              const isSelected = cell.date.isSame(selected, 'day')
              const status = getDayStatus(dateStr)
              const isFuture = cell.date.isAfter(dayjs(), 'day')

              return (
                <motion.button
                  key={dateStr}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelected(cell.date)}
                  className={`calendar-day relative
                    ${isSelected ? 'selected' : ''}
                    ${isToday && !isSelected ? 'today' : ''}
                    ${isFuture ? 'opacity-50' : ''}`}
                >
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                    {cell.day}
                  </span>
                  {status && !isFuture && (
                    <div className="flex gap-0.5 mt-0.5 justify-center">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`} />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('calendar.legend')}:</span>
          {[
            { color: 'bg-green-400', label: t('calendar.completed') },
            { color: 'bg-yellow-400', label: t('calendar.partial') },
            { color: 'bg-red-400', label: t('calendar.missed') },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="glass-card p-5"
        >
          <h3 className="font-black text-gray-800 dark:text-gray-100 mb-3">
            {t('calendar.activity')} {selected.format('MMMM D, YYYY')}
          </h3>
          {!selectedActivity ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">{t('calendar.noActivity')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '✅ Habits Completed', value: selectedActivity.completedHabits, color: 'text-green-600 dark:text-green-400' },
                { label: '❌ Habits Missed', value: selectedActivity.missedHabits, color: 'text-red-500' },
                { label: '✅ Tasks Done', value: selectedActivity.completedTasks, color: 'text-green-600 dark:text-green-400' },
                { label: '⚠️ Tasks Overdue', value: selectedActivity.missedTasks, color: 'text-yellow-600 dark:text-yellow-400' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{item.label}</p>
                  <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
