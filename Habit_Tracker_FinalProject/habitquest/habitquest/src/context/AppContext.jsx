import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/api'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const AppContext = createContext(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Beginner', emoji: '🌱' },
  { level: 2, xpRequired: 100, title: 'Explorer', emoji: '🗺️' },
  { level: 3, xpRequired: 250, title: 'Warrior', emoji: '⚔️' },
  { level: 4, xpRequired: 500, title: 'Champion', emoji: '🏆' },
  { level: 5, xpRequired: 1000, title: 'Legend', emoji: '⭐' },
  { level: 6, xpRequired: 2000, title: 'Master', emoji: '🔮' },
  { level: 7, xpRequired: 3500, title: 'Grandmaster', emoji: '👑' },
  { level: 8, xpRequired: 5000, title: 'Mythic', emoji: '🌟' },
  { level: 9, xpRequired: 7500, title: 'Divine', emoji: '✨' },
  { level: 10, xpRequired: 10000, title: 'God Mode', emoji: '🚀' },
]

export const getLevelInfo = (xp) => {
  let currentLevel = LEVELS[0]
  let nextLevel = LEVELS[1]
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i]
      nextLevel = LEVELS[i + 1] || LEVELS[i]
      break
    }
  }
  const xpInLevel = xp - currentLevel.xpRequired
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired
  const progress = nextLevel === currentLevel ? 100 : Math.min((xpInLevel / xpNeeded) * 100, 100)
  return { ...currentLevel, nextLevel, xpInLevel, xpNeeded, progress }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('habitquest_user')) } catch { return null }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('habitquest_theme') || 'light')
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('habitquest_xp') || '0'))
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('habitquest_streak') || '0'))
  const [badges, setBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('habitquest_badges') || '[]') } catch { return [] }
  })
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('habitquest_theme', theme)
  }, [theme])

  useEffect(() => { localStorage.setItem('habitquest_xp', xp) }, [xp])
  useEffect(() => { localStorage.setItem('habitquest_streak', streak) }, [streak])
  useEffect(() => { localStorage.setItem('habitquest_badges', JSON.stringify(badges)) }, [badges])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { token, user: userData } = res.data
    localStorage.setItem('habitquest_token', token)
    localStorage.setItem('habitquest_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res = await authService.register(data)
    const { token, user: userData } = res.data
    localStorage.setItem('habitquest_token', token)
    localStorage.setItem('habitquest_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('habitquest_token')
    localStorage.removeItem('habitquest_user')
    setUser(null)
  }

  const awardXP = useCallback((amount, reason = '') => {
    const prevXp = xp
    const newXp = xp + amount
    const prevLevel = getLevelInfo(prevXp)
    const newLevel = getLevelInfo(newXp)
    setXp(newXp)
    toast.success(`+${amount} XP${reason ? ` — ${reason}` : ''}`, { icon: '⚡', duration: 2000 })
    if (newLevel.level > prevLevel.level) {
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
        toast.success(`🎉 Level Up! You're now Level ${newLevel.level} — ${newLevel.title}!`, { duration: 4000 })
      }, 300)
    }
  }, [xp])

  const celebrateStreak = useCallback((days) => {
    if (days > 0 && days % 7 === 0) {
      confetti({ particleCount: 80, spread: 60, colors: ['#f97316', '#facc15', '#7d9440'] })
      toast.success(`🔥 ${days}-Day Streak! Incredible!`, { duration: 3000 })
    }
  }, [])

  const unlockBadge = useCallback((badge) => {
    if (!badges.find(b => b.id === badge.id)) {
      setBadges(prev => [...prev, { ...badge, unlockedAt: new Date().toISOString() }])
      confetti({ particleCount: 60, spread: 45 })
      toast.success(`🏆 Badge Unlocked: ${badge.name}!`, { duration: 3500 })
    }
  }, [badges])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const sendBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.svg' })
    }
  }

  const value = {
    user, login, register, logout,
    theme, toggleTheme,
    xp, setXp, awardXP,
    streak, setStreak, celebrateStreak,
    badges, unlockBadge,
    notifications, setNotifications,
    requestNotificationPermission, sendBrowserNotification,
    getLevelInfo: () => getLevelInfo(xp),
    LEVELS,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
