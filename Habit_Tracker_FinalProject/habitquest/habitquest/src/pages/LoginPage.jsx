import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { Eye, EyeOff, Target, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { t } = useTranslation()
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success(t('auth.loginSuccess'))
      navigate('/dashboard')
    } catch (err) {
      // Demo mode: allow login without backend
      if (!form.email || !form.password) {
        toast.error('Please enter email and password')
      } else {
        // Simulate successful login in demo
        const mockUser = { id: 1, name: form.email.split('@')[0], email: form.email }
        localStorage.setItem('habitquest_token', 'demo_token')
        localStorage.setItem('habitquest_user', JSON.stringify(mockUser))
        window.location.href = '/dashboard'
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh bg-orange-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-200 dark:shadow-primary-900/40 mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gradient">HabitQuest</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">{t('auth.welcome')}</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-solid p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-6">{t('auth.login')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.email')}</label>
              <input
                type="email"
                className="input-field"
                placeholder="hero@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3.5 text-base mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {t('common.loading')}
                </span>
              ) : (
                <><Zap className="w-5 h-5" /> {t('auth.signIn')}</>
              )}
            </motion.button>
          </form>

          <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <p className="text-xs text-primary-700 dark:text-primary-300 font-semibold text-center">
              🎮 Demo mode: enter any email & password to explore!
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5 font-medium">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 text-3xl hidden lg:block"
        >🎯</motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="absolute top-32 right-16 text-2xl hidden lg:block"
        >⚡</motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-32 left-20 text-2xl hidden lg:block"
        >🏆</motion.div>
      </div>
    </div>
  )
}
