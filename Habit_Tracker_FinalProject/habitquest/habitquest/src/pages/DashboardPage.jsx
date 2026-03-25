import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { useHabits, useTasks } from '../hooks/useData'
import StatCard from '../components/common/StatCard'
import SmartSuggestions from '../components/common/SmartSuggestions'
import XPBar from '../components/gamification/XPBar'
import { motion } from 'framer-motion'
import { Zap, Flame, CheckSquare, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, xp, streak } = useApp()
  const { habits, completedToday, completionRate } = useHabits()
  const { tasks, pending, completed } = useTasks()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening'
  const name = user?.name?.split(' ')[0] || t('dashboard.hero')

  const todayTasks = pending.filter(t => t.dueDate && dayjs(t.dueDate).isSame(dayjs(), 'day'))
  const overdueTasks = pending.filter(t => t.dueDate && dayjs(t.dueDate).isBefore(dayjs(), 'day'))

  const progressPercent = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0

  return (
    <div>
      {/* Welcome */}
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">{greeting},</p>
          <h1 className="page-title">{name}! 👋</h1>
          <p className="page-subtitle">{t('dashboard.motivational')}</p>
        </motion.div>
      </div>

      {/* Smart Suggestions */}
      <SmartSuggestions habits={habits} tasks={tasks} streak={streak} />

      {/* XP Bar */}
      <div className="mb-6">
        <XPBar xp={xp} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Zap className="w-5 h-5" />} label={t('dashboard.xp')} value={xp} color="primary" delay={0.05} />
        <StatCard icon={<Flame className="w-5 h-5" />} label={t('dashboard.streak')} value={streak} unit={t('dashboard.days')} color="red" delay={0.1} />
        <StatCard icon={<CheckSquare className="w-5 h-5" />} label={t('dashboard.completed')} value={completed.length} unit={t('dashboard.tasks')} color="olive" delay={0.15} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label={t('dashboard.completionRate')} value={completionRate} unit="%" color="highlight" delay={0.2} />
      </div>

      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title mb-0">{t('dashboard.todayProgress')}</h3>
          <span className="text-2xl font-black text-primary-500">{progressPercent}%</span>
        </div>
        <div className="xp-bar h-4">
          <motion.div
            className="progress-bar-fill bg-gradient-to-r from-primary-400 to-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
          {completedToday} of {habits.length} habits completed today
        </p>
      </motion.div>

      {/* Two column: Today's Tasks + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">📋 Today's Tasks</h3>
            <Link to="/tasks" className="text-sm font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {todayTasks.length === 0 && overdueTasks.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium py-3">🎉 No urgent tasks! You're doing great!</p>
          ) : (
            <div className="space-y-2">
              {overdueTasks.slice(0, 2).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div>
                    <p className="font-bold text-sm text-red-700 dark:text-red-300">{task.title}</p>
                    <p className="text-xs text-red-500">{t('tasks.overdue')}</p>
                  </div>
                </div>
              ))}
              {todayTasks.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                  <span className="text-primary-500 text-lg">📌</span>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{task.title}</p>
                    <p className="text-xs text-primary-500 font-semibold">{t('tasks.dueToday')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <h3 className="section-title mb-4">⚡ {t('dashboard.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/habits', icon: '💪', label: 'Log Habit', color: 'from-primary-400 to-primary-600' },
              { to: '/tasks', icon: '✅', label: 'Add Task', color: 'from-olive-400 to-olive-600' },
              { to: '/calendar', icon: '📅', label: 'Calendar', color: 'from-accent-400 to-accent-600' },
              { to: '/progress', icon: '📊', label: 'Progress', color: 'from-highlight-400 to-highlight-500' },
            ].map(({ to, icon, label, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${color} text-white font-bold text-sm hover:shadow-lg transition-all duration-200 hover:scale-105`}
              >
                <span className="text-2xl">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Habits */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">🔥 Today's Habits</h3>
            <Link to="/habits" className="text-sm font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {habits.slice(0, 4).map(habit => (
              <div key={habit.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="text-xl">{habit.icon || '🎯'}</span>
                <span className="flex-1 font-semibold text-sm text-gray-700 dark:text-gray-300">{habit.name}</span>
                {habit.streak > 0 && (
                  <span className="text-xs font-bold text-orange-500">🔥 {habit.streak}</span>
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                  ${habit.completedToday ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                  {habit.completedToday ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
