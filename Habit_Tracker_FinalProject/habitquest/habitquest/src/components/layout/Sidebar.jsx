import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Zap, CheckSquare, History,
  Calendar, TrendingUp, User, LogOut, X, Target
} from 'lucide-react'
import XPBar from '../gamification/XPBar'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { path: '/habits', icon: Zap, key: 'habits' },
  { path: '/tasks', icon: CheckSquare, key: 'tasks' },
  { path: '/history', icon: History, key: 'history' },
  { path: '/calendar', icon: Calendar, key: 'calendar' },
  { path: '/progress', icon: TrendingUp, key: 'progress' },
  { path: '/profile', icon: User, key: 'profile' },
]

export default function Sidebar({ onClose }) {
  const { t } = useTranslation()
  const { user, logout, getLevelInfo, xp } = useApp()
  const navigate = useNavigate()
  const levelInfo = getLevelInfo()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="h-full bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-100 dark:border-gray-800 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-primary-900/40">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black text-gradient">{t('app.name')}</span>
            <p className="text-xs text-gray-400 font-medium -mt-0.5">{t('app.tagline')}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Level Card */}
      {user && (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-primary-50 to-highlight-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-primary-100 dark:border-gray-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
              {user.name?.charAt(0)?.toUpperCase() || 'H'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{user.name || 'Hero'}</p>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                {levelInfo.emoji} {levelInfo.title}
              </p>
            </div>
          </div>
          <XPBar xp={xp} compact />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item, idx) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <NavLink
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{t(`nav.${item.key}`)}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full nav-item text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('auth.logout')}</span>
        </button>
      </div>
    </div>
  )
}
