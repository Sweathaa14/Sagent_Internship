import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { useHabits, useTasks } from '../hooks/useData'
import XPBar from '../components/gamification/XPBar'
import BadgeGrid from '../components/gamification/BadgeGrid'
import RemindersPanel from '../components/reminders/RemindersPanel'
import { motion } from 'framer-motion'
import { Sun, Moon, Globe, Bell, User, Shield } from 'lucide-react'
import { useTranslation as useI18n } from 'react-i18next'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { i18n } = useI18n()
  const { user, xp, streak, badges, theme, toggleTheme, getLevelInfo, requestNotificationPermission } = useApp()
  const { habits } = useHabits()
  const { tasks, completed } = useTasks()

  const levelInfo = getLevelInfo()
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date()

  const handleNotifRequest = async () => {
    const granted = await requestNotificationPermission()
    if (granted) alert('Notifications enabled! 🔔')
    else alert('Please enable notifications in your browser settings.')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('profile.title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Profile card */}
        <div className="lg:col-span-1 space-y-5">
          {/* Avatar card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center"
          >
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-4xl text-white font-black shadow-xl shadow-primary-200 dark:shadow-primary-900/40">
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-highlight-400 rounded-full flex items-center justify-center text-sm border-2 border-white dark:border-gray-800">
                {levelInfo.emoji}
              </div>
            </div>
            <h2 className="text-xl font-black text-gray-800 dark:text-gray-100">{user?.name || 'Hero'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <span className="text-primary-600 dark:text-primary-400 font-black text-sm">
                {levelInfo.emoji} {t('profile.level')} {levelInfo.level} — {levelInfo.title}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                { label: t('profile.totalHabits'), value: habits.length },
                { label: t('profile.totalTasks'), value: completed.length },
                { label: '🔥 Streak', value: streak },
              ].map(s => (
                <div key={s.label} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-black text-gray-800 dark:text-gray-100">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* XP bar */}
          <XPBar xp={xp} />

          {/* Settings card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5 space-y-3"
          >
            <h3 className="section-title">{t('profile.settings')}</h3>

            {/* Theme toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-accent-500" /> : <Sun className="w-4 h-4 text-highlight-500" />}
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {theme === 'dark' ? t('common.darkMode') : t('common.lightMode')}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative
                  ${theme === 'dark' ? 'bg-accent-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                  ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-olive-500" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('profile.language')}</span>
              </div>
              <div className="flex gap-1">
                {[['en', '🇺🇸'], ['es', '🇪🇸']].map(([code, flag]) => (
                  <button
                    key={code}
                    onClick={() => i18n.changeLanguage(code)}
                    className={`px-2 py-1 rounded-lg text-sm font-bold transition-all
                      ${i18n.language.startsWith(code)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <button
              onClick={handleNotifRequest}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('profile.notifications')}</span>
              </div>
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-lg font-bold">
                Enable
              </span>
            </button>
          </motion.div>
        </div>

        {/* Right column: Badges + Reminders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <h3 className="section-title">{t('profile.achievements')} 🏆</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
              {badges.length} / 10 badges unlocked
            </p>
            <BadgeGrid earned={badges} />
          </motion.div>

          {/* Reminders panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <RemindersPanel />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
